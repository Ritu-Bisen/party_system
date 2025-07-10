import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Services from "./components/Services"
import Testimonials from "./components/Testimonials"
import Contact from "./components/Contact"
import Counter from "./components/Counter"
import Features from "./components/Features"
import ParallaxSection from "./components/parallalSection"
import ReadyToStart from "./components/readyToStart"
import Footer from "./components/footer"
import WhatsAppChat from "./components/WhatsappChat"

function App() {
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

        {/* Parallax Section - Isolated */}
        <div className="relative z-0">
          <ParallaxSection />
        </div>

        {/* Reset background for other sections */}
        <div className="bg-black relative z-10 -mt-1">
          <Features />
          <section id="about">
            <About />
          </section>
          <section id="services">
            <Services />
          </section>
          <Testimonials />
          <Counter />
          <section id="contact">
            <Contact />
          </section>
          {/* Ready to Get Started Section */}
          <ReadyToStart />
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
