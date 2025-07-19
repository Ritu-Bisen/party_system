"use client"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Smartphone, Globe, ShoppingCart, Palette, ArrowRight, X, ExternalLink, Star, Users, Zap } from "lucide-react"
import Checklist from "../components/images/checklist.png"
import LeadToOrder from "../components/images/leadtoorder.png"
import StoreApp from "../components/images/storeapp.png"
import SalonApp from "../components/images/salon.png"
import Otp from "../components/images/otp.png"
import ComplaintTracker from "../components/images/complaint.png"

const products = [
  {
    icon: Smartphone,
    title: "Checklist And Delegation",
    description:
      "Custom mobile applications for iOS and Android with cutting-edge features and seamless user experience.",
    color: "from-purple-500 to-pink-500",
    // image: Checklist,
    features: ["iOS & Android", "Cross-platform", "Native Performance", "App Store Ready"],
    price: "Starting from $5,000",
    rating: 4.9,
    clients: "50+",
  },
  {
    icon: Globe,
    title: "Lead To Order System",
    description: "Responsive web applications and platforms built with modern technologies for optimal performance.",
    color: "from-blue-500 to-cyan-500",
    image: LeadToOrder,
    features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Modern Tech Stack"],
    price: "Starting from $3,000",
    rating: 4.8,
    clients: "100+",
  },
  {
    icon: ShoppingCart,
    title: "Store App",
    description: "Complete online store solutions with payment integration and comprehensive inventory management.",
    color: "from-green-500 to-emerald-500",
    image: StoreApp,
    features: ["Payment Gateway", "Inventory Management", "Order Tracking", "Analytics Dashboard"],
    price: "Starting from $4,000",
    rating: 4.9,
    clients: "75+",
  },
  {
    icon: Palette,
    title: "Salon Web",
    description: "Comprehensive design systems and UI/UX solutions for consistent branding across all platforms.",
    color: "from-orange-500 to-red-500",
    image: SalonApp,
    features: ["Component Library", "Brand Guidelines", "Design Tokens", "Documentation"],
    price: "Starting from $2,500",
    rating: 4.7,
    clients: "60+",
  },
  {
    icon: Zap,
    title: "Otp",
    description: "Scalable Software-as-a-Service platforms with subscription management and multi-tenant architecture.",
    color: "from-indigo-500 to-purple-500",
    image: Otp,
    features: ["Multi-tenant", "Subscription Billing", "API Integration", "Cloud Hosting"],
    price: "Starting from $8,000",
    rating: 4.8,
    clients: "30+",
  },
  {
    icon: Users,
    title: "Complaint Tracker",
    description: "Customer relationship management systems to streamline your sales and customer service processes.",
    color: "from-teal-500 to-blue-500",
    image: ComplaintTracker,
    features: ["Lead Management", "Sales Pipeline", "Customer Analytics", "Integration Ready"],
    price: "Starting from $6,000",
    rating: 4.6,
    clients: "40+",
  },
]

// Optimized Product Card Component
const ProductCard = ({ product, index, isPartiallyHidden = false, onClick }) => {
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        delay: index * 0.05, // Reduced stagger delay
      },
    },
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      className={`group cursor-pointer ${isPartiallyHidden ? "opacity-60 hover:opacity-80" : ""}`}
      style={{ willChange: "transform" }}
      onClick={() => onClick(product)}
    >
      <div className="bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 group h-full rounded-2xl overflow-hidden relative">
        
        {/* Simplified background effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(135deg, ${product.color.split(" ")[1]}/5, ${product.color.split(" ")[3]}/5)`,
          }}
        />

        {/* Product Image */}
        <div className="relative h-10 overflow-hidden">
          {/* <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ willChange: "transform" }}
          /> */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Rating Badge */}
          <div className="absolute top-4 right-4 bg-black/60 rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">{product.rating}</span>
          </div>
        </div>

        <div className="p-6 relative">
          {/* Icon and Title */}
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-r ${product.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
              style={{ willChange: "transform" }}
            >
              <product.icon className="text-white" size={24} />
            </div>

            <div>
              <h3 className="text-white text-xl font-semibold">{product.title}</h3>
              <p className="text-gray-400 text-sm">{product.clients} clients</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 leading-relaxed mb-4 text-sm">{product.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.features.slice(0, 2).map((feature, idx) => (
              <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">{product.price}</span>
            <div className="text-gray-400 group-hover:text-white transition-colors duration-200">
              <ExternalLink size={16} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Optimized Product Detail Modal
const ProductDetailModal = ({ product, isOpen, onClose }) => {
  if (!product) return null

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { 
        duration: 0.2,
        ease: "easeIn" 
      },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-[200]"
            onClick={onClose}
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gray-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="relative">
                {/* <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-64 object-cover"
                /> */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 hover:bg-black/20 rounded-lg"
                >
                  <X size={20} />
                </button>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${product.color} flex items-center justify-center`}>
                      <product.icon className="text-white" size={32} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{product.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-medium">{product.rating}</span>
                        </div>
                        <span className="text-gray-300">{product.clients} clients</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 leading-relaxed mb-6 text-lg">{product.description}</p>

                {/* Features Grid */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Key Features</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div>
                    <p className="text-gray-400 text-sm">Starting from</p>
                    <p className="text-2xl font-bold text-white">{product.price}</p>
                  </div>
                  <button
                    className={`bg-gradient-to-r ${product.color} text-white py-3 px-8 rounded-lg font-semibold hover:scale-105 transition-transform duration-200`}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Optimized Main Products Component
export default function Products({ onViewAllProducts }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const handleCardClick = useCallback((product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProduct(null), 200)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05, // Reduced stagger
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <>
      <section ref={ref} className="py-20 px-4 relative overflow-hidden">
        {/* Simplified animated background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/3 to-cyan-600/3 rounded-full blur-3xl" />

        <div className="container mx-auto relative z-10">
          {/* Title Section */}
          <motion.div
            variants={titleVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Innovative digital products designed to transform your business and accelerate growth
            </p>
          </motion.div>

          {/* First Row - Fully Visible */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {products.slice(0, 4).map((product, index) => (
              <ProductCard key={product.title} product={product} index={index} onClick={handleCardClick} />
            ))}
          </motion.div>

          {/* Second Row - Partially Hidden */}
          <div className="relative mb-12 overflow-hidden">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              style={{
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)",
              }}
            >
              {products.slice(4).map((product, index) => (
                <ProductCard
                  key={product.title}
                  product={product}
                  index={index + 4}
                  isPartiallyHidden={true}
                  onClick={handleCardClick}
                />
              ))}
            </motion.div>

            {/* Fade overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>

          {/* More Button */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={onViewAllProducts}
              className="group relative px-12 py-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/20 rounded-full text-white font-semibold transition-all duration-300 hover:from-purple-500/30 hover:to-cyan-500/30 hover:border-white/30 hover:scale-105"
            >
              <span className="flex items-center space-x-3">
                <span className="text-lg">View All Products</span>
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full group-hover:translate-x-1 transition-transform duration-200">
                  <ArrowRight size={16} className="text-white" />
                </div>
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      <ProductDetailModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}

// Export products data for use in other components
export { products }
