"use client"

// AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react"

// Create the auth context
const AuthContext = createContext()

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext)
}

// Auth provider component
export const AuthProvider = ({ children }) => {
  // Use state to track the authenticated user
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Update the verifyUserAuthorization function to also check column H for permissions
  const verifyUserAuthorization = async (userId) => {
    try {
      // Initial client sheet details
      const initialSheetId = "1zEik6_I7KhRQOucBhk1FW_67IUEdcSfEHjCaR37aK_U"
      const initialSheetName = "Clients"

      // Fetch the Clients sheet data
      const url = `https://docs.google.com/spreadsheets/d/${initialSheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(initialSheetName)}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch client data: ${response.status}`)
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

      // Find the user's row and check column G value, column I for role, and column H for permissions
      for (const row of data.table.rows) {
        if (row.c && row.c[2] && row.c[2].v) {
          const username = row.c[2].v.toString().trim()

          // Check if this is our user
          if (username === userId) {
            // Get Sheet ID and Script URL from columns A and B
            const sheetId = row.c[0] && row.c[0].v !== undefined ? row.c[0].v.toString().trim() : ""
            const scriptUrl = row.c[1] && row.c[1].v !== undefined ? row.c[1].v.toString().trim() : ""
            
            // Check column G (index 6) value
            const authValue = row.c[6] && row.c[6].v !== undefined ? Number.parseFloat(row.c[6].v) : 0

            // Check column I (index 8) for role
            const roleValue = row.c[8] && row.c[8].v !== undefined ? row.c[8].v.toString().trim() : ""
            
            // Check column H (index 7) for permissions
            const permissionsValue = row.c[7] && row.c[7].v !== undefined ? row.c[7].v.toString().trim() : ""
            
            // Parse comma-separated permissions list
            const permissions = permissionsValue ? permissionsValue.split(',').map(p => p.trim().toLowerCase()) : []

            console.log(`User ${userId} found. Authorization value: ${authValue}, Role value: ${roleValue}, Permissions: ${permissions.join(', ')}`)
            console.log(`Found SheetId: ${sheetId}, ScriptUrl: ${scriptUrl}`)

            // Store the role value from column I in localStorage for later use
            if (roleValue) {
              localStorage.setItem("userColumnIValue", roleValue)
            }
            
            // Store the permissions from column H in localStorage
            if (permissions.length > 0) {
              localStorage.setItem("userPermissions", JSON.stringify(permissions))
            }
            
            // Store the sheet ID and script URL in localStorage
            if (sheetId) {
              localStorage.setItem("userSheetId", sheetId)
            }
            
            if (scriptUrl) {
              localStorage.setItem("userScriptUrl", scriptUrl)
            }

            // Return true if authorized (value > 0), false otherwise, along with additional data
            return { 
              isAuthorized: authValue > 0, 
              permissions,
              sheetId,
              scriptUrl
            }
          }
        }
      }

      // User not found in Clients sheet
      console.log(`User ${userId} not found in Clients sheet`)
      return { isAuthorized: false, permissions: [], sheetId: "", scriptUrl: "" }
    } catch (error) {
      console.error("Error verifying user authorization:", error)
      return { isAuthorized: false, permissions: [], sheetId: "", scriptUrl: "" } // Fail closed - if there's an error, don't authorize
    }
  }

  // Check for existing user in localStorage on initial load
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = localStorage.getItem("salonUser")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)

          // Verify the user's authorization before setting them as logged in
          const { isAuthorized, permissions, sheetId, scriptUrl } = await verifyUserAuthorization(userData.email)

          if (isAuthorized) {
            // User is authorized, proceed with login
            // Add permissions, sheetId, and scriptUrl to the user data
            userData.permissions = permissions
            
            // Update sheetId and scriptUrl if they were found
            if (sheetId) {
              userData.sheetId = sheetId
            }
            
            if (scriptUrl) {
              userData.appScriptUrl = scriptUrl
            }
            
            setUser(userData)
          } else {
            // User is not authorized, log them out
            console.log("User not authorized (column G value <= 0). Logging out...")
            logout()

            // Show alert about account not being active
            setTimeout(() => {
              alert("Your account is not active. Please contact administrator.")
              // Redirect to login page - assuming we're using react-router
              window.location.href = "/"
            }, 100)
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error)
          localStorage.removeItem("salonUser")
        }
      }

      setLoading(false)
    }

    loadUserData()
  }, [])

  // Update the login function to include permissions from column H and store sheetId and appScriptUrl
  const login = async (userData) => {
    console.log("Setting user in auth context:", userData)

    // Get the column I value from localStorage if it exists
    const columnIValue = localStorage.getItem("userColumnIValue")

    // Get permissions from localStorage if they exist
    const storedPermissions = localStorage.getItem("userPermissions")
    const permissions = storedPermissions ? JSON.parse(storedPermissions) : []

    // Get sheetId and scriptUrl from localStorage if they exist
    const storedSheetId = localStorage.getItem("userSheetId")
    const storedScriptUrl = localStorage.getItem("userScriptUrl")

    // If column I value is "admin", set role to admin
    if (columnIValue === "admin") {
      userData.role = "admin"
    }

    // Store the column I value and permissions in the user data
    userData.columnIValue = columnIValue || ""
    userData.permissions = permissions

    // Make sure sheetId and appScriptUrl are included in the userData
    // Priority: 1. userData's own values, 2. localStorage values, 3. leave as is
    if (!userData.sheetId && storedSheetId) {
      userData.sheetId = storedSheetId
    }

    if (!userData.appScriptUrl && storedScriptUrl) {
      userData.appScriptUrl = storedScriptUrl
    }

    console.log("Final user data with sheet info:", userData)
    console.log("Sheet ID:", userData.sheetId)
    console.log("App Script URL:", userData.appScriptUrl)

    setUser(userData)
    localStorage.setItem("salonUser", JSON.stringify(userData))
  }

  // Logout function - clears user from state and localStorage
  const logout = () => {
    setUser(null)
    localStorage.removeItem("salonUser")
    localStorage.removeItem("userColumnIValue")
    localStorage.removeItem("userPermissions")
    localStorage.removeItem("userSheetId")
    localStorage.removeItem("userScriptUrl")
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user
  }

  // Check if user has a specific role
  const hasRole = (role) => {
    return user && user.role === role
  }

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    return user && 
           user.permissions && 
           (user.permissions.includes(permission.toLowerCase()) || 
            user.permissions.includes('all')) // 'all' is a special permission that grants access to everything
  }

  // Check if user is an admin
  const isAdmin = () => {
    return user && user.role === "admin"
  }

  // Check if user is staff
  const isStaff = () => {
    return user && user.role === "staff"
  }

  // Get staff name
  const getStaffName = () => {
    return user && user.staffName ? user.staffName : ""
  }

  // Get current salon info
  // Get current salon info
  const getSalonInfo = () => {
    if (!user) return null

    return {
      salonId: user.email,
      salonName: user.name,
      sheetId: user.sheetId,
      appScriptUrl: user.appScriptUrl,
    }
  }

  // Value to be provided by the context
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    hasPermission,
    isAdmin,
    isStaff,
    getStaffName,
    getSalonInfo,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export default AuthContext