import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addProduct } from "../api/api.jsx";
import "../style/Hom.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMoon, faSearch, faSignInAlt, faSignOutAlt, faSun, faUserPlus} from "@fortawesome/free-solid-svg-icons";

const AddProduct = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        duration: "",
        stock: "",
        image: null,
        is_budget_friendly: false, // اضافه کردن فیلد خوش قیمت
        is_top_selling: false,     // اضافه کردن فیلد پرفروش
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("duration", formData.duration);
        data.append("stock", formData.stock);
        data.append("is_budget_friendly", formData.is_budget_friendly ? "1" : "0");
        data.append("is_top_selling", formData.is_top_selling ? "1" : "0");
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            const response = await addProduct(data);
            setSuccess("محصول با موفقیت اضافه شد!");
            setFormData({
                title: "",
                description: "",
                price: "",
                duration: "",
                stock: "",
                image: null,
                is_budget_friendly: false,
                is_top_selling: false,
            });
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError("خطا در افزودن محصول: " + (err.message || "مشکل ناشناخته"));
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiresAt");
        setIsLoggedIn(false);
        alert("شما با موفقیت خارج شدید!");
        navigate("/");
    };
    return (
        <div
            className={`min-h-screen font-sans transition-colors duration-300 ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
            }`}
            dir="rtl"
        >
            {/* نوار بالای صفحه */}
            <nav
                className={`${
                    theme === "dark" ? "bg-gray-900" : "bg-yellow-400"
                } text-white py-3 px-4 fixed w-full top-0 z-50 shadow-lg`}
            >
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                    <div className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0" >فروشگاه اکانت</div>
                    <div className="flex items-center space-x-4 space-x-reverse">
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="text-white hover:text-yellow-200 transition-colors"
                            title="جستجو"
                        >
                            <FontAwesomeIcon icon={faSearch}/>
                        </button>
                        {isSearchOpen && (
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <input
                                    type="text"
                                    placeholder="جستجو در محصولات..."
                                    className={`border p-2 rounded-lg focus:outline-none focus:ring-2 ${
                                        theme === "dark" ? "bg-gray-600 text-white focus:ring-yellow-300" : "focus:ring-yellow-400"
                                    } w-full sm:w-64`}
                                />
                            </div>
                        )}
                        {!isLoggedIn ? (
                            <>
                                <Link
                                    to="/login"
                                    className="hover:text-yellow-200 transition-colors flex items-center"
                                    title="ورود"
                                >
                                    ورود
                                    <FontAwesomeIcon icon={faSignInAlt} className="ml-1"/>
                                </Link>
                                <Link
                                    to="/register"
                                    className="hover:text-yellow-200 transition-colors flex items-center"
                                    title="ثبت‌نام"
                                >
                                    ثبت‌نام
                                    <FontAwesomeIcon icon={faUserPlus} className="ml-1"/>
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                title="خروج"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="ml-1"/>
                                خروج
                            </button>
                        )}
                        <button
                            onClick={toggleTheme}
                            className="hover:text-yellow-200 transition-colors flex items-center"
                            title={theme === "dark" ? "روشن" : "تاریک"}
                        >
                            <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon}/>
                        </button>
                    </div>
                </div>
            </nav>

            {/* فرم اضافه کردن محصول */}
            <section className="container mx-auto px-4 py-12 mt-20">
                <h2
                    className={`text-2xl sm:text-3xl font-bold mb-8 text-right ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-400"
                    }`}
                >
                    افزودن محصول جدید
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className={`${
                        theme === "dark" ? "bg-gray-700" : "bg-white"
                    } p-6 rounded-lg shadow-lg max-w-lg mx-auto`}
                >
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className={`block mb-2 ${theme === "dark" ? "text-yellow-300" : "text-gray-700"}`}
                        >
                            عنوان محصول
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                theme === "dark"
                                    ? "bg-gray-600 text-white focus:ring-yellow-300"
                                    : "focus:ring-yellow-400"
                            }`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className={`block mb-2 ${theme === "dark" ? "text-yellow-300" : "text-gray-700"}`}
                        >
                            توضیحات
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                theme === "dark"
                                    ? "bg-gray-600 text-white focus:ring-yellow-300"
                                    : "focus:ring-yellow-400"
                            }`}
                            rows="4"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="price"
                            className={`block mb-2 ${theme === "dark" ? "text-yellow-300" : "text-gray-700"}`}
                        >
                            قیمت (تومان)
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                theme === "dark"
                                    ? "bg-gray-600 text-white focus:ring-yellow-300"
                                    : "focus:ring-yellow-400"
                            }`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="duration"
                            className={`block mb-2 ${theme === "dark" ? "text-yellow-300" : "text-gray-700"}`}
                        >
                            مدت زمان (اختیاری)
                        </label>
                        <input
                            type="text"
                            id="duration"
                            name="duration"
                            value={formData.duration}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                theme === "dark"
                                    ? "bg-gray-600 text-white focus:ring-yellow-300"
                                    : "focus:ring-yellow-400"
                            }`}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="stock"
                            className={`block mb-2 ${theme === "dark" ? "text-yellow-300" : "text-gray-700"}`}
                        >
                            موجودی (اختیاری)
                        </label>
                        <input
                            type="number"
                            id="stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                theme === "dark"
                                    ? "bg-gray-600 text-white focus:ring-yellow-300"
                                    : "focus:ring-yellow-400"
                            }`}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="image"
                            className={`block mb-2 ${theme === "dark" ? "text-yellow-300" : "text-gray-700"}`}
                        >
                            تصویر محصول
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={`w-full p-2 border rounded-lg ${
                                theme === "dark" ? "bg-gray-600 text-white" : "text-gray-800"
                            }`}
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            className={`flex items-center ${theme === "dark" ? "text-yellow-300" : "text-gray-700"}`}
                        >
                            <input
                                type="checkbox"
                                name="is_budget_friendly"
                                checked={formData.is_budget_friendly}
                                onChange={handleInputChange}
                                className="ml-2"
                            />
                            محصول خوش قیمت
                        </label>
                    </div>

                    <div className="mb-4">
                        <label
                            className={`flex items-center ${theme === "dark" ? "text-yellow-300" : "text-gray-700"}`}
                        >
                            <input
                                type="checkbox"
                                name="is_top_selling"
                                checked={formData.is_top_selling}
                                onChange={handleInputChange}
                                className="ml-2"
                            />
                            محصول پرفروش
                        </label>
                    </div>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg transition-colors ${
                            theme === "dark"
                                ? "bg-gray-600 text-yellow-300 hover:bg-gray-700"
                                : "bg-yellow-400 text-white hover:bg-yellow-500"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "در حال ارسال..." : "افزودن محصول"}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default AddProduct;