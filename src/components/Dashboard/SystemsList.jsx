"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  Eye,
  ExternalLink,
  Server,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Calendar,
  Code,
  Zap,
  Shield,
  Bug,
  Sparkles,
} from "lucide-react"
import Button from "../ui/Button"

const mockSystems = [
  {
    id: 1,
    name: "Botivate Website",
    type: "Website",
    status: "Active",
    version: "v2.1.0",
    lastUpdate: "2024-01-10",
    users: 1250,
    uptime: "99.9%",
    url: "https://botivate.com",
    description: "Main company website with portfolio and services",
    technology: "React, Node.js, MongoDB",
    developer: "Satyendra",
    updates: [
      {
        id: 1,
        version: "v2.1.0",
        date: "2024-01-10",
        type: "Feature",
        description: "Added new portfolio section with interactive gallery",
        developer: "Satyendra",
      },
      {
        id: 2,
        version: "v2.0.5",
        date: "2024-01-05",
        type: "Bug Fix",
        description: "Fixed responsive design issues on mobile devices",
        developer: "Vikas",
      },
      {
        id: 3,
        version: "v2.0.4",
        date: "2023-12-28",
        type: "Security",
        description: "Updated security headers and SSL configuration",
        developer: "Chetan",
      },
    ],
  },
  {
    id: 2,
    name: "CRM System",
    type: "Web App",
    status: "Active",
    version: "v3.2.1",
    lastUpdate: "2024-01-08",
    users: 850,
    uptime: "99.5%",
    url: "https://crm.acemark.com",
    description: "Customer relationship management system for Acemark Statiners",
    technology: "Vue.js, Laravel, MySQL",
    developer: "Chetan",
    updates: [
      {
        id: 4,
        version: "v3.2.1",
        date: "2024-01-08",
        type: "Performance",
        description: "Optimized database queries for faster loading times",
        developer: "Chetan",
      },
      {
        id: 5,
        version: "v3.2.0",
        date: "2024-01-02",
        type: "Feature",
        description: "Added advanced reporting and analytics dashboard",
        developer: "Satyendra",
      },
    ],
  },
  {
    id: 3,
    name: "User Portal",
    type: "Web App",
    status: "Maintenance",
    version: "v1.8.3",
    lastUpdate: "2024-01-12",
    users: 2100,
    uptime: "98.2%",
    url: "https://portal.atjwellers.com",
    description: "Customer portal for AT Jwellers with order tracking",
    technology: "Angular, .NET Core, SQL Server",
    developer: "Vikas",
    updates: [
      {
        id: 6,
        version: "v1.8.3",
        date: "2024-01-12",
        type: "Bug Fix",
        description: "Fixed login authentication issues and session management",
        developer: "Vikas",
      },
      {
        id: 7,
        version: "v1.8.2",
        date: "2024-01-06",
        type: "Feature",
        description: "Added order tracking functionality with real-time updates",
        developer: "Satyendra",
      },
    ],
  },
  {
    id: 4,
    name: "Dashboard System",
    type: "Admin Panel",
    status: "Active",
    version: "v4.1.2",
    lastUpdate: "2024-01-09",
    users: 45,
    uptime: "99.8%",
    url: "https://admin.azureinteriors.com",
    description: "Administrative dashboard for Azure Interiors management",
    technology: "React, Express.js, PostgreSQL",
    developer: "Digendra",
    updates: [
      {
        id: 8,
        version: "v4.1.2",
        date: "2024-01-09",
        type: "UI Update",
        description: "Redesigned user interface with modern design patterns",
        developer: "Digendra",
      },
      {
        id: 9,
        version: "v4.1.1",
        date: "2024-01-03",
        type: "Performance",
        description: "Improved dashboard loading speed by 40%",
        developer: "Chetan",
      },
    ],
  },
  {
    id: 5,
    name: "Communication Hub",
    type: "API Service",
    status: "Development",
    version: "v0.9.1",
    lastUpdate: "2024-01-11",
    users: 0,
    uptime: "95.0%",
    url: "https://api.botivate.com",
    description: "WhatsApp API integration for customer support",
    technology: "Node.js, Express, Redis",
    developer: "Pratap",
    updates: [
      {
        id: 10,
        version: "v0.9.1",
        date: "2024-01-11",
        type: "Feature",
        description: "Implemented WhatsApp Business API integration",
        developer: "Pratap",
      },
      {
        id: 11,
        version: "v0.9.0",
        date: "2024-01-07",
        type: "Initial",
        description: "Initial setup and basic API endpoints",
        developer: "Pratap",
      },
    ],
  },
]

export default function SystemsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedSystem, setSelectedSystem] = useState(null)
  const [showSystemModal, setShowSystemModal] = useState(false)

  const filteredSystems = mockSystems.filter((system) => {
    const matchesSearch =
      system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.developer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = !filterType || system.type === filterType
    const matchesStatus = !filterStatus || system.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const sortedSystems = [...filteredSystems].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (sortField === "lastUpdate") {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleViewSystem = (system) => {
    setSelectedSystem(system)
    setShowSystemModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "Development":
        return "bg-blue-100 text-blue-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "Maintenance":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "Development":
        return <Server className="w-4 h-4 text-blue-500" />
      case "Inactive":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Server className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Systems List</h2>
            <p className="text-gray-600">Manage and monitor all your systems</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Total Systems:</span>
            <span className="text-lg font-semibold text-blue-600">{sortedSystems.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search systems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="Website">Website</option>
              <option value="Web App">Web App</option>
              <option value="Admin Panel">Admin Panel</option>
              <option value="API Service">API Service</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Development">Development</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Systems Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>System Name</span>
                    {sortField === "name" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Type</span>
                    {sortField === "type" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("version")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Version</span>
                    {sortField === "version" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("users")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Users</span>
                    {sortField === "users" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("uptime")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Uptime</span>
                    {sortField === "uptime" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("lastUpdate")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Update</span>
                    {sortField === "lastUpdate" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSystems.map((system, index) => (
                <motion.tr
                  key={system.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Server className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{system.name}</div>
                        <div className="text-sm text-gray-500">{system.developer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{system.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(system.status)}
                      <span
                        className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(system.status)}`}
                      >
                        {system.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{system.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{system.users.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{system.uptime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(system.lastUpdate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleViewSystem(system)}
                        variant="outline"
                        className="flex items-center space-x-1 bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Button>
                      <a
                        href={system.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Details Modal */}
      {showSystemModal && selectedSystem && (
        <SystemDetailsModal
          system={selectedSystem}
          onClose={() => {
            setShowSystemModal(false)
            setSelectedSystem(null)
          }}
        />
      )}
    </div>
  )
}

function SystemDetailsModal({ system, onClose }) {
  const [activeTab, setActiveTab] = useState("overview")

  const getUpdateTypeIcon = (type) => {
    switch (type) {
      case "Feature":
        return <Sparkles className="w-4 h-4 text-blue-500" />
      case "Bug Fix":
        return <Bug className="w-4 h-4 text-red-500" />
      case "Security":
        return <Shield className="w-4 h-4 text-green-500" />
      case "Performance":
        return <Zap className="w-4 h-4 text-yellow-500" />
      case "UI Update":
        return <Code className="w-4 h-4 text-purple-500" />
      case "Initial":
        return <Calendar className="w-4 h-4 text-gray-500" />
      default:
        return <Code className="w-4 h-4 text-gray-500" />
    }
  }

  const getUpdateTypeColor = (type) => {
    switch (type) {
      case "Feature":
        return "bg-blue-100 text-blue-800"
      case "Bug Fix":
        return "bg-red-100 text-red-800"
      case "Security":
        return "bg-green-100 text-green-800"
      case "Performance":
        return "bg-yellow-100 text-yellow-800"
      case "UI Update":
        return "bg-purple-100 text-purple-800"
      case "Initial":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{system.name}</h2>
                <p className="text-blue-100">
                  {system.type} • {system.version}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              System Overview
            </button>
            <button
              onClick={() => setActiveTab("updates")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "updates"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Project Updates ({system.updates.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* System Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">System Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${system.status === "Active" ? "bg-green-100 text-green-800" : system.status === "Maintenance" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}
                        >
                          {system.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Version:</span>
                        <span className="font-medium">{system.version}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Developer:</span>
                        <span className="font-medium">{system.developer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Update:</span>
                        <span className="font-medium">{new Date(system.lastUpdate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                    <p className="text-gray-600 text-sm">{system.description}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">System Metrics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Users:</span>
                        <span className="font-medium">{system.users.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Uptime:</span>
                        <span className="font-medium text-green-600">{system.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Technology:</span>
                        <span className="font-medium text-sm">{system.technology}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <a
                        href={system.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Visit System</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "updates" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Updates Timeline</h3>
              <div className="space-y-4">
                {system.updates.map((update, index) => (
                  <motion.div
                    key={update.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0 mt-1">{getUpdateTypeIcon(update.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{update.version}</h4>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getUpdateTypeColor(update.type)}`}
                          >
                            {update.type}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">{new Date(update.date).toLocaleDateString()}</div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{update.description}</p>
                      <div className="text-xs text-gray-500">
                        Updated by: <span className="font-medium">{update.developer}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
