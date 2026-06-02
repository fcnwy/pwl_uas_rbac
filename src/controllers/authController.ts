import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getUserByUsername } from '../models/userModel';

export const showLogin = (req: Request, res: Response) => {
  if (req.session?.user) return res.redirect('/users');
  res.render('auth/login', { title: 'Login', error: null });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  const user = await getUserByUsername(username);
  if (!user) {
    return res.render('auth/login', { title: 'Login', error: 'Username tidak ditemukan' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.render('auth/login', { title: 'Login', error: 'Password salah' });
  }

  req.session.user = { id: user.id, username: user.username, role_id: user.role_id };
  res.redirect('/users');
};

export const logout = (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};
