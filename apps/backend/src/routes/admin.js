import { Router } from 'express';
import multer from 'multer';
import * as adminArticleController from '../controllers/adminArticleController.js';
import * as adminCategoryController from '../controllers/adminCategoryController.js';
import * as adminTagController from '../controllers/adminTagController.js';
import * as adminUserController from '../controllers/adminUserController.js';
import * as uploadController from '../controllers/uploadController.js';
import { requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.use(requireAdmin);

router.get('/articles', asyncHandler(adminArticleController.list));
router.get('/articles/:id', asyncHandler(adminArticleController.getById));
router.post('/articles', asyncHandler(adminArticleController.create));
router.put('/articles/:id', asyncHandler(adminArticleController.update));
router.delete('/articles/:id', asyncHandler(adminArticleController.remove));

router.get('/categories', asyncHandler(adminCategoryController.list));
router.post('/categories', asyncHandler(adminCategoryController.create));
router.put('/categories/:id', asyncHandler(adminCategoryController.update));
router.delete('/categories/:id', asyncHandler(adminCategoryController.remove));

router.get('/tags', asyncHandler(adminTagController.list));
router.post('/tags', asyncHandler(adminTagController.create));
router.put('/tags/:id', asyncHandler(adminTagController.update));
router.delete('/tags/:id', asyncHandler(adminTagController.remove));

router.get('/users', asyncHandler(adminUserController.list));

router.post('/upload', upload.single('file'), asyncHandler(uploadController.upload));

export default router;
