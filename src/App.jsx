import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import Services from "./components/Services"
import Contact from "./components/Contact"
import Counter from "./components/Counter"
import Features from "./components/Features"
import Testimonials from "./components/Testimonials"

function App() {
  return (
    <div className="bg-black text-white overflow-hidden">
      <Navbar />
      <main>
        <section id="home">
          <Hero />
        </section>
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
      </main>
    </div>
  )
}

export default App
