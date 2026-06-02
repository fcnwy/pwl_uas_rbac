import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  role_id: number;
  role_name?: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.query<User[]>(
    `SELECT u.*, r.name as role_name 
     FROM users u 
     LEFT JOIN roles r ON u.role_id = r.id`
  );
  return rows;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const [rows] = await pool.query<User[]>(
    'SELECT * FROM users WHERE id = ?', [id]
  );
  return rows[0] || null;
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const [rows] = await pool.query<User[]>(
    'SELECT * FROM users WHERE username = ?', [username]
  );
  return rows[0] || null;
};

export const createUser = async (data: { username: string; password: string; role_id: number }) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)',
    [data.username, data.password, data.role_id]
  );
  return result;
};

export const updateUser = async (id: number, data: { username: string; role_id: number }) => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE users SET username = ?, role_id = ? WHERE id = ?',
    [data.username, data.role_id, id]
  );
  return result;
};

export const deleteUser = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM users WHERE id = ?', [id]
  );
  return result;
};
