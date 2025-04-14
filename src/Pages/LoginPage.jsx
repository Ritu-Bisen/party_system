"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, User, Lock, AlertCircle, X, Scissors, Calendar, ChevronRight } from "lucide-react"
import { useAuth } from "../Context/AuthContext.jsx"

const LoginPage = () => {
  const navigate = useNavigate()
  const { login, logout, isAuthenticated, user } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  // State for password change alert
  const [showPasswordChangeAlert, setShowPasswordChangeAlert] = useState(false)
  // State to hold matched client data
  const [matchedClient, setMatchedClient] = useState(null)

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      // Always navigate to admin-dashboard
      // The Dashboard component will handle showing the appropriate content based on role
      navigate("/admin-dashboard")
    }
  }, [isAuthenticated, navigate])

  // Initial client sheet details
  const initialSheetId = "1zEik6_I7KhRQOucBhk1FW_67IUEdcSfEHjCaR37aK_U"
  const initialSheetName = "Clients"
  const initialScriptUrl =
    "https://script.google.com/macros/s/AKfycbz6-tMsYOC4lbu4XueMyMLccUryF9HkY7HZLC22FB9QeB5NxqCcxedWKS8drwgVwlM/exec"

  // Update the handleSubmit function to check column H for permissions
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate input
      if (!email || !password) {
        setError("Please enter both email and password")
        setIsLoading(false)
        return
      }

      // Directly check the Clients sheet for username/password in columns C and D
      console.log("Checking credentials in Clients sheet...")

      // Fetch the Clients sheet data
      const url = `https://docs.google.com/spreadsheets/d/${initialSheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(initialSheetName)}`

      console.log(`Fetching from: ${url}`)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`)
      }

      // Extract the JSON part from the response
      const text = await response.text()
      const jsonStart = text.indexOf("{")
      const jsonEnd = text.lastIndexOf("}")
      const jsonString = text.substring(jsonStart, jsonEnd + 1)
      const data = JSON.parse(jsonString)

      // Process the client data
      if (!data.table || !data.table.rows) {
        throw new Error("Invalid client data format")
      }

      // Extract client data with credentials from the sheet
      // Column A (index 0) is sheet ID
      // Column B (index 1) is script URL
      // Column C (index 2) is username
      // Column D (index 3) is password
      // Column G (index 6) is now checked for a value > 0
      // Column H (index 7) is checked for permissions
      // Column I (index 8) is checked for role value
      const clientData = data.table.rows
        .filter((row) => row.c && row.c[0] && row.c[1] && row.c[2] && row.c[3])
        .map((row) => ({
          sheetId: row.c[0].v.toString().trim(),
          scriptUrl: row.c[1].v.toString().trim(),
          username: row.c[2].v.toString().trim(),
          password: row.c[3].v.toString().trim(),
          // Optionally extract role from column E (index 4) if it exists
          role: row.c[4] && row.c[4].v ? row.c[4].v.toString().trim() : null,
          // Get the value from column G (index 6) - for authorization check
          authValue: row.c[6] && row.c[6].v !== undefined ? Number.parseFloat(row.c[6].v) : 0,
          // Get the value from column H (index 7) - for permissions
          permissionsValue: row.c[7] && row.c[7].v ? row.c[7].v.toString().trim() : "",
          // Get the value from column I (index 8) - for role/filtering
          columnIValue: row.c[8] && row.c[8].v ? row.c[8].v.toString().trim() : "",
        }))

      console.log(`Found ${clientData.length} client records`)

      // Check if credentials match
      const clientMatch = clientData.find((client) => client.username === email && client.password === password)

      if (clientMatch) {
        console.log("Found matching credentials:", clientMatch)

        // Check if the value in column G is greater than 0 for authorization
        if (clientMatch.authValue > 0) {
          console.log("Login authorized! Column G value:", clientMatch.authValue)
          console.log("Column I value:", clientMatch.columnIValue)
          console.log("Permissions (Column H):", clientMatch.permissionsValue)
          setMatchedClient(clientMatch)

          // Determine role based on column I value
          let userRole = "staff" // Default role
          if (clientMatch.columnIValue === "admin") {
            userRole = "admin"
          }

          // Parse permissions from column H
          const permissions = clientMatch.permissionsValue 
            ? clientMatch.permissionsValue.split(',').map(p => p.trim().toLowerCase())
            : []

          // Store permissions in localStorage
          localStorage.setItem("userPermissions", JSON.stringify(permissions))

          // Continue with normal login flow using the matched client's sheet ID and script URL
          proceedWithLogin(
            {
              id: clientMatch.username,
              role: userRole,
              columnIValue: clientMatch.columnIValue,
              permissions: permissions
            },
            clientMatch.sheetId,
            clientMatch.scriptUrl,
          )
        } else {
          // Credentials match but not authorized (column G value <= 0)
          console.log("Login failed: User account not authorized (Column G value <= 0)")

          // Log the user in first so we can immediately log them out
          // This creates a better user experience than simply showing an error
          const tempUserData = {
            email: clientMatch.username,
            name: clientMatch.username.split("@")[0],
            role: clientMatch.role || "staff",
            staffName: clientMatch.username.split("@")[0],
          }

          // Log in temporarily
          login(tempUserData, clientMatch.sheetId, clientMatch.scriptUrl)

          // Set a timeout to automatically log out and show the error message
          setTimeout(() => {
            // Import the logout function if necessary
            //Import at the top of the file: const { login, logout, isAuthenticated, user } = useAuth()

            // Navigate to admin dashboard first (this will show briefly)
            navigate("/admin-dashboard")

            // Then show error and log out after a short delay
            setTimeout(() => {
              alert("Your account is not active. Please contact administrator.")
              // Log the user out - this should be added to the useAuth export
              logout()
              // Redirect back to login page
              navigate("/")
            }, 500)
          }, 100)

          setIsLoading(false)
        }
      } else {
        // No matching credentials found
        console.log("Login failed: Invalid credentials")
        setError("Invalid email or password")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Login failed. Please try again later.")
      setIsLoading(false)
    }
  }

  // Update the proceedWithLogin function to include permissions
  const proceedWithLogin = (userMatch, sheetId, scriptUrl) => {
    setShowPasswordChangeAlert(false)

    // Determine the role - If column I value is "admin" or has explicit role in spreadsheet
    let userRole = "staff" // Default role

    // Check if user is admin by column I value
    if (userMatch?.columnIValue === "admin") {
      userRole = "admin"
    }
    // Or check if role is specified in the spreadsheet
    else if (userMatch?.role === "admin") {
      userRole = "admin"
    }

    // Get the user ID (email or username)
    const userId = userMatch?.id || email

    // Extract name part if it's an email
    const userName = userId.split("@")[0]

    // Create user object with ALL required properties
    // IMPORTANT: Explicitly set staffName to match what's in the booking sheet
    const userData = {
      email: userId,
      name: userName,
      role: userRole,
      staffName: userName, // This is the critical line - setting staffName explicitly
      columnIValue: userMatch?.columnIValue || "", // Store the column I value for filtering
      permissions: userMatch?.permissions || [], // Store the permissions from column H
    }

    // Add debug output
    console.log("User data being passed to login:", userData)
    console.log("Using Sheet ID:", sheetId)
    console.log("Using Script URL:", scriptUrl)
    console.log("User permissions:", userData.permissions)

    // Log the user in with sheet data
    login(userData, sheetId, scriptUrl)

    // Navigate to the appropriate dashboard with a small delay
    setTimeout(() => {
      navigate("/admin-dashboard", { replace: true })
    }, 100)

    setIsLoading(false)
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      },
    },
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 opacity-20 blur-3xl"></div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="flex w-full max-w-5xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Left side - Image and branding */}
        <motion.div
          variants={fadeIn}
          className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex-col justify-between relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-4 border-white/30"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full border-4 border-white/20"></div>
            <div className="absolute top-3/4 left-1/3 w-24 h-24 rounded-full border-4 border-white/10"></div>
          </div>

          <div className="p-8 z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center space-x-2"
            >
              <Scissors className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Salon Pro</h1>
            </motion.div>
          </div>

          <motion.div variants={floatingAnimation} initial="initial" animate="animate" className="relative z-10 p-8">
            <h2 className="text-2xl font-bold mb-5">Professional Salon Management</h2>
            <p className="text-white/80 mb-6">
              Streamline your salon operations with our comprehensive management solution.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Calendar className="h-5 w-5" />
                </div>
                <p>Appointment scheduling</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <User className="h-5 w-5" />
                </div>
                <p>Client management</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Scissors className="h-5 w-5" />
                </div>
                <p>Service tracking</p>
              </div>
            </div>
          </motion.div>

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-900/50 to-transparent"></div>
        </motion.div>

        {/* Right side - Login form */}
        <motion.div variants={fadeIn} className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your salon dashboard</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start"
                >
                  <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={fadeIn} className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email or ID
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-indigo-500" />
                  </div>
                  <input
                    id="email"
                    type="text"
                    placeholder="Enter your ID or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white/80 disabled:opacity-50 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                </div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-indigo-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 bg-white/80 disabled:opacity-50 transition-all duration-200"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                variants={fadeIn}
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Password Change Alert Modal */}
      <AnimatePresence>
        {showPasswordChangeAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 m-4"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <AlertCircle size={20} className="text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Password Change Required</h3>
                </div>
                <button
                  onClick={() => setShowPasswordChangeAlert(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-gray-600">
                  Your password needs to be changed for security purposes. You'll be redirected to the dashboard now,
                  but please change your password soon.
                </p>
              </div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Use the matchedClient data that was stored when we found a match
                    if (matchedClient) {
                      proceedWithLogin(
                        { 
                          id: matchedClient.username, 
                          role: matchedClient.role,
                          permissions: matchedClient.permissionsValue 
                            ? matchedClient.permissionsValue.split(',').map(p => p.trim().toLowerCase())
                            : []
                        },
                        matchedClient.sheetId,
                        matchedClient.scriptUrl,
                      )
                    } else {
                      // Fallback if somehow matchedClient is not available
                      setShowPasswordChangeAlert(false)
                      setIsLoading(false)
                    }
                  }}
                  className="inline-flex justify-center px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  Continue to Dashboard
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LoginPage