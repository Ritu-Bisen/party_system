"use client"
import { useState, useEffect } from "react"
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
  Loader,
  FileText,
  Database,
  Activity,
} from "lucide-react"
import Button from "../ui/Button"

// Google Sheets API configuration
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec"
const SHEET_ID = "1FI822cXWCrELlxq09D-HPQtQE0t7bWPAacJZMsWD3Vc"

// Function to fetch data from your existing Google Apps Script
const fetchGoogleSheetData = async (sheetName) => {
  try {
    const url = `${SHEET_URL}?sheet=${encodeURIComponent(sheetName)}&action=fetch`

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch data')
    }

    return data
  } catch (error) {
    console.error(`Error fetching ${sheetName} data:`, error)
    throw error
  }
}

export default function SystemsList({ userRole: propUserRole, companyData }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [sortField, setSortField] = useState("systemName")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedSystem, setSelectedSystem] = useState(null)
  const [showSystemModal, setShowSystemModal] = useState(false)
  const [systems, setSystems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [companyName, setCompanyName] = useState(companyData?.companyName || "")
  const [userRole, setUserRole] = useState(propUserRole || "company")
  const [activeTab, setActiveTab] = useState("inprogress") // Updated default tab

  // Update role and company when props change
  useEffect(() => {
    if (propUserRole) {
      setUserRole(propUserRole)
      console.log('SystemsList - User role set to:', propUserRole)
    }
    if (companyData?.companyName) {
      setCompanyName(companyData.companyName)
      console.log('SystemsList - Company name set to:', companyData.companyName)
    }
  }, [propUserRole, companyData])

  // Simulate getting company name from login context (fallback)
  useEffect(() => {
    if (!propUserRole && !companyData) {
      console.log('SystemsList - Using fallback values')
      setUserRole("company")
      setCompanyName("")
    }
  }, [])

  // Fetch data from Google Sheets
  const fetchSystemsData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('User Role:', userRole)
      console.log('Company Name:', companyName)

      // Get FMS data first
      console.log('Fetching FMS data...')
      const fmsData = await fetchGoogleSheetData('FMS')
      console.log('FMS Data received:', fmsData)

      if (!fmsData || !fmsData.data) {
        throw new Error('Invalid FMS data format received')
      }

      // Get System List data
      console.log('Fetching System List data...')
      const systemData = await fetchGoogleSheetData('System List')
      console.log('System List Data received:', systemData)

      if (!systemData || !systemData.data) {
        throw new Error('Invalid System List data format received')
      }

      // If admin, show all systems from System List
      if (userRole === "admin") {
        console.log('Admin access - showing all systems...')

        const allSystems = systemData.data
          .slice(1) // Skip header row
          .map((row, index) => {
            // Find corresponding FMS data where System List Column A = FMS Column G
            // AND System List Column D = FMS Column E (Type of System match)
            // and filter FMS records where columns AB and AC are not null
            const fmsRecords = fmsData.data?.slice(1).filter(fmsRow => {
              // Debug logging
              console.log('Debug - FMS Row:', fmsRow)
              console.log('Debug - FMS Column E (Type):', fmsRow[4])
              console.log('Debug - System List Column D (Type):', row[3])
              console.log('Debug - FMS Column G (Party):', fmsRow[6])
              console.log('Debug - System List Column A (Party):', row[0])

              const hasRequiredData = fmsRow && fmsRow[6] && row[0] && fmsRow[4] && row[3]
              console.log('Debug - Has required data:', hasRequiredData)

              if (!hasRequiredData) return false

              const partyMatch = fmsRow[6].toString().toLowerCase().trim() === row[0].toString().toLowerCase().trim()
              const typeMatch = fmsRow[4].toString().toLowerCase().trim() === row[3].toString().toLowerCase().trim()
              const hasDateData = fmsRow[27] && fmsRow[27].toString().trim() !== "" && fmsRow[28] && fmsRow[28].toString().trim() !== ""

              console.log('Debug - Party match:', partyMatch)
              console.log('Debug - Type match:', typeMatch)
              console.log('Debug - Has date data:', hasDateData)
              console.log('Debug - Final result:', partyMatch && typeMatch && hasDateData)
              console.log('---')

              return partyMatch && typeMatch && hasDateData
            }) || []

            return {
              id: index + 1,
              sno: index + 1,
              systemName: row[2] ? row[2].toString().trim() : 'N/A',
              partyName: row[0] ? row[0].toString().trim() : 'N/A',
              departmentName: row[1] ? row[1].toString().trim() : 'N/A',
              typeOfSystem: row[3] ? row[3].toString().trim() : 'N/A',
              status: row[4] ? row[4].toString().trim() : 'N/A', // Column E
              totalUpdation: row[5] ? row[5].toString().trim() : 'N/A',
              flowchart: row[7] ? row[7].toString().trim() : 'N/A',
              // FMS data for view modal - only records where AB and AC are not null and type matches
              fmsData: fmsRecords.map(fmsRow => ({
                partyName: fmsRow[6] || 'N/A', // FMS Column G
                systemName: row[2] || 'N/A', // System List Column C
                typeOfSystem: fmsRow[4] || 'N/A', // FMS Column E
                descriptionOfWork: fmsRow[8] || 'N/A', // FMS Column I
                actualSubmitDate: fmsRow[28] || 'N/A', // FMS Column AC (index 28)
                expectedDateToClose: fmsRow[27] || 'N/A', // FMS Column AB (index 27)
                takenFrom: fmsRow[5] || 'N/A', // FMS Column F
                priority: fmsRow[31] || 'N/A', // FMS Column AF (index 31)
                assignedTo: fmsRow[32] || 'N/A', // FMS Column AG (index 32)
                workStatus: fmsRow[30] || 'N/A', // FMS Column AE
                remarks: fmsRow[26] || 'N/A', // FMS Column AA
              })),

              // Get version from System List Column F (index 5)
              version: row[5] ? row[5].toString().trim() : "v1.0.0",
              lastUpdate: new Date().toISOString().split('T')[0],

              // Get URL from System List Column G (index 6)
              url: row[6] ? row[6].toString().trim() : `https://${row[2] ? row[2].toLowerCase().replace(/\s+/g, '') : 'system'}.com`,
              description: `${row[3] || 'System'} for ${row[1] || 'department'} department`,
              technology: "Web Application",
              developer: "System Admin",
              updates: []
            }
          })

        console.log('Admin - All systems loaded:', allSystems.length)
        setSystems(allSystems)
        return
      }

      // Company access - follow the matching logic
      console.log('Company access - filtering based on FMS match...')

      if (!companyName || companyName === "") {
        const availableCompanies = fmsData.data
          .slice(1)
          .map(row => row && row[6] ? row[6] : null)
          .filter(company => company !== null && company !== "")

        console.log('Available companies in FMS:', availableCompanies)

        if (availableCompanies.length > 0) {
          setCompanyName(availableCompanies[0])
          console.log('Using first available company:', availableCompanies[0])
        } else {
          throw new Error('No companies found in FMS data')
        }
      }

      // Find matching systems where System List Column A = FMS Column G = Company Name
      // AND System List Column D = FMS Column E (Type of System match)
      console.log('Finding systems where System List Column A matches FMS Column G and Type of System matches for company:', companyName)

      const matchedSystems = systemData.data
        .slice(1)
        .filter((systemRow) => {
          const systemPartyName = systemRow[0] ? systemRow[0].toString().toLowerCase().trim() : ''
          const systemTypeOfSystem = systemRow[3] ? systemRow[3].toString().toLowerCase().trim() : ''

          const matchingFmsRow = fmsData.data.slice(1).find(fmsRow => {
            const fmsPartyName = fmsRow[6] ? fmsRow[6].toString().toLowerCase().trim() : ''
            const fmsTypeOfSystem = fmsRow[4] ? fmsRow[4].toString().toLowerCase().trim() : ''
            return fmsPartyName === systemPartyName &&
              fmsPartyName === companyName.toLowerCase().trim() &&
              fmsTypeOfSystem === systemTypeOfSystem // Type of System match
          })

          console.log(`System: ${systemPartyName}, Type: ${systemTypeOfSystem}, Match found: ${!!matchingFmsRow}`)
          return !!matchingFmsRow
        })
        .map((row, index) => {
          // Get corresponding FMS data where columns AB and AC are not null and type matches
          const fmsRecords = fmsData.data.slice(1).filter(fmsRow => {
            // Simplified version - only party match for testing
            console.log('Company Debug - FMS Row Party:', fmsRow[6])
            console.log('Company Debug - System Row Party:', row[0])
            console.log('Company Debug - FMS Type:', fmsRow[4])
            console.log('Company Debug - System Type:', row[3])

            const hasBasicData = fmsRow && fmsRow[6] && row[0]
            if (!hasBasicData) return false

            const partyMatch = fmsRow[6].toString().toLowerCase().trim() === row[0].toString().toLowerCase().trim()
            const hasDateData = fmsRow[27] && fmsRow[27].toString().trim() !== "" && fmsRow[28] && fmsRow[28].toString().trim() !== ""

            // For testing - comment out type matching
            // const typeMatch = fmsRow[4] && row[3] && fmsRow[4].toString().toLowerCase().trim() === row[3].toString().toLowerCase().trim()

            console.log('Company Debug - Party match:', partyMatch)
            console.log('Company Debug - Has date data:', hasDateData)
            // console.log('Company Debug - Type match:', typeMatch)
            console.log('---')

            return partyMatch && hasDateData // && typeMatch
          }) || []

          return {
            id: index + 1,
            sno: index + 1,
            systemName: row[2] ? row[2].toString().trim() : 'N/A',
            partyName: row[0] ? row[0].toString().trim() : 'N/A',
            departmentName: row[1] ? row[1].toString().trim() : 'N/A',
            typeOfSystem: row[3] ? row[3].toString().trim() : 'N/A',
            status: row[4] ? row[4].toString().trim() : 'N/A', // Column E
            totalUpdation: row[5] ? row[5].toString().trim() : 'N/A',
            flowchart: row[7] ? row[7].toString().trim() : 'N/A',

            // FMS data for view modal - only records where AB and AC are not null and type matches
            fmsData: fmsRecords.map(fmsRow => ({
              partyName: fmsRow[6] || 'N/A', // FMS Column G
              systemName: row[2] || 'N/A', // System List Column C
              typeOfSystem: fmsRow[4] || 'N/A', // FMS Column E
              descriptionOfWork: fmsRow[8] || 'N/A', // FMS Column I
              actualSubmitDate: fmsRow[28] || 'N/A', // FMS Column AC (index 28)
              expectedDateToClose: fmsRow[27] || 'N/A', // FMS Column AB (index 27)
              takenFrom: fmsRow[5] || 'N/A', // FMS Column F
              priority: fmsRow[31] || 'N/A', // FMS Column AF (index 31)
              assignedTo: fmsRow[32] || 'N/A', // FMS Column AG (index 32)
              workStatus: fmsRow[30] || 'N/A', // FMS Column AE (index 30)
              remarks: fmsRow[26] || 'N/A', // FMS Column AA (index 26)
            })),

            // Get version from System List Column F (index 5)
            version: row[5] ? row[5].toString().trim() : "v1.0.0",
            lastUpdate: new Date().toISOString().split('T')[0],

            // Get URL from System List Column G (index 6)
            url: row[6] ? row[6].toString().trim() : `https://${row[2] ? row[2].toLowerCase().replace(/\s+/g, '') : 'system'}.com`,
            description: `${row[3] || 'System'} for ${row[1] || 'department'} department`,
            technology: "Web Application",
            developer: "System Admin",
            updates: []
          }
        })

      console.log('Company - Matched systems count:', matchedSystems.length)
      console.log('Company - Matched systems:', matchedSystems)
      setSystems(matchedSystems)

    } catch (err) {
      setError(err.message)
      console.error('Error fetching systems data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('SystemsList - Fetching data with role:', userRole, 'company:', companyName)
    fetchSystemsData()
  }, [userRole, companyName])

  // Function to filter systems by status and apply search/filters
  const getFilteredSystems = (statusFilter) => {
    return systems.filter((system) => {
      // First filter by status (inprogress or completed)
      const statusMatch = statusFilter === 'inprogress'
        ? system.status.toLowerCase() === 'in progress'
        : system.status.toLowerCase() === statusFilter.toLowerCase()

      // Then apply search and other filters
      const matchesSearch =
        system.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        system.partyName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = !filterType || system.typeOfSystem === filterType
      const matchesStatusFilter = !filterStatus || system.status === filterStatus

      return statusMatch && matchesSearch && matchesType && matchesStatusFilter
    })
  }

  // Get in progress and completed systems
  const inProgressSystems = getFilteredSystems('inprogress')
  const completedSystems = getFilteredSystems('completed')

  // Get current systems based on active tab
  const currentSystems = activeTab === 'inprogress' ? inProgressSystems : completedSystems

  const sortSystemsArray = (systemsArray) => {
    return [...systemsArray].sort((a, b) => {
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
  }

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
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "development":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "maintenance":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "development":
        return <Server className="w-4 h-4 text-blue-500" />
      case "inactive":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Server className="w-4 h-4 text-gray-500" />
    }
  }

  // Get unique values for filters
  const uniqueTypes = [...new Set(systems.map(system => system.typeOfSystem).filter(Boolean))]
  const uniqueStatuses = [...new Set(systems.map(system => system.status).filter(Boolean))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-gray-600">Loading systems data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-red-800 font-medium">Error Loading Data</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <Button
          onClick={fetchSystemsData}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
  <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Systems List</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage and monitor all your systems {userRole === "admin" ? "(Admin View)" : `for ${companyName}`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-500">In Progress</div>
              <div className="text-lg font-semibold text-yellow-600">{inProgressSystems.length}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Completed</div>
              <div className="text-lg font-semibold text-green-600">{completedSystems.length}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-lg font-semibold text-blue-600">{systems.length}</div>
            </div>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base w-full sm:w-auto"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base w-full sm:w-auto"
            >
              <option value="">All Status</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Single Table with Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Headers */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('inprogress')}
              className={`flex-1 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors border-r border-gray-200 ${activeTab === 'inprogress'
                ? 'bg-white text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">In Progress</span>
                </div>
                <span className="sm:hidden text-xs text-center">In Progress</span>
                <span className="bg-yellow-100 text-yellow-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
                  {inProgressSystems.length}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors ${activeTab === 'completed'
                ? 'bg-white text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Completed</span>
                </div>
                <span className="sm:hidden text-xs text-center">Completed</span>
                <span className="bg-green-100 text-green-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium">
                  {completedSystems.length}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto relative" style={{ maxHeight: '70vh' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.No.
                </th>
                {userRole === "admin" && (
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("systemName")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>System Name</span>
                      {sortField === "systemName" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                )}
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("partyName")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Party Name</span>
                    {sortField === "partyName" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("departmentName")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Department Name</span>
                    {sortField === "departmentName" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("typeOfSystem")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Type of System</span>
                    {sortField === "typeOfSystem" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("totalUpdation")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Total Updation</span>
                    {sortField === "totalUpdation" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("flowchart")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Flowchart</span>
                    {sortField === "flowchart" && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortSystemsArray(currentSystems).length === 0 ? (
                <tr>
                  <td colSpan={userRole === "admin" ? "9" : "8"} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      {activeTab === 'inprogress' ? (
                        <Clock className="w-12 h-12 text-gray-400" />
                      ) : (
                        <CheckCircle className="w-12 h-12 text-gray-400" />
                      )}
                      <h3 className="text-gray-900 font-medium text-base">
                        No {activeTab === 'inprogress' ? 'in progress' : activeTab} systems found
                      </h3>
                      <p className="text-gray-500 text-sm">No systems match your current filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortSystemsArray(currentSystems).map((system, index) => (
                  <motion.tr
                    key={system.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{system.sno}</div>
                    </td>
                    {userRole === "admin" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <Server className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900" title={system.systemName}>
                              {system.systemName}
                            </div>
                            <div className="text-xs text-gray-500">{system.developer || 'System Admin'}</div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" title={system.partyName}>
                        {system.partyName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" title={system.departmentName}>
                        {system.departmentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" title={system.typeOfSystem}>
                        {system.typeOfSystem}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(system.status)}
                        <span
                          className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(system.status)}`}
                        >
                          {system.status.toLowerCase() === 'pending' ? 'In Progress' : system.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{system.totalUpdation}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{system.flowchart}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleViewSystem(system)}
                          variant="outline"
                          className="flex items-center space-x-1 bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50 px-3 py-2 text-sm"
                        >
                          <span>View</span>
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {sortSystemsArray(currentSystems).length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="flex flex-col items-center space-y-2">
                {activeTab === 'inprogress' ? (
                  <Clock className="w-8 h-8 text-gray-400" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                )}
                <h3 className="text-gray-900 font-medium text-sm">
                  No {activeTab === 'inprogress' ? 'in progress' : activeTab} systems found
                </h3>
                <p className="text-gray-500 text-xs">No systems match your current filters.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-3">
              {sortSystemsArray(currentSystems).map((system, index) => (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Header with S.No and Status */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        #{system.sno}
                      </span>
                      <div className="flex items-center">
                        {getStatusIcon(system.status)}
                        <span
                          className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(system.status)}`}
                        >
                          {system.status.toLowerCase() === 'pending' ? 'Progress' : system.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Updates</div>
                      <div className="text-sm font-semibold text-gray-900">{system.totalUpdation}</div>
                    </div>
                  </div>

                  {/* System Info */}
                  <div className="space-y-2 mb-3">
                    {userRole === "admin" && (
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Server className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-600 text-sm">{system.systemName}</h4>
                          <p className="text-xs text-gray-500">{system.developer || 'System Admin'}</p>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Party:</span> {system.partyName}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Department:</span> {system.departmentName}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">Type:</span> 
                        <span className="text-green-600 font-medium ml-1">{system.typeOfSystem}</span>
                      </p>
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Flowchart:</span> {system.flowchart}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleViewSystem(system)}
                      variant="outline"
                      className="flex items-center space-x-1 bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50 px-3 py-1 text-xs"
                    >
                      <span>View</span>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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


// Date formatting function - component के बाहर define करें
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If it's already in a different format, try to parse it
      const parts = dateString.split(/[-/.]/);
      if (parts.length === 3) {
        // Assume it's yyyy-mm-dd or dd-mm-yyyy or similar
        let day, month, year;
        if (parts[0].length === 4) {
          // yyyy-mm-dd format
          year = parts[0];
          month = parts[1];
          day = parts[2];
        } else {
          // dd-mm-yyyy or mm-dd-yyyy format
          day = parts[0];
          month = parts[1];
          year = parts[2];
        }
        
        // Convert to 2-digit format
        if (year.length === 4) {
          year = year.slice(-2);
        }
        
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      }
      return dateString; // Return original if can't parse
    }
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return dateString; // Return original if error
  }
};


function SystemDetailsModal({ system, onClose }) {
  const [activeTab, setActiveTab] = useState("overview")

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "development":
        return "bg-blue-100 text-blue-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getWorkStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "on hold":
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
        className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
                <Server className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{system.systemName}</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {system.typeOfSystem} • {system.departmentName}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Records</div>
                <div className="text-2xl font-bold text-gray-900">{system.fmsData?.length || 0}</div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <Activity className="w-4 h-4" />
              <span>System Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("systemUpdation")}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === "systemUpdation"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <Database className="w-4 h-4" />
              <span>System Updation ({system.fmsData?.length || 0})</span>
            </button>
          </nav>
        </div>

        <div className="p-3 sm:p-6 max-h-96 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              {/* System Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                      <Server className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                      <span className="hidden sm:inline">System Information</span>
                      <span className="sm:hidden">System Info</span>
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">Party Name:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{system.partyName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">Department:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{system.departmentName}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">System Type:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{system.typeOfSystem}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">Status:</span>
                        <span
                          className={`px-2 py-1 sm:px-3 sm:py-1 text-xs font-medium rounded-full ${getStatusColor(system.status)} w-fit`}
                        >
                          {system.status.toLowerCase() === 'pending' ? 'In Progress' : system.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">Total Updates:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm">{system.totalUpdation}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">Flowchart:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm">{system.flowchart}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-600" />
                      Description
                    </h4>
                    <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{system.description}</p>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 border border-green-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                      <span className="hidden sm:inline">System Metrics</span>
                      <span className="sm:hidden">Metrics</span>
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">Technology:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{system.technology || 'N/A'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-gray-600 font-medium text-xs sm:text-sm">Version:</span>
                        <span className="font-semibold text-gray-900 text-xs sm:text-sm">{system.version || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-600" />
                      <span className="hidden sm:inline">Quick Actions</span>
                      <span className="sm:hidden">Actions</span>
                    </h4>
                    <div className="space-y-2">
                      {system.url && system.url !== 'N/A' && (
                        <a
                          href={system.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 text-xs sm:text-sm font-medium transition-colors p-2 rounded-md hover:bg-purple-100"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Visit System</span>
                        </a>
                      )}
                      {(!system.url || system.url === 'N/A') && (
                        <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm p-2">
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>No URL available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "systemUpdation" && (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                  <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  <span className="hidden sm:inline">System Updation Records</span>
                  <span className="sm:hidden">Update Records</span>
                </h3>
              </div>

              {system.fmsData && system.fmsData.length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                            S.No.
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                            Party Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                            System Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                            Type of System
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                            Description of Work
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                            Actual Submit Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                            Taken From
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                            Work Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Remarks
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {system.fmsData.map((fmsItem, index) => (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                              <div className="font-medium" title={fmsItem.partyName}>
                                {fmsItem.partyName}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                              <div className="font-medium text-blue-600" title={fmsItem.systemName}>
                                {fmsItem.systemName}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                              <div className="font-medium text-green-600" title={fmsItem.typeOfSystem}>
                                {fmsItem.typeOfSystem}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 max-w-xs">
                              <div className="truncate" title={fmsItem.descriptionOfWork}>
                                {fmsItem.descriptionOfWork}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                <span>{formatDate(fmsItem.actualSubmitDate)}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                              <div title={fmsItem.takenFrom}>
                                {fmsItem.takenFrom}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm border-r border-gray-200">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getWorkStatusColor(fmsItem.workStatus)}`}>
                                {fmsItem.workStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                              <div className="truncate" title={fmsItem.remarks}>
                                {fmsItem.remarks}
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="sm:hidden space-y-3 p-3">
                    {system.fmsData.map((fmsItem, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {/* Header with S.No and Status */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              #{index + 1}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getWorkStatusColor(fmsItem.workStatus)}`}>
                              {fmsItem.workStatus}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(fmsItem.actualSubmitDate)}
                          </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-2">
                          {/* Party & System Info */}
                          <div>
                            <h4 className="font-semibold text-blue-600 text-sm mb-1">{fmsItem.systemName}</h4>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Party:</span> {fmsItem.partyName}
                            </p>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">Type:</span> 
                              <span className="text-green-600 font-medium ml-1">{fmsItem.typeOfSystem}</span>
                            </p>
                          </div>

                          {/* Description */}
                          <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Work Description:</p>
                            <p className="text-xs text-gray-800 bg-gray-50 p-2 rounded border">
                              {fmsItem.descriptionOfWork}
                            </p>
                          </div>

                          {/* Bottom Info */}
                          <div className="flex justify-between items-end pt-2 border-t border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500">
                                <span className="font-medium">From:</span> {fmsItem.takenFrom}
                              </p>
                            </div>
                            {fmsItem.remarks && (
                              <div className="text-right">
                                <p className="text-xs text-gray-500 font-medium">Remarks:</p>
                                <p className="text-xs text-gray-700 max-w-32 truncate" title={fmsItem.remarks}>
                                  {fmsItem.remarks}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <Database className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <h4 className="text-gray-900 font-medium text-sm sm:text-lg mb-1 sm:mb-2">No System Updation Data Available</h4>
                  <p className="text-gray-500 text-xs sm:text-sm px-4">No updation records found for this system where both expected close date and actual submit date are available.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}