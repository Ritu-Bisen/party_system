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
import ProductsPage from "./components/ProductPage"
import ProblemSolution from "./components/ProblemSolution"
import AdminDashboard from "./components/Dashboard/AdminDashboard"
import UserDashboard from "./components/Dashboard/UserDashboard"
import VisionMission from "./components/VissionMission"

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [user, setUser] = useState(null) // { type: "admin" | "user", username: string }

  const handleViewAllProducts = () => {
    setCurrentPage("products")
  }

  const handleBackToHome = () => {
    setCurrentPage("home")
    setUser(null)
  }

  const handleLogin = (userType, username) => {
    setUser({ type: userType, username })
    setCurrentPage(userType === "admin" ? "admin-dashboard" : "user-dashboard")
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentPage("home")
  }

  // Function to handle smooth scrolling to Ready to Start section
  const scrollToReadyToStart = () => {
    const element = document.getElementById("ready-to-start")
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    }
  }

  // Admin Dashboard
  if (currentPage === "admin-dashboard" && user?.type === "admin") {
    return <AdminDashboard onLogout={handleLogout} username={user.username} />
  }

  // User Dashboard
  if (currentPage === "user-dashboard" && user?.type === "user") {
    return <UserDashboard onLogout={handleLogout} username={user.username} />
  }

  // Products Page
  if (currentPage === "products") {
    return (
      <div className="bg-black text-white overflow-hidden">
        <ProductsPage onBackToHome={handleBackToHome} />
        <WhatsAppChat />
      </div>
    )
  }

  // Home Page
  return (
    <div className="bg-black text-white overflow-hidden">
      {/* Navbar with high z-index to stay on top */}
      <div className="relative z-50">
        <Navbar onLogin={handleLogin} onContactClick={scrollToReadyToStart} />
      </div>

      <main>
        <section id="home" className="relative z-10">
          <Hero onGetFreeDemoClick={scrollToReadyToStart} />
        </section>

        {/* Add the new Problem Solution section */}
        <section className="relative z-10">
          <ProblemSolution onGetFreeDemoClick={scrollToReadyToStart} />
        </section>

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

          <div className="mt-4 sm:mt-0">
            <Testimonials />
          </div>

          <div className="mt-4 sm:mt-0">
            <Counter onTransformBusinessClick={scrollToReadyToStart} />
          </div>

          {/* Ready to Get Started Section with ID for navigation */}
          <section id="ready-to-start" className="mt-4 sm:mt-0">
            <ReadyToStart />
          </section>
          
          <div className="mt-4 sm:mt-0">
            <VisionMission onTransformBusinessClick={scrollToReadyToStart} />
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