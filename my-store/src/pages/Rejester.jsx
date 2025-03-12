import { useState, useEffect } from "react";
import { register } from "../api/api";
import { auth, googleProvider, signInWithPopup } from "../component/firebase.jsx";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme : "light";
    });
    const navigate = useNavigate();

    // چک کردن توکن موقع لود صفحه
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/"); // هدایت به Home اگه توکن هست
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
        if (password !== confirmPassword) {
            setError("رمز عبور و تکرار آن مطابقت ندارند");
            return;
        }

        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);

        try {
            const response = await register(formData);
            console.log("Register response:", response);
            if (response.message === "User registered successfully") {
                alert("ثبت‌نام با موفقیت انجام شد!");
                navigate("/login"); // هدایت به صفحه ورود بعد از ثبت‌نام
            } else {
                alert("ثبت‌نام ناموفق بود");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("خطا در ثبت‌نام");
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("Google sign-in successful:", user);
            alert("ورود با گوگل موفقیت‌آمیز بود!");
            // فرض می‌کنیم توکن از بک‌اند میاد
            localStorage.setItem("token", "some-google-token"); // جایگزین با توکن واقعی
            navigate("/"); // هدایت به Home
        } catch (error) {
            console.error("Google sign-in error:", error);
            alert("خطا در ورود با گوگل");
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

            {/* بخش سمت راست - فرم ثبت‌نام */}
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
                            ثبت‌نام
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
                                htmlFor="firstName"
                                className={`block text-sm font-medium text-center ${
                                    theme === "dark" ? "text-gray-100" : "text-black"
                                }`}
                            >
                                نام
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-all ${
                                    theme === "dark"
                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-yellow-300"
                                        : "border-gray-300 text-black focus:ring-yellow-400"
                                }`}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lastName"
                                className={`block text-sm font-medium text-center ${
                                    theme === "dark" ? "text-gray-100" : "text-black"
                                }`}
                            >
                                نام خانوادگی
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-all ${
                                    theme === "dark"
                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-yellow-300"
                                        : "border-gray-300 text-black focus:ring-yellow-400"
                                }`}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="username"
                                className={`block text-sm font-medium text-center ${
                                    theme === "dark" ? "text-gray-100" : "text-black"
                                }`}
                            >
                                نام کاربری
                            </label>
                            <input
                                type="text"
                                id="username"
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-all ${
                                    theme === "dark"
                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-yellow-300"
                                        : "border-gray-300 text-black focus:ring-yellow-400"
                                }`}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
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
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className={`block text-sm font-medium text-center ${
                                    theme === "dark" ? "text-gray-100" : "text-black"
                                }`}
                            >
                                تکرار رمز عبور
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className={`mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:outline-none transition-all ${
                                    theme === "dark"
                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-yellow-300"
                                        : "border-gray-300 text-black focus:ring-yellow-400"
                                }`}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <p className={`text-red-600 dark:text-red-200 text-sm text-center`}>{error}</p>
                        )}
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                                theme === "dark"
                                    ? "bg-yellow-300 text-gray-900 hover:bg-yellow-400"
                                    : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400`}
                        >
                            ثبت‌نام
                        </button>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                                theme === "dark"
                                    ? "bg-yellow-300 text-gray-900 hover:bg-yellow-400"
                                    : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 mt-4`}
                        >
                            ثبت‌نام با گوگل
                        </button>
                    </div>
                    <p
                        className={`mt-4 text-center text-sm ${
                            theme === "dark" ? "text-gray-200" : "text-gray-900"
                        }`}
                    >
                        حساب کاربری دارید؟{" "}
                        <Link
                            to="/login"
                            className={`${
                                theme === "dark"
                                    ? "text-yellow-100 hover:text-yellow-200"
                                    : "text-yellow-800 hover:text-yellow-900"
                            }`}
                        >
                            ورود کنید
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;