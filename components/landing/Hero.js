import { useState, useEffect } from "react";
import Header from "../Header";
import { motion } from "framer-motion";

export default function Hero({ imageCarousel }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageCarousel.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [imageCarousel.length]);

  return (
    <div className="relative w-full">
      <div className="border-t border-gray-200 "></div>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 Aspect Ratio */}
        {imageCarousel.map((image, index) => (
          <motion.img
            key={index}
            src={image.src}
            alt={`Background ${index}`}
            className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-500 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ zIndex: index === currentImageIndex ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}
