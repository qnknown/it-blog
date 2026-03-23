import { Router } from 'express';
import * as articleController from '../controllers/articleController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', asyncHandler(articleController.list));
router.get('/:slug/related', asyncHandler(articleController.related));
router.get('/:slug', asyncHandler(articleController.getBySlug));
router.post('/:id/view', asyncHandler(articleController.recordView));

export default router;
