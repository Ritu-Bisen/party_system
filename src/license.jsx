"use client"

import { useState } from "react"
import { AlertCircle, Calendar, CheckCircle, Clock, KeyRound, Mail, Phone, RefreshCw, Shield, X } from "lucide-react"

const License = () => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [isRenewDialogOpen, setIsRenewDialogOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })

  // Mock license data - in a real app, this would come from an API
  const licenseData = {
    status: "active", // active, expiring, expired
    type: "Professional",
    key: "XXXX-XXXX-XXXX-XXXX",
    expiryDate: "2025-12-31",
    daysRemaining: 90,
    maxUsers: 10,
    currentUsers: 6,
    features: [
      "Booking Management",
      "Staff Management",
      "Inventory Control",
      "Customer Database",
      "Payment Processing",
      "Reporting & Analytics",
    ],
    supportContact: {
      email: "support@example.com",
      phone: "+1 (555) 123-4567",
    },
  }

  // Calculate days until expiry
  const expiryDate = new Date(licenseData.expiryDate)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24))

  // Determine license status color
  const getStatusColor = () => {
    if (licenseData.status === "expired") return "text-red-600 bg-red-50"
    if (licenseData.status === "expiring" || daysUntilExpiry < 30) return "text-amber-600 bg-amber-50"
    return "text-green-600 bg-green-50"
  }

  // Handle contact form submission
  const handleContactSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    console.log("Contact form submitted:", contactForm)
    setIsContactDialogOpen(false)
    // Reset form
    setContactForm({ name: "", email: "", message: "" })
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-700">License Management</h1>
          <p className="text-gray-500">View and manage your software license details</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsContactDialogOpen(true)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Phone className="mr-2 h-4 w-4" />
            Contact Support
          </button>
          <button
            onClick={() => setIsRenewDialogOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Renew License
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* License Status Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">License Status</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor()}`}>
              {licenseData.status}
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-4">Your current license information</p>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500">License Type</p>
              <p>{licenseData.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">License Key</p>
              <p>{licenseData.key}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Expiry Date</p>
              <p className="flex items-center">
                <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                {licenseData.expiryDate}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Days Remaining</p>
              <p className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-gray-500" />
                {daysUntilExpiry} days
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <p className="text-sm font-medium text-gray-500">Time until expiration</p>
              <p className="text-sm">{Math.round((daysUntilExpiry / 365) * 100)}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${Math.min(100, Math.round((daysUntilExpiry / 365) * 100))}%` }}
              ></div>
            </div>
          </div>

          {daysUntilExpiry < 30 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">License Expiring Soon</p>
                <p className="text-sm">
                  Your license will expire in {daysUntilExpiry} days. Please renew to avoid service interruption.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsRenewDialogOpen(true)}
            className="w-full mt-4 flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Renew License
          </button>
        </div>

        {/* License Details Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-1">License Details</h2>
          <p className="text-gray-500 text-sm mb-4">Features and limitations of your current plan</p>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 mb-2">User Allocation</p>
            <div className="flex justify-between mb-1">
              <p className="text-sm">
                Users: {licenseData.currentUsers} / {licenseData.maxUsers}
              </p>
              <p className="text-sm">{Math.round((licenseData.currentUsers / licenseData.maxUsers) * 100)}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${Math.round((licenseData.currentUsers / licenseData.maxUsers) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 mb-2">Included Features</p>
            <ul className="space-y-2">
              {licenseData.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-500 mb-2">Support Contact</p>
            <div className="flex flex-col space-y-1">
              <p className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                {licenseData.supportContact.email}
              </p>
              <p className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                {licenseData.supportContact.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* License Verification Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 mr-2 text-indigo-600" />
          <h2 className="text-lg font-semibold">License Verification</h2>
        </div>
        <p className="text-gray-500 text-sm mb-4">Verify the authenticity of your license</p>

        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center">
            <KeyRound className="h-8 w-8 text-indigo-600 mr-4" />
            <div>
              <p className="font-medium">License Verification Status</p>
              <p className="text-sm text-gray-500">Last verified: Today at 9:30 AM</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600 mr-4">Verified</span>
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 text-sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Verify Again
            </button>
          </div>
        </div>
      </div>

      {/* Contact Support Dialog */}
      {isContactDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Contact License Support</h3>
              <button onClick={() => setIsContactDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-500 mb-4">Fill out this form to get in touch with our license support team.</p>
              <form onSubmit={handleContactSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsContactDialogOpen(false)}
                    className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Renew License Dialog */}
      {isRenewDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Renew Your License</h3>
              <button onClick={() => setIsRenewDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-500 mb-4">
                Extend your license to continue using all features without interruption.
              </p>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Current Plan: {licenseData.type}</p>
                  <p className="text-sm text-gray-500">Expires: {licenseData.expiryDate}</p>
                </div>
                <p className="text-xl font-bold">
                  $299<span className="text-sm font-normal">/year</span>
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md flex items-start mb-4">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Renewal Offer</p>
                  <p className="text-sm">Renew now and get 10% off your subscription for the next year!</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsRenewDialogOpen(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // In a real app, this would redirect to payment page
                    setIsRenewDialogOpen(false)
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default License
