"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef } from "react"

const testimonials = [
  {
    name: "Abhishek Agarwal",
    role: "Managing Director, SKA Ispat Pvt. Ltd. (Sarthak TMT)",
    avatar: "/SKA.jpg?height=60&width=60",
    content: "Working with Botivate has been a game-changer for us. Their systems are not only efficient but also incredibly user-friendly. The team understands our operations deeply and delivers solutions that actually work on the ground. Their dedication, speed, and clean execution have added real value to our business.",
    rating: 5,
  },
  {
    name: "Gaurav Jain",
    role: "Managing Director, RBP Energy",
    avatar: "/RBP.jpg?height=60&width=60",
    content: "Botivate's team is truly professional. They don't just deliver systems—they go the extra mile to support us at the ground level. Their approach is neat, clean, and highly effective. The systems they've built for us are crazy good—smart, fast, and tailored exactly to our needs. Highly recommend working with them!",
    rating: 5,
  },
  {
    name: "Sunil Ramnani",
    role: "Managing Director, Mamta Superspeciality Hospital",
    avatar: "/MAMTA.jpg?height=60&width=60",
    content: "Botivate's team has brought a remarkable shift in how we manage hospital operations. Their systems are fast, clean, and tailored to our daily needs. What sets them apart is their practical, on-ground approach and continuous support. Truly appreciate their professionalism and commitment.",
    rating: 5,
  },
  {
    name: "Akshay Bardia",
    role: "Managing Director, AT Plus Jewels Pvt. Ltd",
    avatar: "/AT.jpg?height=60&width=60",
    content: "Botivate's team has done an exceptional job streamlining our jewelry manufacturing operations. Their system didn't just digitize our operations; it simplified them. From factory floors to real-time tracking, we now run faster, smoother, and smarter. Hats off to their dedication and on-ground support!",
    rating: 5,
  },
  {
    name: "Dilip Kodwani",
    role: "Managing Director, Acemark Stationers",
    avatar: "/Ace.jpg?height=60&width=60",
    content: "Botivate has been a true partner in streamlining our operations. Their team delivers exactly what a business needs—clean, fast, and effective systems. The ground-level support they offer makes a real difference. We’re extremely satisfied with the outcomes.",
    rating: 5,
  },
  {
    name: "Shashank agarwal",
    role: "Managing Director, Divine empire",
    avatar: "/DIVINE.jpg?height=60&width=60",
    content: "We are into the sales and service of small construction equipment, and finding the right expert to help us with automation, AI, and system development was a real challenge—until we came across him. His expertise is unmatched in Chhattisgarh. The systems he's building for our company are practical, intelligent, and absolutely game-changing. Genuine, committed, and exceptionally skilled—he is the one and only expert we trust for such high-level work.",
    rating: 5,
  },
]

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 80, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -60, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
      },
    },
  }

  const scrollLeft = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = newIndex * 416 // 384 + 32 gap
      }
    }
  }

  const scrollRight = () => {
    if (currentIndex < testimonials.length - 3) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = newIndex * 416 // 384 + 32 gap
      }
    }
  }

  const handleScroll = (e) => {
    const container = e.target
    const scrollLeft = container.scrollLeft
    const cardWidth = 416 // 384 + 32 gap
    const newIndex = Math.round(scrollLeft / cardWidth)
    setCurrentIndex(newIndex)
  }

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-cyan-900/10" />

      {/* Floating background elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full blur-2xl"
      />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            What Our{" "}
            <motion.span
              className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              Clients Say
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Don't just take our word for it - hear from the companies we've helped transform
          </motion.p>

          {/* Navigation Arrows */}
          <motion.div 
            className="flex justify-center items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <motion.button
              onClick={scrollLeft}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full border-2 transition-all duration-300 ${
                currentIndex === 0 
                  ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                  : 'border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white'
              }`}
              whileHover={currentIndex !== 0 ? { scale: 1.1 } : {}}
              whileTap={currentIndex !== 0 ? { scale: 0.9 } : {}}
            >
              <ChevronLeft size={24} />
            </motion.button>
            
            <motion.button
              onClick={scrollRight}
              disabled={currentIndex >= testimonials.length - 3}
              className={`p-3 rounded-full border-2 transition-all duration-300 ${
                currentIndex >= testimonials.length - 3 
                  ? 'border-gray-600 text-gray-600 cursor-not-allowed' 
                  : 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white'
              }`}
              whileHover={currentIndex < testimonials.length - 3 ? { scale: 1.1 } : {}}
              whileTap={currentIndex < testimonials.length - 3 ? { scale: 0.9 } : {}}
            >
              <ChevronRight size={24} />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Custom CSS for hiding scrollbar */}
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Scrollable Container */}
        <div className="relative">
          <motion.div
            ref={scrollContainerRef}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ 
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
            onScroll={handleScroll}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  rotateY: 5,
                }}
                whileTap={{ scale: 0.95 }}
                className="group cursor-pointer flex-shrink-0 w-96"
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                  scrollSnapAlign: 'start'
                }}
              >
                <motion.div
                  className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/10 h-full overflow-hidden"
                  whileHover={{
                    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {/* Animated background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-600/10"
                    initial={{ scale: 0, rotate: 45 }}
                    whileHover={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%", skewX: -15 }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1 }}
                  />

                  <div className="relative z-10">
                    <motion.div
                      className="absolute top-4 right-4 text-purple-400/30"
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Quote size={32} />
                    </motion.div>

                    <motion.div className="flex items-center mb-4" initial={{ opacity: 0.8 }} whileHover={{ opacity: 1 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.2, rotate: 15 }}
                          transition={{ duration: 0.2, delay: i * 0.1 }}
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.p
                      className="text-gray-300 mb-6 leading-relaxed"
                      initial={{ opacity: 0.9 }}
                      whileHover={{ opacity: 1, x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      "{testimonial.content}"
                    </motion.p>

                    <motion.div className="flex items-center" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <motion.img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div>
                        <motion.h4
                          className="text-white font-semibold"
                          whileHover={{ color: "#8b5cf6" }}
                          transition={{ duration: 0.2 }}
                        >
                          {testimonial.name}
                        </motion.h4>
                        <motion.p
                          className="text-gray-400 text-sm"
                          whileHover={{ color: "#06b6d4" }}
                          transition={{ duration: 0.2 }}
                        >
                          {testimonial.role}
                        </motion.p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Corner decoration */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-tr-full"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}