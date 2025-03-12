import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTopSellingProducts, getMostViewedProducts, getBudgetFriendlyProducts } from "../api/api.jsx";
import "../style/Hom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUserPlus, faSignInAlt, faSun, faMoon, faSearch } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
    const [topSelling, setTopSelling] = useState([]);
    const [mostViewed, setMostViewed] = useState([]);
    const [budgetFriendly, setBudgetFriendly] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    const sliderRefTopSelling = useRef(null);
    const sliderRefMostViewed = useRef(null);
    const sliderRefBudgetFriendly = useRef(null);
    const [positions, setPositions] = useState({ topSelling: 0, mostViewed: 0, budgetFriendly: 0 });
    const cardWidth = 280;

    const checkTokenExpiration = () => {
        const token = localStorage.getItem("token");
        const expiresAt = localStorage.getItem("tokenExpiresAt");
        if (token && expiresAt) {
            const now = Date.now();
            if (now > expiresAt) {
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiresAt");
                setIsLoggedIn(false);
                alert("جلسه شما منقضی شده است. لطفاً دوباره وارد شوید.");
            } else {
                setIsLoggedIn(true);
            }
        } else {
            setIsLoggedIn(false);
        }
    };

    useEffect(() => {
        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiresAt");
        setIsLoggedIn(false);
        alert("شما با موفقیت خارج شدید!");
        navigate("/");
    };

    useEffect(() => {
        let mounted = true;
        const fetchProducts = async () => {
            console.log("Fetching products...");
            setLoading(true);
            try {
                const topSellingData = await getTopSellingProducts();
                const mostViewedData = await getMostViewedProducts();
                const budgetFriendlyData = await getBudgetFriendlyProducts();
                if (mounted) {
                    setTopSelling(topSellingData);
                    setMostViewed(mostViewedData);
                    setBudgetFriendly(budgetFriendlyData);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                if (mounted) {
                    setError("خطا در دریافت محصولات");
                    setLoading(false);
                }
            }
        };
        fetchProducts();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        let interval;
        if (window.innerWidth <= 640) {
            interval = setInterval(() => {
                setPositions((prev) => ({
                    topSelling:
                        prev.topSelling >= (topSelling.length - 1) * cardWidth ? 0 : prev.topSelling + cardWidth,
                    mostViewed:
                        prev.mostViewed >= (mostViewed.length - 1) * cardWidth ? 0 : prev.mostViewed + cardWidth,
                    budgetFriendly:
                        prev.budgetFriendly >= (budgetFriendly.length - 1) * cardWidth
                            ? 0
                            : prev.budgetFriendly + cardWidth,
                }));
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [topSelling.length, mostViewed.length, budgetFriendly.length]);

    useEffect(() => {
        if (sliderRefTopSelling.current) {
            sliderRefTopSelling.current.style.transform = `translateX(-${positions.topSelling}px)`;
            sliderRefTopSelling.current.style.transition = "transform 0.5s ease";
        }
        if (sliderRefMostViewed.current) {
            sliderRefMostViewed.current.style.transform = `translateX(-${positions.mostViewed}px)`;
            sliderRefMostViewed.current.style.transition = "transform 0.5s ease";
        }
        if (sliderRefBudgetFriendly.current) {
            sliderRefBudgetFriendly.current.style.transform = `translateX(-${positions.budgetFriendly}px)`;
            sliderRefBudgetFriendly.current.style.transition = "transform 0.5s ease";
        }
    }, [positions]);

    return (
        <div
            className={`min-h-screen font-sans transition-colors duration-300 ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
            }`}
            dir="rtl"
        >
            {/* هدر اصلی (فیکس) */}
            <nav
                className={`${
                    theme === "dark" ? "bg-gray-900" : "bg-yellow-400"
                } text-white py-3 px-4 fixed w-full top-0 z-50 shadow-lg`}
            >
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                    <div className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">فروشگاه اکانت</div>
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

            {/* هدر دوم (غیرفیکس) */}
            <header
                className={`${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                } py-4 px-4 sm:px-6 mt-16 shadow-md`}
            >
                <div className="container mx-auto">
                    <nav className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
                        <Link
                            to="/accounts"
                            className={`${
                                theme === "dark" ? "text-yellow-300 hover:text-yellow-200" : "text-yellow-600 hover:text-yellow-700"
                            } font-medium`}
                        >
                            اکانت و اشتراک
                        </Link>
                        <Link
                            to="/gift-cards"
                            className={`${
                                theme === "dark" ? "text-yellow-300 hover:text-yellow-200" : "text-yellow-600 hover:text-yellow-700"
                            } font-medium`}
                        >
                            گیفت کارت
                        </Link>
                        <Link
                            to="/video-games"
                            className={`${
                                theme === "dark" ? "text-yellow-300 hover:text-yellow-200" : "text-yellow-600 hover:text-yellow-700"
                            } font-medium`}
                        >
                            بازی‌های ویدیویی
                        </Link>
                        <Link
                            to="/blog"
                            className={`${
                                theme === "dark" ? "text-yellow-300 hover:text-yellow-200" : "text-yellow-600 hover:text-yellow-700"
                            } font-medium`}
                        >
                            بلاگ
                        </Link>
                        <Link
                            to="/support"
                            className={`${
                                theme === "dark" ? "text-yellow-300 hover:text-yellow-200" : "text-yellow-600 hover:text-yellow-700"
                            } font-medium`}
                        >
                            پشتیبانی
                        </Link>
                        <Link
                            to="/about"
                            className={`${
                                theme === "dark" ? "text-yellow-300 hover:text-yellow-200" : "text-yellow-600 hover:text-yellow-700"
                            } font-medium`}
                        >
                            درباره ما
                        </Link>
                    </nav>
                </div>
            </header>

            {/* بخش محصولات */}
            {/* محصولات پرفروش */}
            <section className="container mx-auto px-4 py-12 mt-6">

                <h2
                    className={`text-2xl sm:text-3xl font-bold mb-8 text-right ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-400"
                    }`}
                >
                    پرفروش ترین ها
                </h2>
                {loading ? (
                    <p className="text-center">در حال بارگذاری...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : topSelling.length === 0 ? (
                    <p className="text-center">محصولی یافت نشد</p>
                ) : (
                    <div className="slider-container overflow-hidden">
                        <div ref={sliderRefTopSelling} className="flex items-center">
                            {topSelling.map((item) => (
                                <div
                                    key={item.id}
                                    className={`mx-2 w-64 h-96 bg-white rounded-lg shadow-lg p-4 text-center flex-shrink-0 ${
                                        theme === "dark" ? "bg-gray-700" : "bg-white"
                                    }`}
                                >
                                    <img
                                        src={item.image_url}
                                        alt={item.title || "محصول بدون عنوان"}
                                        className="w-full h-48 object-contain rounded-lg mb-4"
                                        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                                    />
                                    <h3
                                        className={`text-lg font-bold ${
                                            theme === "dark" ? "text-white" : "text-gray-800"
                                        }`}
                                    >
                                        {item.title || "بدون عنوان"}
                                    </h3>
                                    <p
                                        className={`text-gray-500 mt-2 ${
                                            theme === "dark" ? "text-yellow-300" : "text-gray-500"
                                        }`}
                                    >
                                        {item.price ? `${item.price} تومان` : "قیمت نامشخص"}
                                    </p>
                                    <button
                                        className="mt-4 bg-purple-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors w-full">
                                        خرید
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
            {/* محصولات خوش قیمت */}

            <section className="container mx-auto px-4 py-12 mt-6">
                <h2
                    className={`text-2xl sm:text-3xl font-bold mb-8 text-right ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-400"
                    }`}
                >
                    پر تخفیف ترین ها ✨
                </h2>
                {loading ? (
                    <p className="text-center">در حال بارگذاری...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : mostViewed.length === 0 ? (
                    <p className="text-center">محصولی یافت نشد</p>
                ) : (
                    <div className="slider-container overflow-hidden">
                        <div ref={sliderRefMostViewed} className="flex items-center">
                            {mostViewed.map((item) => (
                                <div
                                    key={item.id}
                                    className={`mx-2 w-64 h-96 bg-white rounded-lg shadow-lg p-4 text-center flex-shrink-0 ${
                                        theme === "dark" ? "bg-gray-700" : "bg-white"
                                    }`}
                                >
                                    <img
                                        src={item.image_url}
                                        alt={item.title || "محصول بدون عنوان"}
                                        className="w-full h-48 object-contain rounded-lg mb-4"
                                        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                                    />
                                    <h3
                                        className={`text-lg font-bold ${
                                            theme === "dark" ? "text-white" : "text-gray-800"
                                        }`}
                                    >
                                        {item.title || "بدون عنوان"}
                                    </h3>
                                    <p
                                        className={`text-gray-500 mt-2 ${
                                            theme === "dark" ? "text-yellow-300" : "text-gray-500"
                                        }`}
                                    >
                                        {item.price ? `${item.price} تومان` : "قیمت نامشخص"}
                                    </p>
                                    <button
                                        className="mt-4 bg-purple-700 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors w-full">
                                        خرید
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>
            {/* بقیه بخش‌ها بدون تغییر */}
            <section
                className={`${
                    theme === "dark"
                        ? "bg-gradient-to-r from-gray-700 to-gray-900"
                        : "bg-gradient-to-r from-yellow-300 to-gray-300"
                } py-12 sm:py-16 mt-12`}
            >
                <div className="container mx-auto px-4 sm:px-6 text-center text-white">
                    <h2 className="text-2xl sm:text-4xl font-bold mb-4 animate-bounce">تخفیف‌های استثنایی!</h2>
                    <p className="text-base sm:text-lg mb-6">تا ۵۰٪ تخفیف برای خریدهای بالای ۲۰۰,۰۰۰ تومان</p>
                    <button
                        className={`${
                            theme === "dark" ? "bg-gray-600 text-yellow-300" : "bg-white text-yellow-400"
                        } px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors`}
                    >
                        همین حالا خرید کنید
                    </button>
                </div>
            </section>

            <section className="container mx-auto px-4 sm:px-6 py-12">
                <h2
                    className={`text-2xl sm:text-3xl font-bold mb-8 text-right ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-400"
                    }`}
                >
                    نظرات کاربران
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {name: "علی", comment: "کیفیت اکانت‌ها عالیه، پشتیبانی هم خیلی سریع جواب میده!"},
                        {name: "سارا", comment: "قیمت‌ها واقعاً مناسبن، حتماً دوباره خرید می‌کنم."},
                    ].map((review, index) => (
                        <div
                            key={index}
                            className={`${
                                theme === "dark" ? "bg-gray-700" : "bg-white"
                            } p-4 sm:p-6 rounded-lg shadow-md`}
                        >
                            <p className="mb-4 text-sm sm:text-base">"{review.comment}"</p>
                            <p
                                className={`font-semibold text-sm sm:text-base ${
                                    theme === "dark" ? "text-yellow-300" : "text-yellow-400"
                                }`}
                            >
                                - {review.name}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <footer className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-800"} text-white py-8 sm:py-12 mt-12`}>
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold mb-4">درباره ما</h3>
                            <p className="text-gray-400 text-sm sm:text-base">
                                فروشگاه اکانت، بهترین مرجع برای خرید اکانت‌های پرمیوم با پشتیبانی ۲۴ ساعته.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold mb-4">لینک‌های مفید</h3>
                            <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
                                <li>
                                    <Link to="/" className="hover:text-yellow-400 transition-colors">
                                        صفحه اصلی
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/shop" className="hover:text-yellow-400 transition-colors">
                                        محصولات
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="hover:text-yellow-400 transition-colors">
                                        تماس با ما
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold mb-4">تماس با ما</h3>
                            <p className="text-gray-400 text-sm sm:text-base">ایمیل: info@example.com</p>
                            <p className="text-gray-400 text-sm sm:text-base">تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</p>
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold mb-4">شبکه‌های اجتماعی</h3>
                            <div className="flex space-x-4 space-x-reverse text-sm sm:text-base">
                                <a href="#" className="text-gray-400 hover:text-yellow-400">
                                    📸 اینستاگرام
                                </a>
                                <a href="#" className="text-gray-400 hover:text-yellow-400">
                                    ✈️ تلگرام
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-gray-500 mt-6 sm:mt-8 text-sm sm:text-base">
                        © ۱۴۰۳ فروشگاه اکانت - تمامی حقوق محفوظ است.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;