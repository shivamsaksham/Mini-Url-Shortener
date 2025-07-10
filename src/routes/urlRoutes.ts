import { Router } from 'express';
import { UrlController } from '../controllers/urlController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// Create a shortened URL
router.post('/shorten', rateLimiter , UrlController.shortenUrl); // applying rate limiter middleware

// Get URL statistics 
router.get('/stats/:code', UrlController.getUrlStats);

// Redirect to original URL
router.get('/:code', UrlController.redirectToOriginalUrl);

export default router;
