"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Users, Clock, CheckCircle } from "lucide-react"

// Function to fetch data from Google Sheets
const fetchSheetData = async () => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=FMS')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    // Handle different response formats
    if (data && typeof data === 'object') {
      if (data.data && Array.isArray(data.data)) {
        return data.data
      }
      if (data.FMS && Array.isArray(data.FMS)) {
        return data.FMS
      }
      if (Array.isArray(data)) {
        return data
      }
      if (data.values && Array.isArray(data.values)) {
        return data.values
      }
    }
    
    return data
  } catch (error) {
    console.error('Error fetching sheet data:', error)
    return null
  }
}

// Function to fetch Master Sheet Link data for company matching
const fetchMasterSheetLinkData = async () => {
  try {
    const payload = new URLSearchParams()
    payload.append("action", "getMasterSheetData")
    payload.append("sheet", "Master Sheet Link")

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload,
      }
    )

    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    // Fallback: try GET method with sheet parameter
    try {
      const timestamp = new Date().getTime()
      const response = await fetch(`https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=Master Sheet Link&timestamp=${timestamp}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.success ? data.data : null
    } catch (fallbackError) {
      console.error("Error fetching Master Sheet Link data:", fallbackError)
      return null
    }
  }
}

// Function to get party names that match the logged-in company
const getCompanyPartyNames = (companyName, masterSheetData) => {
  if (!companyName || !masterSheetData || !Array.isArray(masterSheetData)) {
    return []
  }

  const matchingParties = []
  
  // Skip header row (start from index 1)
  for (let i = 1; i < masterSheetData.length; i++) {
    const row = masterSheetData[i]
    if (!row || !Array.isArray(row)) continue

    const companyNameInSheet = row[2] ? row[2].toString().trim() : ''
    
    if (companyNameInSheet.toLowerCase() === companyName.toLowerCase()) {
      // Check multiple columns for potential party names
      const possiblePartyColumns = [2, 6, 7, 8] // Column C, G, H, I
      
      for (const colIndex of possiblePartyColumns) {
        if (row[colIndex]) {
          const partyName = row[colIndex].toString().trim()
          if (partyName && !matchingParties.includes(partyName)) {
            matchingParties.push(partyName)
          }
        }
      }
      
      // If no specific party mapping found, use company name as party name
      if (matchingParties.length === 0) {
        matchingParties.push(companyNameInSheet)
      }
    }
  }

  return matchingParties
}

// Function to filter data for company users
const filterCompanyData = (dataRows, companyData, masterSheetData) => {
  if (!companyData || !companyData.companyName) {
    return dataRows
  }

  const columnGIndex = 6  // Party Name (Column G)
  const matchingPartyNames = getCompanyPartyNames(companyData.companyName, masterSheetData)

  if (matchingPartyNames.length > 0) {
    return dataRows.filter(row => {
      if (!row || row.length <= columnGIndex) return false
      
      const partyName = row[columnGIndex] ? row[columnGIndex].toString().trim() : ''
      
      // Check if party name matches any of the company's party names
      return matchingPartyNames.some(companyParty => 
        partyName.toLowerCase() === companyParty.toLowerCase()
      )
    })
  } else {
    // Fallback: direct company name matching
    return dataRows.filter(row => {
      if (!row || row.length <= columnGIndex) return false

      const partyName = row[columnGIndex] ? row[columnGIndex].toString().trim().toLowerCase() : ''
      const companyNameLower = companyData.companyName.toLowerCase()

      return partyName === companyNameLower
    })
  }
}

// Function to filter data for user role
// Function to filter data for user role
const filterUserData = (dataRows, userFilterData) => {
  if (!userFilterData) return dataRows

  const userName = userFilterData.username || userFilterData.name
  if (!userName) return dataRows

  const columnXIndex = 23 // Column X
  const columnYIndex = 24 // Column Y (agar Y bhi user ke liye relevant hai)

  let filtered = dataRows.filter(row => {
    if (!row || row.length <= columnXIndex) return false
    const columnXValue = row[columnXIndex]?.toString().trim() || ''
    return columnXValue.toLowerCase() === userName.toLowerCase()
  })

  // Agar Column X me data nahi mila, to Column Y try karo
  if (filtered.length === 0) {
    filtered = dataRows.filter(row => {
      if (!row || row.length <= columnYIndex) return false
      const columnYValue = row[columnYIndex]?.toString().trim() || ''
      return columnYValue.toLowerCase() === userName.toLowerCase()
    })
  }

  return filtered
}


// Function to process sheet data for charts with company and user filtering
const processSheetData = (sheetData, userRole, companyData, masterSheetData, userFilterData) => {
  if (!sheetData || !Array.isArray(sheetData)) {
    return {
      taskCompletionData: [],
      projectStatusData: [],
      teamPerformanceData: [],
      totalCompleted: 0,
      totalPending: 0,
      totalTasks: 0
    }
  }

  // Find header row
  let headerRowIndex = -1
  for (let i = 0; i < Math.min(10, sheetData.length); i++) {
    const row = sheetData[i]
    if (Array.isArray(row)) {
      for (let j = 0; j < row.length; j++) {
        const cell = row[j]
        if (cell && typeof cell === 'string' && 
            (cell.toLowerCase().includes('task no') || cell.toLowerCase() === 'task no.')) {
          headerRowIndex = i
          break
        }
      }
      if (headerRowIndex !== -1) break
    }
  }

  // Default to row 5 if header not found
  if (headerRowIndex === -1) {
    headerRowIndex = 5
  }

  const dataStartRow = Math.max(headerRowIndex + 1, 6)
  let dataRows = sheetData.slice(dataStartRow)

  // Filter data based on user role
  if (userRole === 'company') {
    dataRows = filterCompanyData(dataRows, companyData, masterSheetData)
  } else if (userRole === 'user') {
    dataRows = filterUserData(dataRows, userFilterData)
  }

  // Column indexes: AB = 27, AC = 28, AF = 31 (Team Name), G = 6 (Party Name)
  const columnABIndex = 27
  const columnACIndex = 28
  const columnAFIndex = 31
  const columnGIndex = 6

  // Process data to get totals and team performance
  const teamMap = new Map()
  const monthlyData = {}
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // Initialize monthly data
  monthNames.forEach((month, index) => {
    monthlyData[index] = {
      month,
      completed: 0,
      pending: 0,
      total: 0
    }
  })

  let totalCompleted = 0
  let totalPending = 0
  let totalTasks = 0

  dataRows.forEach(row => {
    if (!row || row.length <= columnABIndex) return

    const abHasData = row[columnABIndex] && row[columnABIndex].toString().trim() !== ''
    const acHasData = row.length > columnACIndex && row[columnACIndex] && row[columnACIndex].toString().trim() !== ''

    if (!abHasData) return // Skip if no AB data

    // Get date (assuming first column is date)
    let date = new Date()
    if (row[0]) {
      try {
        date = new Date(row[0])
      } catch (e) {
        date = new Date()
      }
    }

    const month = date.getMonth()
    const year = date.getFullYear()
    const currentYear = new Date().getFullYear()

    // Count totals
    totalTasks++
    monthlyData[month].total++

    if (abHasData && acHasData) {
      totalCompleted++
      monthlyData[month].completed++
    } else if (abHasData) {
      totalPending++
      monthlyData[month].pending++
    }

    // Process team data (only for admin)
    if (userRole === 'admin') {
      const teamName = row.length > columnAFIndex ? (row[columnAFIndex] || '').toString().trim() : 'No Team'
      
      if (!teamMap.has(teamName)) {
        teamMap.set(teamName, {
          name: teamName,
          tasks: 0,
          completed: 0,
          efficiency: 0
        })
      }

      const team = teamMap.get(teamName)
      team.tasks++

      if (abHasData && acHasData) {
        team.completed++
      }
    }
  })

  // Calculate team efficiencies and ensure we have 3 teams (admin only)
  let teamPerformanceData = []
  if (userRole === 'admin') {
    // Process existing teams
    teamMap.forEach(team => {
      team.efficiency = team.tasks > 0 ? Math.round((team.completed / team.tasks) * 100) : 0
      teamPerformanceData.push(team)
    })

    // Sort teams by tasks count for better display
    teamPerformanceData.sort((a, b) => b.tasks - a.tasks)

    // Create exactly 3 teams - merge data from sheet with default teams
    const defaultTeams = ['Team 1', 'Team 2', 'Team 3']
    const finalTeamData = []
    
    // Distribute existing teams into the 3 default teams
    for (let i = 0; i < 3; i++) {
      const teamName = defaultTeams[i]
      let teamStats = {
        name: teamName,
        tasks: 0,
        completed: 0,
        efficiency: 0
      }
      
      // If we have actual team data, use it for this slot
      if (teamPerformanceData[i]) {
        teamStats = {
          name: teamName,
          tasks: teamPerformanceData[i].tasks,
          completed: teamPerformanceData[i].completed,
          efficiency: teamPerformanceData[i].efficiency
        }
      }
      
      finalTeamData.push(teamStats)
    }
    
    // Replace the teamPerformanceData with our fixed 3-team structure
    teamPerformanceData = finalTeamData
  }

  // Prepare task completion data (filter out months with no data)
  const taskCompletionData = Object.values(monthlyData)
    .filter(month => month.total > 0)
    .sort((a, b) => monthNames.indexOf(a.month) - monthNames.indexOf(b.month))

  // Prepare project status data
  const projectStatusData = [
    { name: "Completed", value: totalCompleted, color: "#10B981" },
    { name: "Pending", value: totalPending, color: "#F59E0B" },
  ].filter(item => item.value > 0)

  return {
    taskCompletionData,
    projectStatusData,
    teamPerformanceData,
    totalCompleted,
    totalPending,
    totalTasks
  }
}

export default function DashboardCharts({ userRole, companyData, userFilterData }) {
  const [activeChart, setActiveChart] = useState("completion")
  const [chartData, setChartData] = useState({
    taskCompletionData: [],
    projectStatusData: [],
    teamPerformanceData: [],
    totalCompleted: 0,
    totalPending: 0,
    totalTasks: 0
  })
  const [loading, setLoading] = useState(true)
  const [masterSheetData, setMasterSheetData] = useState(null)

  // Fetch and process data on component mount
  useEffect(() => {
    const loadChartData = async () => {
      setLoading(true)

      try {
        // Fetch Master Sheet Link data first if company user
        let masterData = null
        if (userRole === 'company' && companyData) {
          masterData = await fetchMasterSheetLinkData()
          setMasterSheetData(masterData)
        }

        // Fetch FMS data
        const data = await fetchSheetData()
        if (data) {
          const processedData = processSheetData(data, userRole, companyData, masterData, userFilterData)
          setChartData(processedData)
        }
      } catch (error) {
        console.error('Error loading chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [userRole, companyData, userFilterData])

  const chartTabs = [
    { id: "completion", label: "Task Completion", icon: CheckCircle },
    { id: "performance", label: "Team Performance", icon: Users },
    { id: "status", label: "Project Status", icon: TrendingUp },
  ]

  // Filter tabs based on user role
  const filteredTabs = userRole === 'admin' 
    ? chartTabs 
    : chartTabs.filter(tab => tab.id !== "performance") // Hide Team Performance for non-admin

const renderChart = (chartId = activeChart) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600">Loading chart data...</span>
      </div>
    )
  }

    switch (activeChart,chartId) {
      case "completion":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.taskCompletionData}>
              <defs>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="#10B981"
                fill="url(#completedGradient)"
                strokeWidth={2}
                name="Completed"
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#F59E0B"
                fill="url(#pendingGradient)"
                strokeWidth={2}
                name="Pending"
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "performance":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={chartData.teamPerformanceData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value, name, props) => {
                  if (props.dataKey === 'efficiency') {
                    return [`${value}%`, 'Efficiency']
                  }
                  return [value, 'Total Tasks']
                }}
              />
              <Bar 
                dataKey="tasks" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]} 
                name="Total Tasks" 
                barSize={30}
              />
              <Bar 
                dataKey="efficiency" 
                fill="#8B5CF6" 
                radius={[4, 4, 0, 0]} 
                name="Efficiency" 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        )

      case "status":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.projectStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Company Users: Only Two Charts Side by Side */}
{userRole === "company" ? (
  <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Left: Task Completion Chart */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Completion</h2>
      {renderChart("completion")}
    </div>

    {/* Right: Project Status Chart */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Status</h2>
      {renderChart("status")}
    </div>
  </div>
) : (
    <>
      {/* Admin + User Original Layout */}
      {/* Main Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {userRole === 'admin' ? 'Analytics Dashboard' : 'My Performance'}
            </h2>
            <div className="flex items-center space-x-2">
              {filteredTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeChart === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">{renderChart()}</div>
      </div>

      {/* Stats + Insights Section */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">Total Tasks</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {loading ? "..." : chartData.totalTasks}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Tasks Completed</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {loading ? "..." : chartData.totalCompleted}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm text-gray-600">Pending Tasks</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {loading ? "..." : chartData.totalPending}
              </span>
            </div>
            {userRole === 'admin' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-600">Efficiency</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {loading ? "..." : chartData.totalTasks > 0
                    ? Math.round((chartData.totalCompleted / chartData.totalTasks) * 100) + "%"
                    : "0%"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Project Status Legend */}
        {activeChart === "status" && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
            <div className="space-y-3">
              {chartData.projectStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Performance Details (Admin only) */}
        {activeChart === "performance" && userRole === 'admin' && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance Details</h3>
            <div className="space-y-3">
              {chartData.teamPerformanceData.map((team, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{team.name}</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {team.efficiency}% Efficiency
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>{team.tasks} Tasks</span>
                    <span>{team.completed || 0} Completed</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${team.efficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Tasks Status</span>
              </div>
              <p className="text-xs text-green-700">
                {loading ? "Loading..." : `${chartData.totalCompleted} completed, ${chartData.totalPending} pending`}
              </p>
            </div>
            {userRole === 'admin' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Team Performance</span>
                </div>
                <p className="text-xs text-blue-700">
                  {loading ? "Loading..." :
                    `Average efficiency: ${chartData.teamPerformanceData.length > 0
                      ? Math.round(chartData.teamPerformanceData.reduce((sum, team) => sum + team.efficiency, 0) / chartData.teamPerformanceData.length)
                      : 0}%`}
                </p>
              </div>
            )}
            {userRole === 'admin' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Overall Efficiency</span>
                </div>
                <p className="text-xs text-orange-700">
                  {loading ? "Loading..." :
                    `${chartData.totalTasks > 0
                      ? Math.round((chartData.totalCompleted / chartData.totalTasks) * 100)
                      : 0}% of all tasks completed`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )}
</div>

  )
}