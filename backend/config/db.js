import mongoose from "mongoose";

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/svem", {
      serverSelectionTimeoutMS: 2500, // Timeout selection after 2.5 seconds
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`\n[MongoDB] Connection Failed: ${error.message}`);
    console.warn(`[MongoDB] Falling back to VIRTUAL IN-MEMORY DATABASE for local preview mode...\n`);
    try {
      const { initDbMock } = await import("./dbMock.js");
      initDbMock();
      return false;
    } catch (mockError) {
      console.error(`[MongoDB] Mock Initialization Failed:`, mockError.message);
      process.exit(1);
    }
  }
}
