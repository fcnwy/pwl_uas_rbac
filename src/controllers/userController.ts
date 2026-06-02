import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getAllUsers, createUser, deleteUser, getUserById, updateUser } from '../models/userModel';
import { getAllRoles } from '../models/roleModel';

export const listUsers = async (req: Request, res: Response) => {
  const users = await getAllUsers();
  const permissions = res.locals.permissions || [];
  res.render('users/list', { title: 'User Management', users, permissions });
};

export const showCreateForm = async (req: Request, res: Response) => {
  const roles = await getAllRoles();
  res.render('users/create', { title: 'Tambah User', roles, error: null });
};

export const storeUser = async (req: Request, res: Response) => {
  const { username, password, role_id } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await createUser({ username, password: hashed, role_id: parseInt(role_id) });
  res.redirect('/users');
};

export const showEditForm = async (req: Request, res: Response) => {
  const user = await getUserById(parseInt(req.params.id));
  const roles = await getAllRoles();
  res.render('users/edit', { title: 'Edit User', user, roles, error: null });
};

export const updateUserHandler = async (req: Request, res: Response) => {
  const { username, role_id } = req.body;
  await updateUser(parseInt(req.params.id), { username, role_id: parseInt(role_id) });
  res.redirect('/users');
};

export const removeUser = async (req: Request, res: Response) => {
  await deleteUser(parseInt(req.params.id));
  res.redirect('/users');
};
