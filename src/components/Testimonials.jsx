"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO, TechCorp",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "Botivate transformed our entire workflow. We've seen a 300% increase in efficiency since implementation.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "CEO, InnovateLab",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "The AI automation solutions are game-changing. Our team can now focus on strategic initiatives.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Operations Director, ScaleUp",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "Outstanding support and incredible results. Botivate exceeded all our expectations.",
    rating: 5,
  },
]

export default function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

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

      <div className="container mx-auto px-4 relative z-10">
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
            className="text-xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Don't just take our word for it - hear from the companies we've helped transform
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                rotateY: 5,
              }}
              whileTap={{ scale: 0.95 }}
              className="group cursor-pointer"
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
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
    </section>
  )
}
