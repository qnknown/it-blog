import { Router } from 'express';
import articles from './articles.js';
import categories from './categories.js';
import tags from './tags.js';
import authors from './authors.js';
import search from './search.js';
import auth from './auth.js';
import admin from './admin.js';

const router = Router();

router.use('/articles', articles);
router.use('/categories', categories);
router.use('/tags', tags);
router.use('/authors', authors);
router.use('/search', search);
router.use('/auth', auth);
router.use('/admin', admin);

export default router;
