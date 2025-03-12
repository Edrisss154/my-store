import { useState, useEffect } from "react";
import { login } from "../api/api";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme : "light";
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);

        try {
            const response = await login(email, password);
            console.log("Login response:", response.data);
            if (response.data.token) {
                const expiresAt = Date.now() + 60 * 60 * 1000; // 1 ساعت انقضا (در میلی‌ثانیه)
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("tokenExpiresAt", expiresAt); // ذخیره زمان انقضا
                alert("ورود با موفقیت انجام شد!");
                navigate("/");
            } else {
                alert("ورود ناموفق بود");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("خطا در ورود");
        }
    };

    return (
        <div className="min-h-screen w-full flex overflow-hidden">
            {/* بخش سمت چپ - عکس */}
            <div
                className="hidden md:block w-1/2 min-h-screen bg-cover bg-center"
                style={{
                    backgroundImage: `url('/photo_2025-03-10_15-30-03.jpg')`,
                    opacity: theme === "dark" ? "0.6" : "0.8",
                }}
            ></div>

            {/* بخش سمت راست - فرم ورود */}
            <div
                className={`w-full md:w-1/2 flex items-center justify-center min-h-screen transition-colors duration-300 ${
                    theme === "dark" ? "bg-gray-900" : "bg-white"
                }`}
            >
                <form
                    onSubmit={handleSubmit}
                    className={`p-6 rounded-2xl shadow-2xl w-full max-w-md dark:bg-gray-900 text-gray-800 dark:text-white transition-all hover:scale-105 ${
                        theme === "light" ? "md:bg-white bg-opacity-90 bg-cover bg-center" : ""
                    }`}

                >
                    <div className="flex justify-between items-center mb-4">
                        <h2
                            className={`text-2xl font-extrabold ${
                                theme === "dark" ? "text-white" : "text-black"
                            }`}
                        >
                            ورود
                        </h2>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="p-2 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                        >
                            {theme === "dark" ? "☀️" : "🌙"}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className={`block text-sm font-medium text-center ${
                                    theme === "dark" ? "text-gray-100" : "text-black"
                                }`}
                            >
                                ایمیل
                            </label>
                            <input
                                type="email"
                                id="email"
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-all ${
                                    theme === "dark"
                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-yellow-300"
                                        : "border-gray-300 text-black focus:ring-yellow-400"
                                }`}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className={`block text-sm font-medium text-center ${
                                    theme === "dark" ? "text-gray-100" : "text-black"
                                }`}
                            >
                                رمز عبور
                            </label>
                            <input
                                type="password"
                                id="password"
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-all ${
                                    theme === "dark"
                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-yellow-300"
                                        : "border-gray-300 text-black focus:ring-yellow-400"
                                }`}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                                theme === "dark"
                                    ? "bg-yellow-300 text-gray-900 hover:bg-yellow-400"
                                    : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
                        >
                            ورود
                        </button>
                    </div>
                    <p
                        className={`mt-4 text-center text-sm ${
                            theme === "dark" ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                        حساب کاربری ندارید؟{" "}
                        <Link
                            to="/register"
                            className={`${
                                theme === "dark"
                                    ? "text-yellow-100 hover:text-yellow-200"
                                    : "text-yellow-800 hover:text-yellow-900"
                            }`}
                        >
                            ثبت‌نام کنید
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;