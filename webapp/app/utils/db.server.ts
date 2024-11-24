import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory path in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory (3 levels up from utils/db.server.ts)
dotenv.config({ path: resolve(__dirname, '../../../.env') });

// Build the connection string based on environment variables
const MONGO_URI = process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD
  ? `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || '27117'}/furlough`
  : 'mongodb://localhost:27017/furlough';

let db: MongoClient;

declare global {
  var __db: MongoClient | undefined;
}

// This is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  db = new MongoClient(MONGO_URI);
} else {
  if (!global.__db) {
    global.__db = new MongoClient(MONGO_URI);
  }
  db = global.__db;
}

export { db }; 