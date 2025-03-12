import express from "express";
import multer from "multer";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import { dirname } from "path"; // اضافه کردن dirname از path
import { fileURLToPath } from "url"; // برای تبدیل URL به مسیر فایل

dotenv.config();
const app = express();

// گرفتن مسیر فعلی (جایگزین __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// تنظیمات CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

// تنظیمات multer
const upload = multer();

// Middlewareها
app.use(express.json());

// سرو کردن فایل‌های استاتیک از پوشه uploads
import { join } from "path"; // اضافه کردن join از path
app.use("/uploads", express.static(join(__dirname, "uploads")));

// روترهای API
app.use("/api", authRoutes);

// پاسخ به درخواست‌های OPTIONS
app.options("*", cors());

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));