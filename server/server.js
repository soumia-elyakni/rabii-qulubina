import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToMongoDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

// قراءة المتغيرات من ملف .env
dotenv.config();

const app = express();

// Middlewares أساسية
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// مسار تجريبي للتأكد أن السيرفر شغال
app.get('/', (req, res) => {
  res.json({ message: 'API Rabii Qulubina is running successfully...' });
});

// تحديد البور (Port) وتشغيل السيرفر
const PORT = process.env.PORT || 5000;

connectToMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log("Email:", process.env.EMAIL_USER);
console.log("Pass:", process.env.EMAIL_PASS ? "موجود" : "غير موجود!");