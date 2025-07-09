import mongoose from 'mongoose';

interface MongoConnectionOptions {
  maxRetries?: number;
  retryDelay?: number;
}

class MongoConnection {
  private static instance: MongoConnection;
  private isConnected: boolean = false;
  private connectionUri: string;
  private options: MongoConnectionOptions;

  private constructor() {
    this.connectionUri = process.env.MONGO_URI || "mongodb+srv://preacher:fgsDkqqxiWxe5eDT@yt.i3cxk8p.mongodb.net/?retryWrites=true&w=majority&appName=YT";
    this.options = {
      maxRetries: 5,
      retryDelay: 5000, // 5 seconds
    };
  }

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('MongoDB is already connected');
      return;
    }

    let retries = 0;
    const maxRetries = this.options.maxRetries || 5;

    while (retries < maxRetries) {
      try {
        await mongoose.connect(this.connectionUri, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });

        this.isConnected = true;
        console.log('✅ MongoDB connected successfully');
        
        // Handle connection events
        this.setupEventListeners();
        
        return;
      } catch (error) {
        retries++;
        console.error(`❌ MongoDB connection attempt ${retries} failed:`, error);
        
        if (retries === maxRetries) {
          console.error('🚨 Max retries reached. Could not connect to MongoDB');
          throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts`);
        }
        
        console.log(`⏳ Retrying in ${this.options.retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, this.options.retryDelay || 5000));
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      console.log('MongoDB is not connected');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('🔌 MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnectionUri(): string {
    // Return URI without credentials for logging purposes
    return this.connectionUri.replace(/\/\/.*@/, '//***:***@');
  }

  private setupEventListeners(): void {
    mongoose.connection.on('error', (error) => {
      console.error('🚨 MongoDB connection error:', error);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
      this.isConnected = true;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Received SIGTERM. Gracefully shutting down...');
      await this.disconnect();
      process.exit(0);
    });
  }
}

// Export singleton instance
export const mongoConnection = MongoConnection.getInstance();

// Export the class for testing purposes
export { MongoConnection };

// Helper function for easy connection
export const connectToMongoDB = async (): Promise<void> => {
  await mongoConnection.connect();
};

// Helper function for easy disconnection
export const disconnectFromMongoDB = async (): Promise<void> => {
  await mongoConnection.disconnect();
};
