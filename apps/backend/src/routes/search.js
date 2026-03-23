import { Router } from 'express';
import * as searchController from '../controllers/searchController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/', asyncHandler(searchController.search));

export default router;
