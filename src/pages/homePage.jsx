import { Route, Routes, useLocation, Link } from "react-router-dom";

import Header from "../components/header";
import { ProductPage } from "./productPage";
import ProductOverview from "./productOverview";
import CartPage from "./cart";
import ChatPage from "./ChatPage";
import About from "./About";
import Contact from "./Contact";
import Settings from "./settings";
import NotFoundPage from "./notFoundPage";
import ProfilePage from "./profile";
import WishlistPage from "./wishlist";
import FAQPage from "./faq";
import TermsPage from "./terms";
import ReturnsPage from "./returns";
import ReviewsPage from "./reviews";
import SearchResultsPage from "./searchResults";

import {
  FaGlobe,
  FaUsers,
  FaRocket,
  FaShieldAlt,
  FaBriefcase,
  FaChartLine,
} from "react-icons/fa";

export default function HomePage() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />

      {/* HERO SECTION */}
      {isHome && (
        <>
          <div className="relative w-full md:h-full overflow-hidden bg-black shadow-lg">
            <img
              src="/websell.png"
              alt="WebSell"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-block bg-accent hover:opacity-90
                         text-white text-lg font-semibold
                         px-10 py-4 rounded-lg shadow-lg
                         transition-all duration-300"
            >
              Get Started Now
            </Link>
          </div>
        </>
      )}

      {/* MAIN CONTENT */}
      {isHome && (
        <div className="w-full bg-gray-50 py-24 px-4">
          <div className="max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Build, Launch & Grow Your Online Store with Confidence
              </h2>

              <p className="mt-6 text-gray-600 text-lg max-w-4xl mx-auto">
                We help businesses create high-quality websites that don’t just
                look good — they load fast, rank on search engines, and convert
                visitors into real paying customers.
              </p>
            </div>

            {/* STATS */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">

              <div className="bg-white rounded-2xl p-8 shadow-md">
                <FaGlobe className="text-accent text-4xl mx-auto" />
                <p className="mt-4 text-3xl font-bold text-gray-900">175+</p>
                <p className="mt-2 text-gray-600">Countries Reached</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-md">
                <FaUsers className="text-accent text-4xl mx-auto" />
                <p className="mt-4 text-3xl font-bold text-gray-900">12,000+</p>
                <p className="mt-2 text-gray-600">Active Users</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-md">
                <FaRocket className="text-accent text-4xl mx-auto" />
                <p className="mt-4 text-3xl font-bold text-gray-900">99.9%</p>
                <p className="mt-2 text-gray-600">Fast Performance</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-md">
                <FaShieldAlt className="text-accent text-4xl mx-auto" />
                <p className="mt-4 text-3xl font-bold text-gray-900">Secure</p>
                <p className="mt-2 text-gray-600">Enterprise Safety</p>
              </div>

            </div>

            {/* FEATURE 1 */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

              <img
                src="/eeee.jpg"
                alt="Professional website design"
                className="w-full rounded-3xl shadow-lg"
              />

              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Designed to Convert Visitors Into Customers
                </h3>

                <p className="mt-5 text-gray-600 text-lg">
                  Every store is designed to guide users from click → purchase.
                </p>
              </div>
            </div>

            {/* FEATURE 2 */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Built for Growth, Speed & Scalability
                </h3>

                <p className="mt-5 text-gray-600 text-lg">
                  Scale your business without limits using modern tools.
                </p>
              </div>

              <img
                src="/eee.jpg"
                alt="Website performance"
                className="w-full rounded-3xl shadow-lg"
              />
            </div>

            {/* CTA */}
            <div className="mt-28 text-center bg-white rounded-3xl p-14 shadow-xl">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Start Building Today
              </h3>

              <p className="mt-5 text-gray-600 text-lg">
                Join thousands of businesses growing online.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<></>} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/returns" element={<ReturnsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/overview/:id" element={<ProductOverview />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
