"use client"

import React, { useEffect, useRef } from "react";
import { Menu, LogOut, Globe, User } from "lucide-react"
import { useAuth } from '../Context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const translateBtnRef = useRef(null);
  
  // Function to handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    logout();
    navigate('/login');
  };

  const navigateToProfile = () => {
    navigate("/profile")
  }

  // Initialize Google Translate Element
  useEffect(() => {
    // Add Google Translate script to the document
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      // Initialize the translate element
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi', // Only include English and Hindi
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      };
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      addScript();
    }

    // Create a style to position the Google Translate element correctly
    const style = document.createElement('style');
    style.textContent = `
      #google_translate_element {
        position: fixed;
        top: -1000px;
        right: -1000px;
        height: 0;
        overflow: hidden;
      }
      
      .goog-te-banner-frame {
        display: none !important;
      }
      
      body {
        top: 0 !important;
      }
      
      /* Make sure the dropdown shows up in the right position */
      .goog-te-menu-frame {
        box-shadow: 0 0 8px rgba(0,0,0,0.2) !important;
        position: fixed !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      delete window.googleTranslateElementInit;
      const script = document.querySelector('script[src*="translate.google.com"]');
      if (script) {
        script.remove();
      }
      if (style) {
        style.remove();
      }
    };
  }, []);

  // Function to trigger Google Translate popup
  const handleTranslateClick = () => {
    // Try different methods to trigger the Google Translate dropdown
    
    // Method 1: Find and click the translate button
    const googleElement = document.getElementById('google_translate_element');
    
    if (googleElement) {
      // Try to find the clickable element in Google Translate widget
      const translateButton = googleElement.querySelector('.goog-te-gadget-simple') || 
                              googleElement.querySelector('.goog-te-menu-value') ||
                              googleElement.querySelector('.VIpgJd-ZVi9od-l4eHX-hSRGPd');
      
      if (translateButton) {
        // Click the element to show the dropdown
        translateButton.click();
        return;
      }
      
      // Method 2: If we can't find the button, try to programmatically position and show the dropdown
      // Get button position for dropdown placement
      const buttonRect = translateBtnRef.current.getBoundingClientRect();
      
      // Position the Google element near our button temporarily
      googleElement.style.position = 'absolute';
      googleElement.style.top = `${buttonRect.bottom + window.scrollY}px`;
      googleElement.style.right = `${window.innerWidth - buttonRect.right - window.scrollX}px`;
      googleElement.style.height = 'auto';
      googleElement.style.overflow = 'visible';
      googleElement.style.zIndex = '1000';
      
      // Force Google Translate to create its dropdown
      const select = googleElement.querySelector('select.goog-te-combo');
      if (select) {
        // Programmatically open the dropdown
        const event = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        select.dispatchEvent(event);
        
        // Reset position after a delay
        setTimeout(() => {
          googleElement.style.position = 'fixed';
          googleElement.style.top = '-1000px';
          googleElement.style.right = '-1000px';
          googleElement.style.height = '0';
          googleElement.style.overflow = 'hidden';
        }, 5000); // Hide it after 5 seconds
      }
    }
  };
  
  return (
    <>
      <header className="bg-white border-b border-blue-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center">
            <button
              className="p-2 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={20} />
            </button>
            <h1 className="ml-2 text-xl font-semibold text-blue-800 md:hidden">Salon Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Hidden Google Translate Element */}
            <div id="google_translate_element"></div>
            
            {/* Custom Translate Button */}
            <button
              ref={translateBtnRef}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              onClick={handleTranslateClick}
            >
              <Globe size={16} />
              <span className="text-sm">Language</span>
            </button>
            
            <button
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              onClick={navigateToProfile}
            >
              <User size={16} />
              <span className="text-sm">Profile</span>
            </button>

            {/* Logout Button */}
            <button
              className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-white bg-red-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span className="text-sm">Logout</span>
            </button>
            {/* <img
              src="https://t4.ftcdn.net/jpg/02/88/65/87/240_F_288658769_P0XwssJydQP9EJRBfL6K1HwyNZ5ttw09.jpg"
              alt="Salon Logo"
              className="h-10 hidden sm:block"
            /> */}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;