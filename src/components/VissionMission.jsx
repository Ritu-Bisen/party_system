"use client"
import { ChevronRight, Target, Rocket, Quote } from "lucide-react"
export default function VisionMission({ onTransformBusinessClick }) {
  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Purpose</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Driving the future of business automation with intelligent systems and unwavering commitment
          </p>
        </div>
        {/* Content Cards */}
        <div className="grid grid-cols-1 gap-8">
          {" "}
          {/* Changed from lg:grid-cols-3 to grid-cols-1 */}
          {/* Vision */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-gray-700/50 shadow-2xl">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  🌟 Our Vision
                </h3>
                <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                  "To become the world's{" "}
                  <span className="text-blue-400 font-semibold">#1 force in business automation</span>—empowering
                  companies of every size to operate smarter, faster, and effortlessly through intelligent systems and
                  AI."
                </p>
              </div>
            </div>
          </div>
          {/* Mission */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-gray-700/50 shadow-2xl">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  🚀 Our Mission
                </h3>
                <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                  "To solve real-world business problems with technology that actually works—delivering{" "}
                  <span className="text-purple-400 font-semibold">lightning-fast systems</span> accessible from
                  anywhere, and becoming the one-stop tech partner for system-driven growth."
                </p>
              </div>
            </div>
          </div>
          {/* CEO Message */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 sm:p-12 border border-gray-700/50 shadow-2xl">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <Quote className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  💬 Message from the CEO
                </h3>
                <blockquote className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-6 italic">
                  "At Botivate, we're not just selling software—we're building systems that solve genuine, on-ground
                  business problems. Every system we design is{" "}
                  <span className="text-green-400 font-semibold">lightning-fast, intuitive, and customized</span>,
                  ensuring business owners truly enjoy the journey towards automation and growth."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">ST</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Satyendra Tandan</p>
                    <p className="text-gray-400">CEO, Botivate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer group">
            <button onClick={onTransformBusinessClick}>Ready to Transform Your Business?</button>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  )
}
