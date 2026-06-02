import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Permission extends RowDataPacket {
  id: number;
  name: string;
  resource: string;
  action: string;
}

export const getAllPermissions = async (): Promise<Permission[]> => {
  const [rows] = await pool.query<Permission[]>('SELECT * FROM permissions');
  return rows;
};

export const getPermissionsByRole = async (roleId: number): Promise<Permission[]> => {
  const [rows] = await pool.query<Permission[]>(
    `SELECT p.* FROM permissions p
     JOIN role_permissions rp ON p.id = rp.permission_id
     WHERE rp.role_id = ?`, [roleId]
  );
  return rows;
};

export const assignPermissionToRole = async (roleId: number, permissionId: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
    [roleId, permissionId]
  );
  return result;
};

export const removePermissionFromRole = async (roleId: number, permissionId: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?',
    [roleId, permissionId]
  );
  return result;
};
