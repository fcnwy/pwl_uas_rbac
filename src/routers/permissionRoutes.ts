import { Router } from 'express';
import { listPermissions } from '../controllers/permissionController';
import { isAuthenticated, checkPermission } from '../middleware/rbacMiddleware';
const router = Router();
router.use(isAuthenticated);
router.get('/', checkPermission('perm:view'), listPermissions);
export default router;
