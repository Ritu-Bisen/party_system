"use client"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Filter,
  Search,
  Grid3X3,
  List,
  Star,
  ExternalLink,
  X,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle,
  Award,
  Users,
  Clock,
} from "lucide-react"
import { products } from "./products"

// Optimized Enhanced Product Card
const EnhancedProductCard = ({ product, index, viewMode = "grid", onClick }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        delay: index * 0.03, // Reduced delay
      },
    },
  }

  if (viewMode === "list") {
    return (
      <motion.div
        variants={cardVariants}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="group cursor-pointer"
        onClick={() => onClick(product)}
        style={{ willChange: "transform" }}
      >
        <div className="bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 rounded-2xl p-6 flex items-center space-x-6 relative overflow-hidden">
          {/* Simplified background effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${product.color.split(" ")[1]}/5, ${product.color.split(" ")[3]}/5)`,
            }}
          />

          {/* Product Image */}
          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
            {/* <img
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ willChange: "transform" }}
            /> */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="flex-1 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{product.title}</h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm">{product.rating}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{product.clients} clients</span>
                  <span className="text-white font-semibold">{product.price}</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${product.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
              >
                <product.icon className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
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
        <div className="relative overflow-hidden">
          {/* <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ willChange: "transform" }}
          /> */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Badges */}
          <div className="absolute top-4 right-4 bg-black/60 rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">{product.rating}</span>
          </div>

          <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500/80 to-cyan-500/80 rounded-full px-3 py-1">
            <span className="text-white text-xs font-medium">Featured</span>
          </div>
        </div>

        <div className="p-6 relative z-10">
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
          <p className="text-gray-300 leading-relaxed mb-4 text-sm line-clamp-3">{product.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.features.slice(0, 3).map((feature, idx) => (
              <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                {feature}
              </span>
            ))}
          </div>

          {/* Price and Action */}
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
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
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
            <div className="bg-gray-900/95 border border-white/20 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 hover:bg-black/20 rounded-lg"
                >
                  <X size={20} />
                </button>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-r ${product.color} flex items-center justify-center`}
                    >
                      <product.icon className="text-white" size={32} />
                    </div>
                    <div>
                      <h3 className="text-4xl font-bold text-white">{product.title}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-white font-medium text-lg">{product.rating}</span>
                        </div>
                        <span className="text-gray-300">{product.clients} clients</span>
                        <span className="text-2xl font-bold text-white">{product.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-4">About This Product</h4>
                    <p className="text-gray-300 leading-relaxed mb-6 text-lg">{product.description}</p>

                    <h4 className="text-xl font-semibold text-white mb-4">Key Features</h4>
                    <div className="space-y-3 mb-6">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                      <h4 className="text-xl font-semibold text-white mb-4">Project Stats</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-2">
                            <Users className="text-white" size={20} />
                          </div>
                          <p className="text-2xl font-bold text-white">{product.clients}</p>
                          <p className="text-gray-400 text-sm">Happy Clients</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mx-auto mb-2">
                            <Award className="text-white" size={20} />
                          </div>
                          <p className="text-2xl font-bold text-white">{product.rating}</p>
                          <p className="text-gray-400 text-sm">Rating</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mx-auto mb-2">
                            <Clock className="text-white" size={20} />
                          </div>
                          <p className="text-2xl font-bold text-white">2-4</p>
                          <p className="text-gray-400 text-sm">Weeks</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mx-auto mb-2">
                            <CheckCircle className="text-white" size={20} />
                          </div>
                          <p className="text-2xl font-bold text-white">100%</p>
                          <p className="text-gray-400 text-sm">Success Rate</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Options */}
                    <div className="space-y-3">
                      <button
                        className={`w-full bg-gradient-to-r ${product.color} text-white py-4 px-6 rounded-lg font-semibold hover:scale-105 transition-transform duration-200 flex items-center justify-center space-x-2`}
                      >
                        <MessageCircle size={20} />
                        <span>Start Project</span>
                      </button>

                      <div className="grid grid-cols-2 gap-3">
                        <button className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                          <Phone size={16} />
                          <span>Call</span>
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2">
                          <Mail size={16} />
                          <span>Email</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Optimized Main Products Page Component
export default function ProductsPage({ onBackToHome }) {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  const handleCardClick = useCallback((product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProduct(null), 200)
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === "all" || product.title.toLowerCase().includes(filter.toLowerCase())
    return matchesSearch && matchesFilter
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.03, // Reduced stagger
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/80 border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>

            <h1 className="text-3xl font-bold text-white">Our Products</h1>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                {viewMode === "grid" ? (
                  <List size={20} className="text-white" />
                ) : (
                  <Grid3X3 size={20} className="text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Products</option>
                <option value="mobile">Mobile Apps</option>
                <option value="web">Web Platforms</option>
                <option value="ecommerce">E-commerce</option>
                <option value="design">Design Systems</option>
                <option value="saas">SaaS Platforms</option>
                <option value="crm">CRM Solutions</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Simplified background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/3 to-cyan-600/3 rounded-full blur-3xl" />

        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Complete{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Product Portfolio
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our comprehensive range of digital products designed to accelerate your business transformation
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { label: "Products", value: "6+", icon: Grid3X3 },
              { label: "Happy Clients", value: "200+", icon: Users },
              { label: "Success Rate", value: "100%", icon: Award },
              { label: "Avg Rating", value: "4.8", icon: Star },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg mx-auto mb-3">
                  <stat.icon className="text-white" size={20} />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
          >
            {filteredProducts.map((product, index) => (
              <EnhancedProductCard
                key={product.title}
                product={product}
                index={index}
                viewMode={viewMode}
                onClick={handleCardClick}
              />
            ))}
          </motion.div>

          {filteredProducts.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
              <p className="text-gray-400 text-lg">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      <ProductDetailModal product={selectedProduct} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}
