# Mini Url Shortener API

## Objective:

Create a simple REST API that shortens long URLs and returns a short code. When the
short code is accessed, it redirects to the original URL.

## Tech Stack:

- language : Typescript

- runtime: Nodejs

- Framework: Express Js

- Database: MongoDb

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd url_shortner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGO_URI=mongodb://localhost:27017/url_shortener
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   BASE_URL=http://localhost:5000
   ```

4. **Start MongoDB**
   - **Local MongoDB**: Make sure MongoDB is running on your system
   - **MongoDB Atlas**: Update the `MONGO_URI` in `.env` with your Atlas connection string

5. **Run the application**
   
   **Development mode (with auto-reload):**
   ```bash
   npm run watch
   ```
   
   **Production mode:**
   ```bash
   npm run build
   npm start
   ```

6. **Test the API**
   The server will start on `http://localhost:5000`
   
   **Health check:**
   ```bash
   curl http://localhost:5000/health-check
   ```

### API Endpoints

- **POST** `/shorten` - Create a shortened URL
- **GET** `/:code` - Redirect to original URL
- **GET** `/stats/:code` - Get URL statistics
- **GET** `/health-check` - Health check endpoint


### Features

- ✅ URL shortening with 6-character unique codes
- ✅ Automatic 15-day expiry for all URLs
- ✅ URL validation (HTTP/HTTPS only)
- ✅ Click tracking and analytics
- ✅ Duplicate URL detection
- ✅ MongoDB persistence
- ✅ Comprehensive error handling
- ✅ TypeScript support

### Usage Examples

**Create a short URL:**
```bash
curl -X POST http://localhost:5000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://shivamsaksham.codeviral.dev"}'
```

**Access a short URL:**
```bash
curl -L http://localhost:5000/abc123
```

**Get URL statistics:**
```bash
curl http://localhost:5000/stats/abc123
```

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)