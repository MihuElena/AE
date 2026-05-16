import { Link } from 'react-router'
import { FaInstagram } from 'react-icons/fa'
import { useState } from 'react'
import RatingModal from '../components/RatingModal'

export default function HomePage() {

  const [openRating, setOpenRating] = useState(false)

  return (
    <>
      <div
        className="relative h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1543422655-cb586ad21df1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl text-center px-4 py-8">

          {/* Brand name */}
          <h1
            className="text-5xl sm:text-6xl text-white mb-3
                       font-extralight tracking-[0.2em]
                       drop-shadow-2xl italic"
          >
            Mystique
          </h1>

          <p
            className="text-sm uppercase tracking-[0.6em]
                       text-gray-300 mb-16"
          >
            Fragrance
          </p>

          {/* Subtitle */}
          <h2
            className="text-2xl sm:text-3xl font-medium text-white mb-6
                       tracking-[0.15em] uppercase font-serif"
          >
            Elevate your presence
          </h2>

          <p
            className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed
                       drop-shadow font-light italic tracking-wide"
          >
            Discover refined scents crafted to express elegance, confidence,
            and individuality.
          </p>

          {/* Explore button */}
          <Link
            to="/products"
            className="inline-block bg-white/90 hover:bg-white
                       text-gray-900 font-medium py-3 px-10 sm:px-12 rounded-full
                       shadow-xl backdrop-blur-sm transition duration-300
                       tracking-wide uppercase"
          >
            Explore Collection
          </Link>

          {/* Instagram */}
          <div className="mt-8 flex justify-center">
            <a
              href="https://www.instagram.com/mystique_fragrance_parfumes?igsh=MThndnY2dTYzdnEwbQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/90 hover:text-white
                         transition duration-300 tracking-wide"
            >
              <FaInstagram className="text-2xl" />

              <span className="uppercase text-sm tracking-[0.3em]">
                Follow us
              </span>
            </a>
          </div>

          {/* Rate us */}
          <div className="mt-10 flex justify-center">

            <button
              onClick={() => setOpenRating(true)}
              className="rounded-full border border-white/30 bg-white/10
                         backdrop-blur-md px-8 py-3 text-white
                         tracking-[0.2em] uppercase text-sm
                         hover:bg-white/20 transition duration-300"
            >
              Rate Us
            </button>

          </div>

        </div>
      </div>

      {/* Rating modal */}
      <RatingModal
        open={openRating}
        onClose={() => setOpenRating(false)}
      />
    </>
  )
}