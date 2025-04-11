// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  // Use state to track the authenticated user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to verify user authorization from Clients sheet
  const verifyUserAuthorization = async (userId) => {
    try {
      // Initial client sheet details
      const initialSheetId = "1zEik6_I7KhRQOucBhk1FW_67IUEdcSfEHjCaR37aK_U";
      const initialSheetName = "Clients";
      
      // Fetch the Clients sheet data
      const url = `https://docs.google.com/spreadsheets/d/${initialSheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(initialSheetName)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch client data: ${response.status}`);
      }

      // Extract the JSON part from the response
      const text = await response.text();
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      const jsonString = text.substring(jsonStart, jsonEnd + 1);
      const data = JSON.parse(jsonString);

      // Process the client data
      if (!data.table || !data.table.rows) {
        throw new Error("Invalid client data format");
      }

      // Find the user's row and check column G value
      for (const row of data.table.rows) {
        if (row.c && row.c[2] && row.c[2].v) {
          const username = row.c[2].v.toString().trim();
          
          // Check if this is our user
          if (username === userId) {
            // Check column G (index 6) value
            const authValue = row.c[6] && row.c[6].v !== undefined ? parseFloat(row.c[6].v) : 0;
            console.log(`User ${userId} found. Authorization value: ${authValue}`);
            
            // Return true if authorized (value > 0), false otherwise
            return authValue > 0;
          }
        }
      }
      
      // User not found in Clients sheet
      console.log(`User ${userId} not found in Clients sheet`);
      return false;
    } catch (error) {
      console.error("Error verifying user authorization:", error);
      return false; // Fail closed - if there's an error, don't authorize
    }
  };

  // Check for existing user in localStorage on initial load
  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = localStorage.getItem('salonUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Verify the user's authorization before setting them as logged in
          const isAuthorized = await verifyUserAuthorization(userData.email);
          
          if (isAuthorized) {
            // User is authorized, proceed with login
            setUser(userData);
          } else {
            // User is not authorized, log them out
            console.log("User not authorized (column G value <= 0). Logging out...");
            logout();
            
            // Show alert about account not being active
            setTimeout(() => {
              alert("Your account is not active. Please contact administrator.");
              // Redirect to login page - assuming we're using react-router
              window.location.href = "/";
            }, 100);
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem('salonUser');
        }
      }
      
      setLoading(false);
    };
    
    loadUserData();
  }, []);

  // Login function - saves user to state and localStorage
  const login = (userData) => {
    console.log("Setting user in auth context:", userData);
    setUser(userData);
    localStorage.setItem('salonUser', JSON.stringify(userData));
  };

  // Logout function - clears user from state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('salonUser');
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is an admin
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  // Check if user is staff
  const isStaff = () => {
    return user && user.role === "staff";
  };

  // Get staff name
  const getStaffName = () => {
    return user && user.staffName ? user.staffName : "";
  };

  // Get current salon info
  const getSalonInfo = () => {
    if (!user) return null;
    
    return {
      salonId: user.salonId,
      salonName: user.salonName,
      sheetId: user.sheetId,
      appScriptUrl: user.appScriptUrl
    };
  };

  // Value to be provided by the context
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    isAdmin,
    isStaff,
    getStaffName,
    getSalonInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;