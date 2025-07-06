"use client"

import { useState, useRef, useEffect } from "react"

// Simple Video Viewer Component with Infinite Loop - Fully Responsive
const VideoViewer = ({ showScreenshotButton = false }) => {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedData = () => {
      setIsLoading(false)
      // Auto-play the video when loaded
      video.play().catch((err) => {
        console.log("Autoplay failed:", err)
        setIsPlaying(false)
      })
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleError = () => {
      setError(true)
      setIsLoading(false)
    }

    // Ensure infinite loop
    const handleEnded = () => {
      video.currentTime = 0
      video.play().catch((err) => {
        console.log("Loop restart failed:", err)
      })
    }

    // Add event listeners
    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("error", handleError)
    video.addEventListener("ended", handleEnded)

    // Ensure video properties are set
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("error", handleError)
      video.removeEventListener("ended", handleEnded)
    }
  }, [])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().catch((err) => {
        console.log("Play failed:", err)
      })
    } else {
      video.pause()
    }
  }

  const takeScreenshot = () => {
    const video = videoRef.current
    if (!video) return

    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0)

    const link = document.createElement("a")
    link.download = "conference-room-screenshot.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  if (error) {
    return (
      <div className="w-full aspect-square max-w-lg mx-auto flex items-center justify-center bg-gradient-to-br from-purple-900/10 to-cyan-900/10 rounded-2xl border border-white/10">
        <div className="text-white text-center p-4">
          <p className="text-sm sm:text-base">Unable to load video</p>
          <p className="text-xs sm:text-sm opacity-70 mt-1">Please check your connection</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="w-full aspect-square max-w-lg mx-auto relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/5 to-cyan-900/5 border border-white/10 cursor-pointer shadow-2xl shadow-purple-500/20"
      onClick={togglePlayPause}
    >
      {/* Video Element with Infinite Loop */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-2xl"
        loop={true}
        muted={true}
        playsInline={true}
        autoPlay={true}
        preload="auto"
        webkit-playsinline="true"
      >
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Firefly%20i%20want%20a%20video%20of%20a%20coference%20room%20with%20people%20sitting%20and%20working%20together.%20i%20want%20video%20in-mLPWKZ7wA3WAgULmVNO5e4g2l2hUdl.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm rounded-2xl">
          <div className="text-white text-sm sm:text-base font-medium p-3 sm:p-4 bg-black/80 rounded-lg border border-white/10 flex items-center gap-2 sm:gap-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Loading Conference Video...</span>
          </div>
        </div>
      )}

      {/* Play/Pause Overlay - Only shows when paused */}
      {!isLoading && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-all duration-300 rounded-2xl">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/90 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 shadow-lg">
            <div className="w-0 h-0 border-l-[12px] sm:border-l-[16px] border-l-gray-800 border-t-[8px] sm:border-t-[10px] border-t-transparent border-b-[8px] sm:border-b-[10px] border-b-transparent ml-1" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex gap-2">
        {showScreenshotButton && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              takeScreenshot()
            }}
            className="bg-black/70 text-white border border-white/20 rounded px-2 sm:px-3 py-1 sm:py-2 cursor-pointer text-xs sm:text-sm backdrop-blur-sm hover:bg-black/80 transition-colors"
          >
            📸 Screenshot
          </button>
        )}

        <div className="bg-black/70 text-white rounded px-2 sm:px-3 py-1 text-xs backdrop-blur-sm border border-white/10">
          {/* Status indicator can be added here if needed */}
        </div>
      </div>
    </div>
  )
}

// Add CSS animation for loading spinner
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
}

const ModelViewer = ({
  url,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  environmentPreset = "sunset",
  enableControls = true,
  showScreenshotButton = false,
  ambientIntensity = 0.4,
  directionalIntensity = 1,
}) => {
  // Return the responsive VideoViewer
  return <VideoViewer showScreenshotButton={showScreenshotButton} />
}

export default ModelViewer
