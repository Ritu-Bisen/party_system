"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { CheckCircle, TrendingUp, Users, Award } from "lucide-react"

const features = [
  {
    icon: CheckCircle,
    title: "Proven Results",
    description: "Over 500 successful automation implementations across various industries",
  },
  {
    icon: TrendingUp,
    title: "Scalable Solutions",
    description: "Future-proof automation systems that grow with your business needs",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Dedicated professionals with years of experience in automation and AI",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "98% success rate with comprehensive testing and ongoing support",
  },
]

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const slideInLeft = {
    hidden: { opacity: 0, x: -100, rotateY: -15 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const slideInRight = {
    hidden: { opacity: 0, x: 100, rotateY: 15 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-600/5 to-cyan-600/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <div>
              <motion.h2
                className="text-4xl lg:text-5xl font-bold text-white mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                Why Choose{" "}
                <motion.span
                  className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  Botivate
                </motion.span>
              </motion.h2>
              <motion.p
                className="text-xl text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                We specialize in transforming businesses through intelligent automation. Our cutting-edge solutions
                eliminate inefficiencies, reduce errors, and unlock your organization's full potential.
              </motion.p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="space-y-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="flex items-start space-x-4 cursor-pointer"
                >
                  <motion.div
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 p-2 rounded-lg flex-shrink-0"
                    whileHover={{
                      rotate: [0, -10, 10, 0],
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="text-white" size={20} />
                  </motion.div>
                  <div>
                    <motion.h3
                      className="text-white font-semibold text-lg mb-2"
                      whileHover={{ color: "#8b5cf6" }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p
                      className="text-gray-300"
                      whileHover={{ color: "#d1d5db" }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.description}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="space-y-6"
          >
            <motion.div
              className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8 relative overflow-hidden"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(139, 92, 246, 0.2)",
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"
                initial={{ scale: 0, rotate: 45 }}
                whileHover={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  To empower businesses with intelligent automation solutions that drive efficiency, innovation, and
                  sustainable growth in the digital age.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-cyan-900/50 to-purple-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8 relative overflow-hidden"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 25px 50px rgba(6, 182, 212, 0.2)",
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-purple-600/10"
                initial={{ scale: 0, rotate: -45 }}
                whileHover={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  To be the leading provider of automation solutions, helping organizations worldwide achieve
                  operational excellence through cutting-edge technology.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="bg-white/5 backdrop-blur-lg border border-white/10 text-center p-6 rounded-2xl relative overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 15px 30px rgba(139, 92, 246, 0.2)",
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <motion.div
                    className="text-3xl font-bold text-purple-400 mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  >
                    5+
                  </motion.div>
                  <div className="text-gray-300">Years Experience</div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/5 backdrop-blur-lg border border-white/10 text-center p-6 rounded-2xl relative overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 15px 30px rgba(6, 182, 212, 0.2)",
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-transparent"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="relative z-10">
                  <motion.div
                    className="text-3xl font-bold text-cyan-400 mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                  >
                    50+
                  </motion.div>
                  <div className="text-gray-300">Team Members</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
