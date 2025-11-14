import { Link } from 'react-router'

export default function HomePage() {
  return (
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
        <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4 sm:mb-6
                       drop-shadow-2xl tracking-[0.15em] uppercase font-serif">
          Elevate your presence
        </h1>

        <p className="text-lg sm:text-xl text-gray-200 mb-8 leading-relaxed
                       drop-shadow font-light italic tracking-wide">
          Discover refined scents crafted to express elegance, confidence,
          and individuality.
        </p>

        <Link
          to="/products"
          className="inline-block bg-white/90 hover:bg-white 
                     text-gray-900 font-medium py-3 px-10 sm:px-12 rounded-full 
                     shadow-xl backdrop-blur-sm transition duration-300
                     tracking-wide uppercase"
        >
          Explore Collection
        </Link>
      </div>
    </div>
  )
}
