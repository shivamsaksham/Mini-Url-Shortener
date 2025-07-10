import { Url, IUrl } from '../models/Url';
import crypto from 'crypto';

export class UrlService {
  private static readonly BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
  private static readonly CODE_LENGTH = 6;

  /**
   * Generate a unique short code
   */
  private static generateShortCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < this.CODE_LENGTH; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  }

  /**
   * Generate a unique short code that doesn't exist in database
   */
  private static async generateUniqueShortCode(): Promise<string> {
    let shortCode: string;
    let existingUrl: IUrl | null;
    
    // looping until a unique short code is found
    do {
      shortCode = this.generateShortCode();
      existingUrl = await Url.findOne({ shortCode });
    } while (existingUrl);
    
    return shortCode;
  }

  /**
   * Validate URL format
   */
  public static isValidUrl(url: string): boolean {
    try {
      const urlObject = new URL(url);
      return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
    } catch (error) {
      return false;
    }
  }

  /**
   * Create a shortened URL
   */
  public static async createShortUrl(originalUrl: string): Promise<{ shortUrl: string; shortCode: string }> {
    // Validating URL
    if (!this.isValidUrl(originalUrl)) {
      throw new Error('Invalid URL format');
    }

    // Checking if URL already exists in MongoDb
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl && (!existingUrl.expiryDate || existingUrl.expiryDate > new Date())) {
      return {
        shortUrl: `${this.BASE_URL}/${existingUrl.shortCode}`,
        shortCode: existingUrl.shortCode
      };
    }

    // Generate unique short code, that will not conflict with existing ones
    const shortCode = await this.generateUniqueShortCode();

    // Set expiry date to 15 days from creation of the short URL
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 15);

    // Create new URL record
    const newUrl = new Url({
      originalUrl,
      shortCode,
      expiryDate,
      clickCount: 0
    });

    await newUrl.save();

    return {
      shortUrl: `${this.BASE_URL}/${shortCode}`,
      shortCode
    };
  }

  /**
   * Get original URL by short code
   */
  public static async getOriginalUrl(shortCode: string): Promise<string | null> {
    const url = await Url.findOne({ shortCode });
    
    if (!url) {
      return null;
    }

    // Check if URL has expired
    if (url.expiryDate && url.expiryDate < new Date()) {
      return null;
    }

    // Increment click count
    url.clickCount += 1;
    await url.save();

    return url.originalUrl;
  }

  /**
   * Get URL statistics
   */
  public static async getUrlStats(shortCode: string): Promise<IUrl | null> {
    return await Url.findOne({ shortCode });
  }

  /**
   * Delete expired URLs (cleanup utility)
   */
  public static async cleanupExpiredUrls(): Promise<number> {
    const result = await Url.deleteMany({
      expiryDate: { $lt: new Date() }
    });
    
    return result.deletedCount || 0;
  }
}
