# URL Shortener API Documentation

## Overview
This is a URL shortener service that allows you to create short URLs and redirect users to the original long URLs.

## Base URL
```
http://localhost:5000
```

## Endpoints

### 1. Create Short URL
**POST** `/shorten`

Create a shortened URL from a long URL.

#### Request Body
```json
{
  "url": "https://shivamsaksham.codeviral.dev"
}
```

#### Response (201 Created)
```json
{
  "shortUrl": "http://localhost:5000/abc123",
  "originalUrl": "https://shivamsaksham.codeviral.dev",
  "shortCode": "abc123"
}
```

#### Error Responses
- **400 Bad Request**: Invalid URL format or missing URL
- **500 Internal Server Error**: Server error

### 2. Redirect to Original URL
**GET** `/:code`

Redirects to the original URL using the short code.

#### Parameters
- `code` (string): The short code from the shortened URL

#### Response
- **302 Found**: Redirects to the original URL
- **404 Not Found**: Short URL not found or expired
- **400 Bad Request**: Invalid short code

### 3. Get URL Statistics (Optional)
**GET** `/stats/:code`

Get statistics for a shortened URL.

#### Parameters
- `code` (string): The short code from the shortened URL

#### Response (200 OK)
```json
{
  "shortCode": "abc123",
  "originalUrl": "https://shivamsaksham.codeviral.dev",
  "createdAt": "2025-01-09T13:30:00.000Z",
  "expiryDate": "2025-02-08T13:30:00.000Z",
  "clickCount": 15
}
```

#### Error Responses
- **404 Not Found**: Short URL not found
- **400 Bad Request**: Invalid short code

### 4. Health Check
**GET** `/health-check`

Check if the server is running.

#### Response (200 OK)
```json
{
  "status": "OK",
  "message": "Server is running smoothly"
}
```

## Usage Examples

### Create a Short URL
```bash
curl -X POST http://localhost:5000/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.google.com/search?q=url+shortener"
  }'
```

### Access a Short URL
```bash
curl -L http://localhost:5000/abc123
```

### Get URL Statistics
```bash
curl http://localhost:5000/stats/abc123
```

## Features

- **URL Validation**: Validates HTTP/HTTPS URLs
- **Duplicate Detection**: Returns existing short URL for duplicate long URLs
- **Automatic Expiry**: URLs automatically expire after 15 days from creation
- **Click Tracking**: Tracks the number of clicks on short URLs
- **MongoDB Storage**: Persistent storage with MongoDB
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Database Schema

The URL documents are stored with the following structure:
```javascript
{
  originalUrl: String,    // The original long URL
  shortCode: String,      // The unique short code
  createdAt: Date,        // Creation timestamp
  expiryDate: Date,       // expiry date
  clickCount: Number      // Number of times the URL was accessed
}
```

## Environment Variables

Create a `.env` file with the following variables:
```
MONGO_URI=mongodb://localhost:27017/url_shortener
PORT=5000
NODE_ENV=development
BASE_URL=http://localhost:5000
