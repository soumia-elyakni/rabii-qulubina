import mongoose from 'mongoose';

export async function connectToMongoDB() {
  try {
    // كياخد الرابط المباشر من ملف .env اللي صاوبنا
    await mongoose.connect(process.env.MONGO_URI);
    console.log("You successfully connected to MongoDB!");
    return mongoose;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

export async function disconnectFromMongoDB() {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
}