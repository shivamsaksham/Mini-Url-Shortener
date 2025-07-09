import { Router } from 'express';
import { UrlController } from '../controllers/urlController';

const router = Router();

// Create a shortened URL
router.post('/shorten', UrlController.shortenUrl);

// Get URL statistics 
router.get('/stats/:code', UrlController.getUrlStats);

// Redirect to original URL
router.get('/:code', UrlController.redirectToOriginalUrl);

export default router;
