import { Request, Response } from 'express';
import { getAllRoles, createRole, deleteRole } from '../models/roleModel';
import { getAllPermissions, getPermissionsByRole, assignPermissionToRole, removePermissionFromRole } from '../models/permissionModel';

export const listRoles = async (req: Request, res: Response) => {
  const roles = await getAllRoles();
  res.render('roles/list', { title: 'Role Management', roles, permissions: res.locals.permissions });
};

export const showCreateForm = (req: Request, res: Response) => {
  res.render('roles/create', { title: 'Tambah Role', error: null });
};

export const storeRole = async (req: Request, res: Response) => {
  await createRole(req.body.name);
  res.redirect('/roles');
};

export const showAssignPermission = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.id);
  const allPerms = await getAllPermissions();
  const rolePerms = await getPermissionsByRole(roleId);
  const rolePermIds = rolePerms.map(p => p.id);
  res.render('roles/permissions', {
    title: 'Assign Permission',
    roleId,
    allPerms,
    rolePermIds,
    permissions: res.locals.permissions
  });
};

export const assignPerm = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.id);
  const { permission_id } = req.body;
  await assignPermissionToRole(roleId, parseInt(permission_id));
  res.redirect(`/roles/${roleId}/permissions`);
};

export const removePerm = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.id);
  const permId = parseInt(req.params.permId);
  await removePermissionFromRole(roleId, permId);
  res.redirect(`/roles/${roleId}/permissions`);
};

export const removeRole = async (req: Request, res: Response) => {
  await deleteRole(parseInt(req.params.id));
  res.redirect('/roles');
};
