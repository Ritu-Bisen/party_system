import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./Context/AuthContext.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ProtectedRoute from "./Routes/ProtectedRoute.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import Booking from "./components/Booking.jsx"; // Import individual components
import DailyEntry from "./DailyEntry.jsx";
import "./index.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnimatePresence>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin-dashboard/*" element={<Dashboard />} />
              <Route path="/booking" element={<Booking hideHistoryButton={false} />} />
              <Route path="/daily-entry" element={<DailyEntry hideHistoryButton={false} />} />
              {/* Add other routes for different sections */}
            </Route>
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </Router>
  );
}

export default App;