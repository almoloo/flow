import { MongoClient, Db, Collection, Document } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

interface DatabaseConnection {
  client: MongoClient;
  db: Db;
}

class MongoDB {
  private static instance: MongoDB;
  private clientPromise: Promise<MongoClient>;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {
    if (!process.env.MONGODB_URI) {
      throw new Error("Please define the MONGODB_URI environment variable inside .env");
    }

    if (!process.env.MONGODB_DB_NAME) {
      throw new Error("Please define the MONGODB_DB_NAME environment variable inside .env");
    }

    const uri = process.env.MONGODB_URI;
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        this.client = new MongoClient(uri, options);
        global._mongoClientPromise = this.client.connect();
      }
      this.clientPromise = global._mongoClientPromise;
    } else {
      this.client = new MongoClient(uri, options);
      this.clientPromise = this.client.connect();
    }
  }

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async connect(): Promise<DatabaseConnection> {
    try {
      const client = await this.clientPromise;
      const db = client.db(process.env.MONGODB_DB_NAME);

      this.client = client;
      this.db = db;

      return { client, db };
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw error;
    }
  }

  public async getDb(): Promise<Db> {
    if (!this.db) {
      const { db } = await this.connect();
      return db;
    }
    return this.db;
  }

  public async getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
    const db = await this.getDb();
    return db.collection<T>(name);
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }

  public async isConnected(): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }

      await this.client.db("admin").command({ ping: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Health check method
  public async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    try {
      const isConnected = await this.isConnected();
      return {
        status: isConnected ? "connected" : "disconnected",
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: "error",
        timestamp: new Date(),
      };
    }
  }
}

export const mongodb = MongoDB.getInstance();
export const connectToDatabase = async (): Promise<DatabaseConnection> => {
  return mongodb.connect();
};
export const getCollection = async <T extends Document = Document>(collectionName: string): Promise<Collection<T>> => {
  return mongodb.getCollection<T>(collectionName);
};
export const checkDatabaseHealth = async () => {
  return mongodb.healthCheck();
};
export default mongodb;
