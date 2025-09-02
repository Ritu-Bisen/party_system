"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useInView } from "react-intersection-observer"
import {
  AlertTriangle,
  CheckCircle,
  X,
  Smartphone,
  Zap,
  Users,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
  Star,
  Shield,
  Rocket,
} from "lucide-react"
import Button from "./ui/Button"
import { useRef, useEffect, useState, useCallback, useMemo } from "react"

const problems = [
  { icon: "💸", text: "Sales are lost because follow-ups are missed", impact: "Lost Revenue" },
  { icon: "⏰", text: "Tasks are delayed because no one takes ownership", impact: "Missed Deadlines" },
  { icon: "🔄", text: "Your time is wasted solving the same things again and again", impact: "Burnout Risk" },
]

const failedSolutions = [
  { icon: "📊", text: "Google Sheets to track everything", cost: "$0/month", result: "Still chaotic" },
  { icon: "💸", text: "Expensive CRMs and automation tools", cost: "$200+/month", result: "Team won't use it" },
]

const whyTheyFail = [
  { icon: Smartphone, text: "Poor mobile experience", detail: "Your team works on phones, but the system doesn't" },
  { icon: Clock, text: "Painfully slow performance", detail: "Loading times kill productivity and motivation" },
  { icon: X, text: "Terrible user experience", detail: "If it's hard to use, your team will avoid it" },
]

const solutions = [
  { icon: Users, text: "No more chasing staff", benefit: "Automatic accountability" },
  { icon: Target, text: "No more missed follow-ups", benefit: "Smart reminders & tracking" },
  { icon: Zap, text: "No more complicated tools", benefit: "Intuitive, mobile-first design" },
  { icon: TrendingUp, text: "Real results in your pocket", benefit: "Live analytics & insights" },
]

const stats = [
  { value: "87%", label: "Reduction in missed tasks", color: "from-green-400 to-emerald-500" },
  { value: "3x", label: "Faster task completion", color: "from-blue-400 to-cyan-500" },
  { value: "95%", label: "Team adoption rate", color: "from-purple-400 to-pink-500" },
]

// Optimized floating particles component
const FloatingParticles = ({ count = 12 }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        initialX: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        initialY: Math.random() * 800,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 2,
      })),
    [count],
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
          style={{
            willChange: "transform, opacity",
          }}
          initial={{
            x: particle.initialX,
            y: particle.initialY,
            opacity: 0,
          }}
          animate={{
            y: particle.initialY - 200,
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

export default function ProblemSolution() {
  const containerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Optimized scroll animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Use spring for smoother animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const y1 = useTransform(smoothProgress, [0, 1], [50, -50])
  const y2 = useTransform(smoothProgress, [0, 1], [-30, 30])

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Debounced mouse tracking for better performance
  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    let timeoutId
    const debouncedMouseMove = (e) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => handleMouseMove(e), 16) // ~60fps
    }

    window.addEventListener("mousemove", debouncedMouseMove)
    return () => {
      window.removeEventListener("mousemove", debouncedMouseMove)
      clearTimeout(timeoutId)
    }
  }, [handleMouseMove])

  // Optimized animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  // Optimized hover animations
  const cardHover = {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2, ease: "easeOut" },
  }

  const iconHover = {
    scale: 1.1,
    rotate: 5,
    transition: { duration: 0.2, ease: "easeOut" },
  }

  return (
    <section ref={containerRef} className="relative py-20 lg:py-32 overflow-hidden">
      {/* Simplified Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08),transparent_50%)]" />
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.1), transparent 40%)`,
            willChange: "background",
          }}
        />
      </div>

      {/* Optimized Floating Particles */}
      <FloatingParticles count={8} />

      {/* Simplified Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.01)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30" />

      {/* Optimized Floating Elements */}
      <motion.div
        style={{ y: y1, willChange: "transform" }}
        className="absolute top-20 left-10 w-24 h-24 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-2xl"
      />

      <motion.div
        style={{ y: y2, willChange: "transform" }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-2xl"
      />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Problem Statement */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <motion.div
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-900/40 to-orange-900/40 backdrop-blur-sm border border-red-500/20 rounded-full px-8 py-4 mb-8"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <span className="text-red-300 font-semibold text-lg">The Hidden Business Crisis</span>
            </motion.div>

            <motion.h2
              className="text-4xl lg:text-7xl font-black text-white mb-8 leading-tight"
              variants={itemVariants}
            >
              <span className="block text-6xl mb-4">😩</span>
              The Problem Every Business Owner Faces
              <span className="block text-3xl lg:text-4xl text-gray-400 font-normal mt-4">
                (But No One Talks About)
              </span>
            </motion.h2>

            <motion.div
              className="max-w-4xl mx-auto space-y-6 text-xl lg:text-2xl text-gray-300 leading-relaxed"
              variants={itemVariants}
            >
              <p>
                You've built a team — but work still doesn't happen unless{" "}
                <span className="text-red-400 font-semibold">you follow up</span>.
              </p>
              <p>
                You hired people — but they wait for <span className="text-red-400 font-semibold">your reminder</span>.
              </p>
              <p>
                You chase them for updates… and when nothing moves,{" "}
                <span className="text-red-400 font-semibold">you do it yourself</span>.
              </p>
            </motion.div>
          </motion.div>

          {/* Optimized Problems Grid */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="grid lg:grid-cols-3 gap-8">
              {problems.map((problem, index) => (
                <motion.div key={index} className="group relative" whileHover={cardHover}>
                  <div
                    className="relative p-8 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-sm border border-red-500/20 rounded-3xl overflow-hidden"
                    style={{ willChange: "transform" }}
                  >
                    <div className="relative z-10">
                      <motion.div className="text-4xl mb-4" whileHover={iconHover}>
                        {problem.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-3">{problem.text}</h3>
                      <div className="inline-flex items-center space-x-2 bg-red-500/20 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-red-400 rounded-full" />
                        <span className="text-red-300 text-sm font-medium">{problem.impact}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Optimized Failed Solutions */}
          <motion.div variants={itemVariants} className="mb-20">
            <motion.div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Frustrated, you try to fix it yourself —
              </h3>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {failedSolutions.map((solution, index) => (
                <motion.div key={index} className="group relative" whileHover={cardHover}>
                  <div
                    className="relative p-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-600/20 rounded-3xl overflow-hidden"
                    style={{ willChange: "transform" }}
                  >
                    <div className="flex items-start space-x-6">
                      <motion.div className="text-5xl" whileHover={iconHover}>
                        {solution.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-white mb-2">{solution.text}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">{solution.cost}</span>
                          <div className="flex items-center space-x-2 text-red-400">
                            <X className="w-4 h-4" />
                            <span className="text-sm font-medium">{solution.result}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div className="text-center mb-12">
              <h4 className="text-2xl lg:text-3xl font-bold text-white mb-8">But nothing works as expected.</h4>
              <p className="text-4xl lg:text-5xl font-black mb-12">
                <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Why?
                </span>
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {whyTheyFail.map((reason, index) => (
                <motion.div key={index} className="group relative" whileHover={cardHover}>
                  <div
                    className="relative p-8 bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-sm border border-red-500/20 rounded-3xl text-center overflow-hidden"
                    style={{ willChange: "transform" }}
                  >
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                      whileHover={iconHover}
                    >
                      <reason.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <h4 className="text-xl font-bold text-white mb-3">{reason.text}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{reason.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Emotional Impact */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <motion.div
              className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-gray-900/40 to-black/40 backdrop-blur-sm border border-gray-700/30 rounded-3xl"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-2xl lg:text-3xl text-gray-300 mb-6 leading-relaxed">
                You're stuck — doing everything yourself, <span className="text-red-400 font-semibold">again</span>.
              </p>
              <p className="text-xl text-gray-400 mb-4">And deep down, you're tired.</p>
              <p className="text-2xl text-white font-semibold">
                Tired of spending money, tired of chasing people, tired of broken systems.
              </p>
            </motion.div>
          </motion.div>

          {/* Solution Section */}
          <motion.div variants={itemVariants} className="mb-20">
            <motion.div className="text-center mb-16">
              <motion.div
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-900/40 to-emerald-900/40 backdrop-blur-sm border border-green-500/20 rounded-full px-8 py-4 mb-8"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-green-300 font-semibold text-lg">The Real Solution</span>
              </motion.div>

              <motion.h3 className="text-4xl lg:text-6xl font-black mb-8" variants={itemVariants}>
                <span className="block text-5xl mb-4">🚀</span>
                The Real Solution:{" "}
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent block">
                  Systems That Actually Work
                </span>
              </motion.h3>

              <motion.div className="max-w-4xl mx-auto space-y-6 text-xl lg:text-2xl text-gray-300 leading-relaxed">
                <p>
                  It's time for a system that your team will{" "}
                  <span className="text-green-400 font-semibold">actually use</span> —
                </p>
                <p>
                  and that helps you step back and <span className="text-green-400 font-semibold">focus on growth</span>
                  .
                </p>
              </motion.div>
            </motion.div>

            {/* Solution Features */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {solutions.map((solution, index) => (
                <motion.div key={index} className="group relative" whileHover={cardHover}>
                  <div
                    className="relative p-8 bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-green-500/20 rounded-3xl overflow-hidden"
                    style={{ willChange: "transform" }}
                  >
                    <div className="flex items-start space-x-6">
                      <motion.div
                        className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center"
                        whileHover={iconHover}
                      >
                        <solution.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2">{solution.text}</h4>
                        <p className="text-green-300 text-sm font-medium">{solution.benefit}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Optimized Stats */}
            <motion.div className="grid lg:grid-cols-3 gap-8 mb-16">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl"
                  whileHover={cardHover}
                >
                  <div
                    className={`text-5xl lg:text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-4`}
                  >
                    {stat.value}
                  </div>
                  <p className="text-gray-300 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Optimized CTA Section */}
          <motion.div variants={itemVariants} className="relative">
            <motion.div
              className="relative p-12 lg:p-16 bg-gradient-to-br from-purple-900/30 via-cyan-900/30 to-purple-900/30 backdrop-blur-sm border border-white/10 rounded-3xl text-center overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative z-10">
                <div className="text-6xl mb-6">💡</div>

                <h4 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Connect with us today and get a{" "}
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    free demo
                  </span>
                </h4>

                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Let us show you how we can automate your business — and your stress.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      onClick={() => {
                        document.getElementById("contact")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-5 text-xl font-bold group"
                    >
                      <span className="flex items-center">
                        Get Free Demo
                        <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </Button>
                  </motion.div>


                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white/20 text-white hover:bg-white/10 px-10 py-5 text-xl font-bold bg-transparent backdrop-blur-sm"
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center justify-center space-x-8 mt-12 pt-8 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300 text-sm">Enterprise Security</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300 text-sm">5-Star Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Rocket className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-300 text-sm">Quick Setup</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
