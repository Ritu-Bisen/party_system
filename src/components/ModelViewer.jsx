"use client"

import { Suspense, useRef, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, useProgress, Html, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

const Loader = () => {
  const { progress, active } = useProgress()

  return (
    <Html center>
      <div
        style={{
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          textAlign: "center",
          padding: "12px 20px",
          background: "rgba(0,0,0,0.7)",
          borderRadius: "8px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {active ? `Loading ${Math.round(progress)}%` : "Ready"}
      </div>
    </Html>
  )
}

function Model({ url, autoRotate = false, autoRotateSpeed = 0.5 }) {
  const { scene } = useGLTF(url)
  const modelRef = useRef()

  const clonedScene = useMemo(() => {
    const clone = scene.clone()

    // Center and scale the model optimally
    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 4.5 / maxDim // Slightly larger scale

    clone.position.sub(center)
    clone.scale.setScalar(scale)

    // Optimize materials for performance
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          // Optimize material for better performance
          child.material.needsUpdate = true
          if (child.material.map) {
            child.material.map.generateMipmaps = false
          }
        }
      }
    })

    return clone
  }, [scene])

  useFrame((state, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += autoRotateSpeed * delta
    }
  })

  return <primitive ref={modelRef} object={clonedScene} />
}

const ModelViewer = ({
  url,
  width = 400,
  height = 400,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  environmentPreset = "sunset",
  enableControls = true,
  showScreenshotButton = false,
  ambientIntensity = 0.4,
  directionalIntensity = 1,
}) => {
  const canvasRef = useRef()

  useEffect(() => {
    // Preload the model
    useGLTF.preload(url)
  }, [url])

  const takeScreenshot = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current.querySelector("canvas")
      if (canvas) {
        const link = document.createElement("a")
        link.download = "model-screenshot.png"
        link.href = canvas.toDataURL()
        link.click()
      }
    }
  }

  return (
    <div
      ref={canvasRef}
      style={{
        width,
        height,
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      {showScreenshotButton && (
        <button
          onClick={takeScreenshot}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 10,
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px",
            backdropFilter: "blur(10px)",
          }}
        >
          📸 Screenshot
        </button>
      )}

      <Canvas
        shadows
        camera={{
          fov: 35,
          position: [6, 4, 8], // Fixed optimal position
          near: 0.1,
          far: 1000,
        }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance", // Performance optimization
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        performance={{ min: 0.8 }} // Performance optimization
      >
        {/* Optimized Lighting */}
        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={directionalIntensity}
          castShadow
          shadow-mapSize-width={1024} // Reduced for performance
          shadow-mapSize-height={1024}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-10, 5, 5]} intensity={0.2} />

        {/* Environment with reduced quality for performance */}
        {environmentPreset && <Environment preset={environmentPreset} background={false} blur={0.6} />}

        {/* Optimized Ground shadow */}
        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.3}
          scale={8}
          blur={1.5}
          far={3}
          resolution={256} // Reduced for performance
        />

        {/* Model */}
        <Suspense fallback={<Loader />}>
          <Model url={url} autoRotate={autoRotate} autoRotateSpeed={autoRotateSpeed} />
        </Suspense>

        {/* Optimized Controls - NO ZOOM */}
        {enableControls && (
          <OrbitControls
            enablePan={false}
            enableZoom={false} // DISABLED ZOOM
            enableRotate={true}
            minDistance={8} // Fixed distance
            maxDistance={8} // Fixed distance
            autoRotate={false}
            autoRotateSpeed={0}
            dampingFactor={0.05}
            enableDamping={true}
            target={[0, 0, 0]}
            minPolarAngle={Math.PI / 3} // Limit vertical rotation
            maxPolarAngle={Math.PI / 1.5}
          />
        )}
      </Canvas>
    </div>
  )
}

export default ModelViewer
