import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Role extends RowDataPacket {
  id: number;
  name: string;
  created_at?: Date;
}

export const getAllRoles = async (): Promise<Role[]> => {
  const [rows] = await pool.query<Role[]>('SELECT * FROM roles');
  return rows;
};

export const getRoleById = async (id: number): Promise<Role | null> => {
  const [rows] = await pool.query<Role[]>('SELECT * FROM roles WHERE id = ?', [id]);
  return rows[0] || null;
};

export const createRole = async (name: string) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO roles (name) VALUES (?)', [name]
  );
  return result;
};

export const deleteRole = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM roles WHERE id = ?', [id]
  );
  return result;
};
