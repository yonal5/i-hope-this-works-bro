import { useState } from "react";

export default function ImageSlider({ images, className }) {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full">
      <div className="overflow-hidden w-full aspect-[1/1] sm:aspect-[4/3] rounded-xl">
        <img
          src={images[current]}
          alt="product"
          className={`${className} w-full h-full object-contain`}
        />
      </div>

      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 shadow"
          >
            &#8592;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-1 shadow"
          >
            &#8594;
          </button>
        </>
      )}

      {/* Dots */}
      <div className="flex justify-center mt-2 gap-1">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx === current ? "bg-accent" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}
