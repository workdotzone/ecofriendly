import mongoose from "mongoose";

type MongooseCache = {
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = globalThis.mongooseCache ?? (globalThis.mongooseCache = {
  promise: null,
});

/**
 * Connects once per server instance and reuses the connection.
 * - Throws at call time (not import time) when MONGODB_URI is missing, so pages can catch it
 *   and render curated fallback content instead of crashing the whole build.
 * - Short server-selection timeout so an unreachable database fails fast (pages fall back)
 *   instead of hanging a request or a build for 30 seconds per query.
 */
async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined. Add it to your environment (.env / hosting settings).");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connection.readyState === 2
      ? mongoose.connection.asPromise().then(() => mongoose)
      : mongoose.connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: Number(process.env.MONGODB_TIMEOUT_MS) || 8000,
        maxPoolSize: 10,
      });
  }

  const connectionPromise = cached.promise;
  try {
    const connection = await connectionPromise;
    if (cached.promise === connectionPromise) {
      cached.promise = null;
    }
    return connection;
  } catch (error) {
    if (cached.promise === connectionPromise) {
      cached.promise = null;
    }
    throw error;
  }
}

export default dbConnect;
