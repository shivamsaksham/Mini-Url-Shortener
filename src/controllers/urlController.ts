import { Request, Response } from 'express';
import { UrlService } from '../services/urlService';

export class UrlController {
  /**
   * POST /shorten
   * Create a shortened URL
   */
  public static async shortenUrl(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.body;

      // Validate input
      if (!url || typeof url !== 'string') {
        res.status(400).json({
          error: 'Bad Request',
          message: 'URL is required and must be a string'
        });
        return;
      }

      // Create shortened URL (expires in 15 days automatically)
      const result = await UrlService.createShortUrl(url.trim());

      res.status(201).json({
        shortUrl: result.shortUrl,
        originalUrl: url.trim(),
        shortCode: result.shortCode
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid URL format') {
          res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid URL format. Please provide a valid HTTP or HTTPS URL.'
          });
          return;
        }
      }

      console.error('Error creating short URL:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while creating the short URL'
      });
    }
  }

  /**
   * GET /:code
   * Redirect to original URL
   */
  public static async redirectToOriginalUrl(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;

      // Validate code
      if (!code || typeof code !== 'string') {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Short code is required'
        });
        return;
      }

      // Get original URL
      const originalUrl = await UrlService.getOriginalUrl(code.trim());

      if (!originalUrl) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Short URL not found or has expired'
        });
        return;
      }

      // Redirect to original URL
      res.redirect(302, originalUrl);
    } catch (error) {
      console.error('Error redirecting to original URL:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while redirecting'
      });
    }
  }

  /**
   * GET /stats/:code
   * Get URL statistics (optional endpoint)
   */
  public static async getUrlStats(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;

      // Validate code
      if (!code || typeof code !== 'string') {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Short code is required'
        });
        return;
      }

      // Get URL statistics
      const urlStats = await UrlService.getUrlStats(code.trim());

      if (!urlStats) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Short URL not found'
        });
        return;
      }

      res.status(200).json({
        shortCode: urlStats.shortCode,
        originalUrl: urlStats.originalUrl,
        createdAt: urlStats.createdAt,
        expiryDate: urlStats.expiryDate,
        clickCount: urlStats.clickCount
      });
    } catch (error) {
      console.error('Error getting URL stats:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching URL statistics'
      });
    }
  }
}
