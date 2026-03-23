import { Router } from 'express';
import * as tagController from '../controllers/tagController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', asyncHandler(tagController.list));
router.get('/:slug/articles', asyncHandler(tagController.articlesByTagSlug));

export default router;
