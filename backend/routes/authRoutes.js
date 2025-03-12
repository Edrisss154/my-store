import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../database/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = "uploads/";
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.post("/register", upload.none(), async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const [existingUser] = await pool.query("SELECT email FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)",
            [firstName, lastName, username, email, hashedPassword]
        );

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
});

router.post("/login", upload.none(), async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

router.post("/login-with-google", async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            await pool.query("INSERT INTO users (email, google_uid) VALUES (?, ?)", [email, uid]);
        }

        const token = jwt.sign({ id: uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

router.post("/add-product", upload.single("image"), async (req, res) => {
    const { title, description, price, duration, stock, is_budget_friendly, is_top_selling } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    if (!title || !price) {
        return res.status(400).json({ error: "Title and price are required" });
    }

    try {
        const [result] = await pool.query(
            "INSERT INTO products (title, description, price, duration, stock, image, is_budget_friendly, is_top_selling) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                title,
                description,
                price,
                duration,
                stock,
                imagePath,
                is_budget_friendly ? 1 : 0,
                is_top_selling ? 1 : 0,
            ]
        );

        res.json({
            message: "Product added successfully",
            product: {
                id: result.insertId,
                title,
                description,
                price,
                duration,
                stock,
                is_budget_friendly: is_budget_friendly ? 1 : 0,
                is_top_selling: is_top_selling ? 1 : 0,
                image_url: imagePath ? `${req.protocol}://${req.get("host")}/uploads/${imagePath}` : null,
            },
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Failed to add product" });
    }
});

router.get("/products/top-selling", async (req, res) => {
    try {
        const [topSelling] = await pool.query(
            "SELECT * FROM products WHERE is_top_selling = 1 LIMIT 5"
        );

        const formatProducts = (products) =>
            products.map((product) => ({
                ...product,
                image_url: product.image
                    ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
                    : null,
            }));

        res.json(formatProducts(topSelling));
    } catch (error) {
        console.error("Error fetching top-selling products:", error);
        res.status(500).json({ error: "Failed to fetch top-selling products" });
    }
});

router.get("/products/most-viewed", async (req, res) => {
    try {
        const [mostViewed] = await pool.query(
            "SELECT * FROM products ORDER BY views_count DESC LIMIT 5"
        );

        const formatProducts = (products) =>
            products.map((product) => ({
                ...product,
                image_url: product.image
                    ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
                    : null,
            }));

        res.json(formatProducts(mostViewed));
    } catch (error) {
        console.error("Error fetching most-viewed products:", error);
        res.status(500).json({ error: "Failed to fetch most-viewed products" });
    }
});

router.get("/products/budget-friendly", async (req, res) => {
    try {
        const [budgetFriendly] = await pool.query(
            "SELECT * FROM products WHERE is_budget_friendly = 1 LIMIT 5"
        );

        const formatProducts = (products) =>
            products.map((product) => ({
                ...product,
                image_url: product.image
                    ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
                    : null,
            }));

        res.json(formatProducts(budgetFriendly));
    } catch (error) {
        console.error("Error fetching budget-friendly products:", error);
        res.status(500).json({ error: "Failed to fetch budget-friendly products" });
    }
});

router.get("/products", async (req, res) => {
    try {
        const [topSelling] = await pool.query(
            "SELECT * FROM products WHERE is_top_selling = 1 LIMIT 5"
        );
        const [mostViewed] = await pool.query(
            "SELECT * FROM products ORDER BY views_count DESC LIMIT 5"
        );
        const [budgetFriendly] = await pool.query(
            "SELECT * FROM products WHERE is_budget_friendly = 1 LIMIT 5"
        );

        const formatProducts = (products) =>
            products.map((product) => ({
                ...product,
                image_url: product.image
                    ? `${req.protocol}://${req.get("host")}/uploads/${product.image}`
                    : null,
            }));

        res.json({
            topSelling: formatProducts(topSelling),
            mostViewed: formatProducts(mostViewed),
            budgetFriendly: formatProducts(budgetFriendly),
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

router.use("/uploads", express.static("uploads"));

export default router;