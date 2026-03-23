import { Router } from 'express';
import * as authorController from '../controllers/authorController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/:slug/articles', asyncHandler(authorController.articlesByAuthor));
router.get('/:slug', asyncHandler(authorController.getBySlug));

export default router;
