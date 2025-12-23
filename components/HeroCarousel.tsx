'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const slides = [
  { src: '/images/hero-1.jpg', alt: 'Inclusive Excellence activity' },
  { src: '/images/hero-2.jpg', alt: 'Whitman College clock tower' },
  { src: '/images/hero-3.jpg', alt: 'Community gathering and meal' },
  // hero-4 supports png (if you keep it as jpg, update the filename here)
  { src: '/images/hero-4.png', alt: 'Cultural celebration' },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const current = slides[index];

  return (
    <div className="bg-white rounded-lg border-2 border-whitman-navy overflow-hidden shadow-lg">
      <div className="relative w-full h-96 bg-gradient-to-br from-whitman-lightblue to-white">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          className="object-cover transition-opacity duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/5" />
        <div className="absolute bottom-4 left-4 text-white drop-shadow-sm">
          <div className="text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
            {current.alt}
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-8 rounded-full border border-white/70 ${
                i === index ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

