import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', asyncHandler(categoryController.list));
router.get('/:slug/articles', asyncHandler(categoryController.articlesByCategorySlug));

export default router;
