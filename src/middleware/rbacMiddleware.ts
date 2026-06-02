import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

declare module 'express-session' {
  interface SessionData {
    user?: { id: number; username: string; role_id: number };
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session?.user?.id;
    if (!userId) return res.redirect('/auth/login');

    const [rows] = await pool.query(
      `SELECT p.name FROM users u
       JOIN roles r ON u.role_id = r.id
       JOIN role_permissions rp ON r.id = rp.role_id
       JOIN permissions p ON rp.permission_id = p.id
       WHERE u.id = ?`,
      [userId]
    ) as any[];

    const permissions: string[] = rows.map((row: any) => row.name);

    if (permissions.includes(requiredPermission)) {
      // Simpan permissions ke res.locals agar bisa dipakai di view
      res.locals.permissions = permissions;
      res.locals.user = req.session.user;
      next();
    } else {
      res.status(403).render('403', { 
        title: 'Akses Ditolak',
        user: req.session.user 
      });
    }
  };
};

export const loadUserPermissions = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.user?.id) {
    const [rows] = await pool.query(
      `SELECT p.name FROM users u
       JOIN roles r ON u.role_id = r.id
       JOIN role_permissions rp ON r.id = rp.role_id
       JOIN permissions p ON rp.permission_id = p.id
       WHERE u.id = ?`,
      [req.session.user.id]
    ) as any[];
    res.locals.permissions = rows.map((r: any) => r.name);
    res.locals.user = req.session.user;
  } else {
    res.locals.permissions = [];
    res.locals.user = null;
  }
  next();
};
