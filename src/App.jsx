"use client"

import { useState } from "react"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Services from "./components/Services"
import Testimonials from "./components/Testimonials"
import Counter from "./components/Counter"
import Features from "./components/Features"
import ReadyToStart from "./components/readyToStart"
import Footer from "./components/footer"
import WhatsAppChat from "./components/WhatsappChat"
import Product from "./components/products"
import ProductsPage from "./components/ProductPage"
import ProblemSolution from "./components/ProblemSolution"

function App() {
  const [currentPage, setCurrentPage] = useState("home")

  const handleViewAllProducts = () => {
    setCurrentPage("products")
  }

  const handleBackToHome = () => {
    setCurrentPage("home")
  }

  if (currentPage === "products") {
    return (
      <div className="bg-black text-white overflow-hidden">
        <ProductsPage onBackToHome={handleBackToHome} />
        <WhatsAppChat />
      </div>
    )
  }

  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Navbar with high z-index to stay on top */}
      <div className="relative z-50">
        <Navbar />
      </div>

      <main>
        <section id="home" className="relative z-10">
          <Hero />
        </section>

        {/* Add the new Problem Solution section */}
        <section className="relative z-10">
          <ProblemSolution />
        </section>

        {/* Parallax Section - Isolated with reduced mobile spacing */}
        {/* <div className="relative z-0 -mt-4 sm:-mt-1">
          <ParallaxSection />
        </div> */}

        {/* Reset background for other sections with tighter mobile spacing */}
        <div className="bg-black relative z-10 -mt-8 sm:-mt-1">
          <div className="pt-4 sm:pt-0">
            <Features />
          </div>

          <section id="about" className="mt-4 sm:mt-0">
            <About />
          </section>

          <section id="services" className="mt-4 sm:mt-0">
            <Services />
          </section>

          <section id="products" className="mt-4 sm:mt-0">
            <Product onViewAllProducts={handleViewAllProducts} />
          </section>

          <div className="mt-4 sm:mt-0">
            <Testimonials />
          </div>

          <div className="mt-4 sm:mt-0">
            <Counter />
          </div>

          {/* <section id="contact" className="mt-4 sm:mt-0">
            <Contact />
          </section> */}

          {/* Ready to Get Started Section */}
          <div className="mt-4 sm:mt-0">
            <ReadyToStart />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Chat - Always visible */}
      <WhatsAppChat />
    </div>
  )
}

export default App
