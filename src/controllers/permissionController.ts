import { Request, Response } from 'express';
import { getAllPermissions } from '../models/permissionModel';

export const listPermissions = async (req: Request, res: Response) => {
  const permissions = await getAllPermissions();
  res.render('permissions/list', {
    title: 'Permission Management',
    permissions,
    userPerms: res.locals.permissions
  });
};
