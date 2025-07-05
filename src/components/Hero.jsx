"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "./ui/Button"
import { ArrowRight, Play, Sparkles, CheckCircle } from "lucide-react"
import ModelViewer from "./ModelViewer"

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const benefits = ["500+ Successful Implementations", "98% Client Satisfaction Rate", "24/7 Expert Support"]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-cyan-900/30" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
          }}
        />
      </div>

      {/* Enhanced Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 text-purple-400/70"
      >
        <Sparkles size={40} />
      </motion.div>

      <motion.div
        animate={{
          y: [20, -20, 20],
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-40 right-32 text-cyan-400/70"
      >
        <div className="w-4 h-4 bg-cyan-400 rounded-full blur-sm" />
      </motion.div>

      <div className="container mx-auto px-4 pt-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-10"
          >
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-900/50 to-cyan-900/50 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3"
            >
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-base text-gray-200 font-medium">Trusted by 500+ Companies</span>
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
                <span className="text-white">Transform Your</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Business Future
                </span>
              </h1>
            </motion.div>

            {/* Enhanced Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-2xl text-gray-300 leading-relaxed max-w-2xl"
            >
              Harness the power of AI automation to{" "}
              <span className="text-white font-semibold">streamline operations</span>,{" "}
              <span className="text-white font-semibold">eliminate inefficiencies</span>, and{" "}
              <span className="text-white font-semibold">scale beyond limits</span>.
            </motion.p>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-4"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-lg text-gray-300">{benefit}</span>
                </div>
              ))}
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-10 py-6 text-xl font-semibold group shadow-2xl"
              >
                Start Your Journey
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              {[
                { value: "500+", label: "Projects Delivered", color: "from-purple-400 to-pink-400" },
                { value: "98%", label: "Success Rate", color: "from-cyan-400 to-blue-400" },
                { value: "24/7", label: "Expert Support", color: "from-green-400 to-emerald-400" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Right Content - 3D Model */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Enhanced Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-cyan-600/40 rounded-full blur-3xl scale-150 animate-pulse" />

              {/* Model Container */}
              <div className="relative z-10">
                <ModelViewer
                  url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
                  width={600}
                  height={600}
                  autoRotate={true}
                  autoRotateSpeed={0.3}
                  environmentPreset="sunset"
                  enableControls={true}
                  showScreenshotButton={false}
                  ambientIntensity={0.6}
                  directionalIntensity={1.5}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-1.5 h-4 bg-white/70 rounded-full mt-3"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
