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

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />

      {/* SHOW HERO ONLY ON HOME PAGE */}
      {location.pathname === "/" && (
        <div className="relative w-full md:h-full overflow-hidden bg-black shadow-lg">
          <img
            src="/websell.png"
            alt="WebSell"
            className="w-full h-full object-cover"
          />

          {/* WORKING BUTTON */}
          

        </div>
      )}
      {location.pathname === "/" && (

          <div className="w-full bg-gray-50 py-24 px-4">
  <div className="max-w-7xl mx-auto">

    {/* ================= HEADER ================= */}
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
        Build, Launch & Get Your Online Store to Grow Your Business with Confidence Developer
      </h2>

      <p className="mt-6 text-gray-600 text-lg max-w-4xl mx-auto">
        We help businesses create high-quality websites that don’t just look
        good — they load fast, rank on search engines, and convert visitors
        into real paying customers.
      </p>
    </div>

    {/* ================= STATS ================= */}
    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">

      <div className="bg-white rounded-2xl p-8 shadow-md">
        <FaGlobe className="text-accent text-4xl mx-auto" />
        <p className="mt-4 text-3xl font-bold text-gray-900">175+</p>
        <p className="mt-2 text-gray-600">Countries Reached</p>
        <p className="mt-3 text-sm text-gray-500">
          Serving global customers across multiple industries
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md">
        <FaUsers className="text-accent text-4xl mx-auto" />
        <p className="mt-4 text-3xl font-bold text-gray-900">12,000+</p>
        <p className="mt-2 text-gray-600">Active Users</p>
        <p className="mt-3 text-sm text-gray-500">
          Entrepreneurs, startups, and enterprises trust our platform
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md">
        <FaRocket className="text-accent text-4xl mx-auto" />
        <p className="mt-4 text-3xl font-bold text-gray-900">99.9%</p>
        <p className="mt-2 text-gray-600">Fast Performance</p>
        <p className="mt-3 text-sm text-gray-500">
          Optimized for speed, SEO, and smooth user experience
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-md">
        <FaShieldAlt className="text-accent text-4xl mx-auto" />
        <p className="mt-4 text-3xl font-bold text-gray-900">Secure</p>
        <p className="mt-2 text-gray-600">Enterprise Safety</p>
        <p className="mt-3 text-sm text-gray-500">
          Modern security standards to protect your data and customers
        </p>
      </div>

    </div>

    {/* ================= FEATURES WITH IMAGES ================= */}
    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

      {/* IMAGE */}
      <img
        src="/eeee.jpg"
        alt="Professional website design"
        className="w-full rounded-3xl shadow-lg"
      />


      {/* TEXT */}
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
          Designed to Convert Visitors Into Customers
        </h3>

        <p className="mt-5 text-gray-600 text-lg">
          Every store we build is carefully designed with user behavior in
          mind — guiding visitors from their first click to a confident
          purchase decision.
        </p>

        <ul className="mt-8 space-y-4">
          <li className="flex gap-4">
            <FaRocket className="text-accent mt-1" />
            <span className="text-gray-700">
              High-converting layouts and call-to-action placements
            </span>
          </li>
          <li className="flex gap-4">
            <FaUsers className="text-accent mt-1" />
            <span className="text-gray-700">
              Mobile-first designs for all devices
            </span>
          </li>
          <li className="flex gap-4">
            <FaShieldAlt className="text-accent mt-1" />
            <span className="text-gray-700">
              Secure checkout and customer data protection
            </span>
          </li>
        </ul>
      </div>
    </div>

    {/* ================= SECOND FEATURE ================= */}
    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

      {/* TEXT */}
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
          Built for Growth, Speed & Scalability
        </h3>

        <p className="mt-5 text-gray-600 text-lg">
          Whether you are launching your online store or scaling an
          established business, our solutions grow with you — without limits.
        </p>

        <ul className="mt-8 space-y-4">
          <li className="flex gap-4">
            <FaGlobe className="text-accent mt-1" />
            <span className="text-gray-700">
              Global performance optimization for worldwide audiences
            </span>
          </li>
          <li className="flex gap-4">
            <FaChartLine className="text-accent mt-1" />
            <span className="text-gray-700">
              SEO-friendly structure for better Google rankings
            </span>
          </li>
          <li className="flex gap-4">
            <FaBriefcase className="text-accent mt-1" />
            <span className="text-gray-700">
              Professional tools tailored for real businesses
            </span>
          </li>
        </ul>
      </div>

      {/* IMAGE */}
      <img
        src="/eee.jpg"
        alt="Website performance and analytics"
        className="w-full rounded-3xl shadow-lg"
      />
    </div>

    {/* ================= FINAL CTA ================= */}
    <div className="mt-28 text-center bg-white rounded-3xl p-14 shadow-xl">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
        Start Building Your Online Presence Today
      </h3>

      <p className="mt-5 text-gray-600 text-lg max-w-3xl mx-auto">
        Join thousands of businesses already growing online with powerful,
        reliable, and conversion-focused websites built to succeed.
      </p>

       <Link
        to="/products"
        className="inline-block mt-10 bg-accent hover:opacity-90
                   text-white text-lg font-semibold
                   px-10 py-4 rounded-lg shadow-lg
                   transition-all duration-300"
      >
        Get Started Now
      </Link>
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
