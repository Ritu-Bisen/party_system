"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Bot, Cog, Database, MessageSquare, BarChart3, Shield, Zap, Users } from "lucide-react"

const services = [
  {
    icon: Bot,
    title: "AI Integration",
    description: "Implement cutting-edge AI solutions to automate complex tasks and decision-making processes.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Cog,
    title: "Process Automation",
    description: "Streamline your workflows and eliminate manual tasks with intelligent automation systems.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: MessageSquare,
    title: "Chatbot Solutions",
    description: "Deploy smart chatbots for customer service, lead generation, and user engagement.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Organize, analyze, and leverage your data with automated data processing solutions.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track, measure, and optimize your business performance with real-time analytics.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Tech Audits",
    description: "Comprehensive technology assessments to identify gaps and optimization opportunities.",
    color: "from-teal-500 to-blue-500",
  },
  {
    icon: Zap,
    title: "Efficiency Boost",
    description: "Maximize productivity and reduce operational costs through smart automation.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Expert Consultation",
    description: "Get personalized guidance from our automation experts to transform your business.",
    color: "from-pink-500 to-rose-500",
  },
]

export default function Services() {
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
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -60, rotateY: -15 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const titleDropDown = {
    hidden: { opacity: 0, y: -100, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <section ref={ref} className="py-20 px-4 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/5 to-cyan-600/5 rounded-full blur-3xl"
      />

      <div className="container mx-auto relative z-10">
        <motion.div
          variants={titleDropDown}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl lg:text-6xl font-bold text-white mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            Our{" "}
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
              Services
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Comprehensive automation solutions designed to transform your business operations and drive growth
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -15,
                rotateX: 5,
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
                className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-500 group h-full rounded-2xl p-6 relative overflow-hidden"
                whileHover={{
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  initial={{ scale: 0, rotate: 45 }}
                  whileHover={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: `linear-gradient(135deg, ${service.color.split(" ")[1]}/10, ${service.color.split(" ")[3]}/10)`,
                  }}
                />

                {/* Sliding highlight effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%", skewX: -15 }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8 }}
                />

                <div className="relative z-10">
                  <motion.div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{
                      rotate: [0, -15, 15, 0],
                      scale: 1.2,
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <service.icon className="text-white" size={24} />
                  </motion.div>

                  <motion.h3
                    className="text-white text-xl font-semibold mb-3"
                    initial={{ opacity: 0.9 }}
                    whileHover={{ opacity: 1, x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {service.title}
                  </motion.h3>

                  <motion.p
                    className="text-gray-300 leading-relaxed"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, x: 3 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    {service.description}
                  </motion.p>
                </div>

                {/* Corner decoration */}
                <motion.div
                  className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/5 to-transparent rounded-tl-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
