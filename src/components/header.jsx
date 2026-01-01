import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// Icons
import { MdMenu } from "react-icons/md";
import { BsCart3 } from "react-icons/bs";
import { FaHome, FaChevronLeft, FaChevronRight, FaPlay, FaSearch } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";
import { IoMdContacts } from "react-icons/io";
import { IoSettingsSharp } from "react-icons/io5";
import UserData from "./userData";
import UserDataMobile from "./userDataMobile";

export default function Header() {
  const [isSideBarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // derive page and pageSize from URL (keep read-only here)
  const params = new URLSearchParams(location.search);
  const currentPage = Number(params.get("page") || 1);
  const currentPageSize = Number(params.get("pageSize") || 20);

  // keep header inputs synced with ?search=... & ?category=...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchTerm(params.get("search") || "");
    setCategory(params.get("category") || "");
  }, [location.search]);
  
  const updateQuery = (newParams) => {
    const next = new URLSearchParams(location.search);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    navigate(`${location.pathname}?${next.toString()}`);
  };

  // prevent background scroll when mobile search is open
  useEffect(() => {
    document.body.style.overflow = mobileSearchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSearchOpen]);

  // refs for mobile search
  const mobileInputRef = useRef(null);
  useEffect(() => {
    if (mobileSearchOpen && mobileInputRef.current) {
      // small delay to ensure element is in DOM
      setTimeout(() => mobileInputRef.current.focus(), 50);
    }
  }, [mobileSearchOpen]);

  // close mobile search on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMobileSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="w-full bg-accent  h-[100px] text-white px-[40px]">
      <div className="w-full h-full flex relative ">
        <img
          src="/logo.png"
          className="hidden lg:flex h-full absolute w-[160px] left-0  object-cover"
        />
        {/* mobile header: menu, logo and search toggle */}
        <div className="lg:hidden w-full relative flex justify-center items-center">
          <MdMenu
            className="absolute left-2 text-3xl"
            onClick={() => setIsSidebarOpen(true)}
          />
          <img src="/logo.png" className="h-full w-[170px] object-cover" />
          <button
            className="absolute right-2 text-2xl p-1 rounded bg-white/10"
            aria-label="Open search"
            onClick={() => setMobileSearchOpen(true)}
          >
            <FaSearch />
          </button>
        </div>

        {/* mobile search overlay - centered, high z and scroll-safe */}
        {mobileSearchOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded shadow p-3 max-h-[90vh] overflow-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const params = new URLSearchParams();
                  if (searchTerm.trim()) params.set("search", searchTerm.trim());
                  if (category) params.set("category", category);
                  setMobileSearchOpen(false);
                  navigate(`/products?${params.toString()}`);
                }}
                className="flex flex-col sm:flex-row gap-2 items-stretch"
              >
                <input
                  ref={mobileInputRef}
                  type="text"
                  className="flex-1 px-3 py-2 border rounded text-black"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Mobile search"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-2 py-2 border rounded text-black"
                  aria-label="Mobile category"
                >
                  <option value="">All</option>
                  <option value="one color saree">ONE Color Saree</option>
								<option value="two color saree">TWO Color Saree</option>
								<option value="three color saree">THREE Color Saree</option>
								<option value="four color saree">FOUR Color Saree</option>
								<option value="five color saree">FIVE Color Saree</option>
								<option value="six color saree">SIX Color Saree</option>
								<option value="seven color saree">SEVEN Color Saree</option>
								<option value="eight color saree">EIGHT Color Saree</option>
                </select>

                <div className="flex gap-2 justify-center items-center">
                  <button type="submit" className= "ml-1 bg-accent text-white px-3 py-2 rounded border">
                    Search
                  </button>
                  <button
                    to="/"
                    type="button"
                    onClick={ () => setMobileSearchOpen(false)}
                    className="ml-1 bg-accent text-white px-3 py-2 rounded border"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {isSideBarOpen && (
          <div className="fixed top-0 left-0 w-full h-screen bg-[#00000080] text-secondary z-100">
            <div className="w-[300px] bg-primary h-full flex flex-col relative">
              <div className="lg:hidden h-[100px] w-full bg-accent relative  flex justify-center items-center">
                <MdMenu
                  className="absolute left-2 text-white text-3xl"
                  onClick={() => setIsSidebarOpen(false)}
                />
                <img
                  src="/logo.png"
                  className="  h-full  w-[170px]   object-cover"
                />
              </div>
              <a href="/" className="p-4 border-b border-secondary/10">
                Home
              </a>
              <a href="/products" className="p-4 border-b border-secondary/10">
                Products
              </a>
              <a href="/about" className="p-4 border-b border-secondary/10">
                About
              </a>
              <a href="/chat" className="p-4 border-b border-secondary/10">
                Chat
              </a>
              <a href="/cart" className="p-4 border-b border-secondary/10">
                Cart
              </a>
              <div className=" lg:hidden flex w-[300px] absolute bottom-[20px] left-0  justify-center items-center gap-4">
                <UserDataMobile />
              </div>
            </div>
          </div>
        )}

        <div className="hidden object-cover h-full lg:flex justify-center items-center w-full text-lg gap-[20px]">
          {/* Search form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim() === "" && !category) return;
              // build query for products page
              const params = new URLSearchParams();
              if (searchTerm.trim()) params.set("search", searchTerm.trim());
              if (category) params.set("category", category);
              navigate(`/products?${params.toString()}`);
            }}
            className="w-[480px] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded px-3 py-2 text-black bg-primary"
              aria-label="Search"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded px-2 py-2 text-black bg-primary"
              aria-label="Category filter"
            >
              <option value="">All categories</option>
              <option value="one color saree">ONE Color Saree</option>
								<option value="two color saree">TWO Color Saree</option>
								<option value="three color saree">THREE Color Saree</option>
								<option value="four color saree">FOUR Color Saree</option>
								<option value="five color saree">FIVE Color Saree</option>
								<option value="six color saree">SIX Color Saree</option>
								<option value="seven color saree">SEVEN Color Saree</option>
								<option value="eight color saree">EIGHT Color Saree</option>

            </select>
            <button
              type="submit"
              className="bg-accent text-white p-2 rounded hover:bg-white hover:text-accent transition"
              aria-label="Submit search"
            >
              <FaSearch />
            </button>
          </form>
        </div>
        <div className="h-full hidden lg:flex w-[200px] absolute right-[33px] top-0  justify-end items-center gap-4">
          <UserData />
        </div>
        <Link
          to="/cart"
          className="h-full absolute right-0 hidden text-3xl lg:flex justify-center items-center"
        >
          
        </Link>
      </div>
    </header>
  );
}


export function TtitleBar() {
  return (
    <header className="w-full h-[100px] mr-[80px] text-white px-[40px] hidden lg:flex justify-center items-center gap-10 bg-accent">
           
      <Link to="/" className="flex gap-2 items-center">
        <FaHome className="text-3xl cursor-pointer" />
        <span>Home</span>
      </Link>

      <Link to="/products" className="flex gap-2 items-center">
        <AiOutlineProduct className="text-3xl cursor-pointer" />
        <span>Products</span>
      </Link>

      <Link to="/chat" className="flex gap-2 items-center">
        <IoMdContacts className="text-3xl cursor-pointer" />
        <span>Chat</span>
      </Link>

      <Link to="/about" className="flex gap-2 items-center">
        About Us
      </Link>

      <Link to="/settings" className="hover:text-accent transition">
        <IoSettingsSharp className="text-3xl cursor-pointer" />
      </Link>
      
      <Link to="/cart" className="flex gap-2 items-center">
         <BsCart3 className="w-[30px] h-[30px]" />
      </Link>
  
     
    </header>
  );
}


export function ProductNews() {
  const desktopSlides = [
 //     { type: "video", src: "/gaming 66.mp4", className: "object-contain"},
 //     { type: "image", src: "/12 (1).png", className: "object-cover" },
 //     { type: "image", src: "/12 (1).jpg", className: "object-cover" },
 //     { type: "image", src: "/12 (2).jpg", className: "object-cover" },
 //     { type: "image", src: "/12 (3).jpg", className: "object-cover" },
 //     { type: "image", src: "/12 (5).jpg", className: "object-cover" },
 //     { type: "image", src: "/12 (6).jpg", className: "object-cover" },
 //     { type: "image", src: "/12 (7).jpg", className: "object-cover" },
 //     { type: "image", src: "/12 (8).jpg", className: "object-cover" },
 //     { type: "image", src: "/12 (9).jpg", className: "object-cover" }, 
 //     { type: "image", src: "/12 (10).jpg", className: "object-cover" },
 //     { type: "image", src: "/12 (12).jpg", className: "object-cover" },
      { type: "image", src: "/websell.png", className: "" },
  ];

  const mobileSlides = [
 { type: "image", src: "/websell.png", className: "" },
   
  ];

  const [slides, setSlides] = useState(desktopSlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth <= 768) setSlides(mobileSlides);
      else setSlides(desktopSlides);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const togglePlay = (i) => {
    const video = videoRefs.current[i];
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  const startSlider = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % slides.length),
      5000
    );
  };

  const stopSlider = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    startSlider();
    return () => stopSlider();
  }, [slides]);

  useEffect(() => {
    slides.forEach((slide, i) => {
      const video = videoRefs.current[i];
      if (video) {
        if (i === currentIndex) video.play();
        else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex, slides]);

  return (
    <div
      className="
        relative w-full 
        md:h-[50vh] lg:h-[60vh] 
        overflow-hidden bg-black shadow-lg
      "
      onMouseEnter={stopSlider}
      onMouseLeave={startSlider}
    >
      <div
        className="flex h-full w-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="w-full h-full flex-shrink-0 flex justify-center items-center relative"
          >
            {slide.type === "image" ? (
              <img
                src={slide.src}
                alt={`Slide ${i}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div onClick={() => togglePlay(i)} className="relative w-full h-full flex justify-center items-center group">
                <video
                  ref={(el) => (videoRefs.current[i] = el)}
                  src={slide.src}
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                />
                
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden absolute top-1/2 left-3 sm:left-5 -translate-y-1/2 text-white bg-black/50 p-2 sm:p-3 lg:flex rounded-full hover:bg-black/70"
      >
        <FaChevronLeft size={28} className="lg:flex" />
        
      </button>

      <button
        onClick={nextSlide}
        className="hidden absolute top-1/2 right-3 sm:right-5 -translate-y-1/2 text-white bg-black/50 p-2 sm:p-3 lg:flex rounded-full hover:bg-black/70"
      >
        <FaChevronRight size={28} className="lg:flex" />
        
      </button>

      {/* Dots */}
      <div className="hidden absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 lg:flex gap-1 sm:gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full cursor-pointer ${
              index === currentIndex ? "bg-orange-500" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
