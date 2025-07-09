import express from 'express';
import dotenv from 'dotenv';
import { connectToMongoDB } from './config/mongoConnection';
import urlRoutes from './routes/urlRoutes';

// Load environment variables
dotenv.config();


const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Set the port to an environment variable or default to 5000
const PORT = process.env.PORT || 5000;

interface HealthCheckResponse {
    status: string;
    message: string;
}

app.get('/health-check', (req: express.Request, res: express.Response<HealthCheckResponse>) => {
    res.status(200).json({ status: 'OK', message: 'Server is running smoothly' });
});

// Routes
app.use('/', urlRoutes);

// Initialize MongoDB connection and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToMongoDB();
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
