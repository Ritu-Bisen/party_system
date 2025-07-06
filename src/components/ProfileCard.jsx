"use client"

import { useEffect, useRef, useCallback } from "react"

const ProfileCard = ({
  avatarUrl = "./src/components/images/ChatGPT_Image_Mar_30__2025__10_12_12_AM-removebg-preview.png",
  name = "Vikas Choudhary",
  title = "Software Engineer",
  handle = "vikashchaudhari103",
  status = "Online",
  contactText = "Contact Me",
  onContactClick,
  enableTilt = true,
}) => {
  const cardRef = useRef(null)
  const glowRef = useRef(null)

  const handleMouseMove = useCallback(
    (e) => {
      if (!enableTilt || !cardRef.current) return

      const card = cardRef.current
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 15
      const rotateY = (centerX - x) / 15

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`

      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(139, 92, 246, 0.4), transparent 50%)`
        glowRef.current.style.opacity = "1"
      }
    },
    [enableTilt],
  )

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    if (glowRef.current) {
      glowRef.current.style.opacity = "0"
    }
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    card.addEventListener("mousemove", handleMouseMove)
    card.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      card.removeEventListener("mousemove", handleMouseMove)
      card.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  const statusColor = status === "Online" ? "#10B981" : "#06B6D4"

  return (
    <div className="relative group">
      <div
        ref={cardRef}
        className="relative w-96 h-[500px] rounded-3xl transition-all duration-300 ease-out cursor-pointer"
        style={{
          background: "linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8))",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Glow Effect */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300"
          style={{
            background: "transparent",
          }}
        />

        {/* Border Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/30 via-transparent to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="text-center pt-10 pb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
            <p className="text-gray-400 text-base font-medium">{title}</p>
          </div>

          {/* Avatar */}
          <div className="flex-1 flex items-center justify-center px-8">
            <div className="relative">
              <div className="w-56 h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10">
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt={name}
                  className="w-full h-full object-cover object-center"
                  style={{
                    filter: "contrast(1.1) brightness(1.1)",
                  }}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=300&width=300"
                  }}
                />
              </div>
              {/* Avatar Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl" />
            </div>
          </div>

          {/* Footer */}
          <div className="p-8">
            <div
              className="flex items-center justify-between p-5 rounded-2xl backdrop-blur-sm"
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(148, 163, 184, 0.15)",
              }}
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                  <img
                    src={avatarUrl || "/placeholder.svg"}
                    alt={name}
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=300&width=300"
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-base font-semibold">@{handle}</p>
                  {/* <p className="text-gray-400 text-sm truncate">vikashchaudhari103@gmail.com</p> */}
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
                    <p className="text-sm font-medium" style={{ color: statusColor }}>
                      {status}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onContactClick}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-shadow-lg flex-shrink-0 ml-4"
              >
                {contactText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard