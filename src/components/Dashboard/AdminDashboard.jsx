"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  TrendingUp,
  Target,
  Activity,
  X,
  Code,
  GitBranch,
} from "lucide-react"
import Button from "../ui/Button"
import AssignTaskForm from "./AssignTaskForm"
import TaskList from "./TaskList"
import TroubleShootPage from "./TroubleShootPage"
import SystemsList from "./SystemsList"
import TasksTable from "./TaskTable"
import DashboardCharts from "./DashboardCharts"
import DeveloperStagePage from "./DeveloperStagePage"

const mockUsers = [
  {
    id: 1,
    name: "Satyendra",
    tasksAssigned: 5,
    tasksCompleted: 3,
    currentTask: "Website Development",
    timeSpent: "4h 30m",
    status: "busy",
    avatar: "S",
    completionRate: 85,
    totalTasksGiven: 12,
  },
  {
    id: 2,
    name: "Chetan",
    tasksAssigned: 3,
    tasksCompleted: 2,
    currentTask: "Database Optimization",
    timeSpent: "2h 15m",
    status: "available",
    avatar: "C",
    completionRate: 92,
    totalTasksGiven: 8,
  },
  {
    id: 3,
    name: "Digendra",
    tasksAssigned: 4,
    tasksCompleted: 4,
    currentTask: "Code Review",
    timeSpent: "1h 45m",
    status: "busy",
    avatar: "D",
    completionRate: 100,
    totalTasksGiven: 15,
  },
  {
    id: 4,
    name: "Pratap",
    tasksAssigned: 2,
    tasksCompleted: 1,
    currentTask: "Testing",
    timeSpent: "3h 20m",
    status: "available",
    avatar: "P",
    completionRate: 75,
    totalTasksGiven: 6,
  },
  {
    id: 5,
    name: "Vikas",
    tasksAssigned: 6,
    tasksCompleted: 4,
    currentTask: "UI Design",
    timeSpent: "5h 10m",
    status: "busy",
    avatar: "V",
    completionRate: 88,
    totalTasksGiven: 18,
  },
  {
    id: 6,
    name: "Tuleshwar",
    tasksAssigned: 3,
    tasksCompleted: 2,
    currentTask: "Documentation",
    timeSpent: "2h 30m",
    status: "available",
    avatar: "T",
    completionRate: 95,
    totalTasksGiven: 9,
  },
]

const mockActiveTasks = [
  { name: "Website Development", assignedTo: "Satyendra", priority: "High", dueDate: "2024-01-15" },
  { name: "Database Optimization", assignedTo: "Chetan", priority: "Medium", dueDate: "2024-01-16" },
  { name: "Code Review", assignedTo: "Digendra", priority: "Low", dueDate: "2024-01-17" },
  { name: "UI Design", assignedTo: "Vikas", priority: "High", dueDate: "2024-01-18" },
  { name: "Testing", assignedTo: "Pratap", priority: "Medium", dueDate: "2024-01-19" },
]

const mockUserTasks = {
  1: {
    pending: [
      {
        id: 1,
        title: "Website Development",
        description: "Develop responsive website for client",
        priority: "High",
        dueDate: "2024-01-15",
        systemName: "Botivate Website",
        partyName: "Botivate",
      },
      {
        id: 2,
        title: "Mobile App Integration",
        description: "Integrate mobile app with backend API",
        priority: "Medium",
        dueDate: "2024-01-18",
        systemName: "Mobile App",
        partyName: "Botivate",
      },
    ],
    completed: [
      {
        id: 3,
        title: "Database Setup",
        description: "Setup initial database structure",
        priority: "High",
        dueDate: "2024-01-10",
        completedDate: "2024-01-09",
        systemName: "Database",
        partyName: "Botivate",
      },
      {
        id: 4,
        title: "User Authentication",
        description: "Implement user login and registration",
        priority: "Medium",
        dueDate: "2024-01-12",
        completedDate: "2024-01-11",
        systemName: "Auth System",
        partyName: "Botivate",
      },
      {
        id: 5,
        title: "API Documentation",
        description: "Create comprehensive API documentation",
        priority: "Low",
        dueDate: "2024-01-08",
        completedDate: "2024-01-07",
        systemName: "Documentation",
        partyName: "Botivate",
      },
    ],
  },
  2: {
    pending: [
      {
        id: 6,
        title: "Database Optimization",
        description: "Optimize database queries for better performance",
        priority: "Medium",
        dueDate: "2024-01-16",
        systemName: "CRM System",
        partyName: "Acemark Statiners",
      },
    ],
    completed: [
      {
        id: 7,
        title: "Server Migration",
        description: "Migrate server to new infrastructure",
        priority: "High",
        dueDate: "2024-01-05",
        completedDate: "2024-01-04",
        systemName: "Infrastructure",
        partyName: "Acemark Statiners",
      },
      {
        id: 8,
        title: "Security Audit",
        description: "Conduct security audit of the system",
        priority: "High",
        dueDate: "2024-01-03",
        completedDate: "2024-01-02",
        systemName: "Security",
        partyName: "Acemark Statiners",
      },
    ],
  },
  3: {
    pending: [
      {
        id: 9,
        title: "Code Review",
        description: "Review code for new features",
        priority: "Low",
        dueDate: "2024-01-17",
        systemName: "Dashboard",
        partyName: "Azure Interiors",
      },
      {
        id: 10,
        title: "Performance Testing",
        description: "Test application performance under load",
        priority: "Medium",
        dueDate: "2024-01-20",
        systemName: "Testing Suite",
        partyName: "Azure Interiors",
      },
    ],
    completed: [
      {
        id: 11,
        title: "UI Design Update",
        description: "Update user interface design",
        priority: "Low",
        dueDate: "2024-01-13",
        completedDate: "2024-01-12",
        systemName: "Dashboard",
        partyName: "Azure Interiors",
      },
      {
        id: 12,
        title: "Feature Implementation",
        description: "Implement new dashboard features",
        priority: "Medium",
        dueDate: "2024-01-06",
        completedDate: "2024-01-05",
        systemName: "Dashboard",
        partyName: "Azure Interiors",
      },
    ],
  },
  4: {
    pending: [
      {
        id: 13,
        title: "Testing",
        description: "Test new features and bug fixes",
        priority: "Medium",
        dueDate: "2024-01-19",
        systemName: "QA Testing",
        partyName: "AT Jwellers",
      },
    ],
    completed: [
      {
        id: 14,
        title: "Bug Fixes",
        description: "Fix reported bugs in the system",
        priority: "High",
        dueDate: "2024-01-01",
        completedDate: "2023-12-31",
        systemName: "Bug Tracking",
        partyName: "AT Jwellers",
      },
    ],
  },
  5: {
    pending: [
      {
        id: 15,
        title: "UI Design",
        description: "Design new user interface components",
        priority: "High",
        dueDate: "2024-01-18",
        systemName: "Design System",
        partyName: "Divya Exports",
      },
      {
        id: 16,
        title: "Prototype Development",
        description: "Develop interactive prototypes",
        priority: "Medium",
        dueDate: "2024-01-22",
        systemName: "Prototyping",
        partyName: "Divya Exports",
      },
    ],
    completed: [
      {
        id: 17,
        title: "Wireframe Creation",
        description: "Create wireframes for new features",
        priority: "Low",
        dueDate: "2024-01-02",
        completedDate: "2024-01-01",
        systemName: "Design",
        partyName: "Divya Exports",
      },
      {
        id: 18,
        title: "User Research",
        description: "Conduct user research and analysis",
        priority: "Medium",
        dueDate: "2023-12-28",
        completedDate: "2023-12-27",
        systemName: "Research",
        partyName: "Divya Exports",
      },
    ],
  },
  6: {
    pending: [
      {
        id: 19,
        title: "Documentation",
        description: "Create technical documentation",
        priority: "Medium",
        dueDate: "2024-01-16",
        systemName: "Documentation",
        partyName: "Botivate",
      },
    ],
    completed: [
      {
        id: 20,
        title: "System Analysis",
        description: "Analyze system requirements",
        priority: "High",
        dueDate: "2023-12-30",
        completedDate: "2023-12-29",
        systemName: "Analysis",
        partyName: "Botivate",
      },
      {
        id: 21,
        title: "Process Documentation",
        description: "Document development processes",
        priority: "Low",
        dueDate: "2023-12-25",
        completedDate: "2023-12-24",
        systemName: "Process",
        partyName: "Botivate",
      },
    ],
  },
}

// Developer Stage Component
function DeveloperStage() {
  const [selectedDeveloper, setSelectedDeveloper] = useState(null)
  const [showDeveloperModal, setShowDeveloperModal] = useState(false)

  const developers = [
    {
      id: 1,
      name: "Satyendra",
      department: "Frontend Development",
      teamLeader: "Rahul Kumar",
      currentTasks: 3,
      completedTasks: 8,
      skills: ["React", "Vue.js", "CSS", "JavaScript"],
      status: "busy",
      timeSpent: "32h 15m",
      efficiency: 92,
    },
    {
      id: 2,
      name: "Chetan",
      department: "Backend Development",
      teamLeader: "Priya Sharma",
      currentTasks: 2,
      completedTasks: 12,
      skills: ["Node.js", "Python", "Database", "API"],
      status: "available",
      timeSpent: "28h 45m",
      efficiency: 88,
    },
    {
      id: 3,
      name: "Vikas",
      department: "QA & Testing",
      teamLeader: "Amit Singh",
      currentTasks: 4,
      completedTasks: 6,
      skills: ["Testing", "Automation", "Bug Tracking"],
      status: "busy",
      timeSpent: "24h 30m",
      efficiency: 95,
    },
  ]

  const handleViewDeveloper = (developer) => {
    setSelectedDeveloper(developer)
    setShowDeveloperModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Developer Stage</h2>
            <p className="text-gray-600">Track developer assignments and team leader hierarchy</p>
          </div>
          <Code className="w-6 h-6 text-blue-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((developer) => (
            <motion.div
              key={developer.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{developer.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{developer.name}</h3>
                    <p className="text-sm text-gray-600">{developer.department}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    developer.status === "busy" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}
                >
                  {developer.status}
                </span>
              </div>

              {/* Team Leader Info */}
              <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500">Team Leader</p>
                    <p className="text-sm font-medium text-gray-900">{developer.teamLeader}</p>
                  </div>
                </div>
              </div>

              {/* Task Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{developer.currentTasks}</p>
                  <p className="text-xs text-gray-500">Current Tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{developer.completedTasks}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>

              {/* Efficiency Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">Efficiency</span>
                  <span className="text-xs font-medium text-gray-900">{developer.efficiency}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                    style={{ width: `${developer.efficiency}%` }}
                  ></div>
                </div>
              </div>

              {/* Time Spent */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-500">Time Spent</span>
                <span className="text-xs font-medium text-gray-900">{developer.timeSpent}</span>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {developer.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {developer.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{developer.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleViewDeveloper(developer)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
              >
                View Details
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Developer Details Modal */}
      {showDeveloperModal && selectedDeveloper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{selectedDeveloper.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedDeveloper.name}</h2>
                    <p className="text-blue-100">{selectedDeveloper.department}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeveloperModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Team Hierarchy */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Team Hierarchy</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedDeveloper.teamLeader}</p>
                      <p className="text-xs text-gray-500">Team Leader</p>
                    </div>
                  </div>
                  <GitBranch className="w-4 h-4 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{selectedDeveloper.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedDeveloper.name}</p>
                      <p className="text-xs text-gray-500">Developer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <h4 className="font-medium text-gray-900">Current Tasks</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{selectedDeveloper.currentTasks}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium text-gray-900">Completed</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{selectedDeveloper.completedTasks}</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDeveloper.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Time & Efficiency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Time Spent</h4>
                  <p className="text-lg font-semibold text-gray-700">{selectedDeveloper.timeSpent}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Efficiency Rate</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: `${selectedDeveloper.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{selectedDeveloper.efficiency}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard({ onLogout, username }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [tasks, setTasks] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userModalTab, setUserModalTab] = useState("pending")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const tabs = [
    { id: "overview", label: "Dashboard", icon: BarChart3 },
    { id: "assign-task", label: "Assign Task", icon: Plus },
    { id: "tasks-table", label: "Tasks Table", icon: FileText },
    { id: "developer-stage", label: "Developer Stage", icon: Code },
    { id: "pending-tasks", label: "Pending Tasks", icon: Clock },
    { id: "completed-tasks", label: "Completed Tasks", icon: CheckCircle },
    { id: "troubleshoot", label: "Troubleshoot", icon: Settings },
    { id: "systems", label: "Systems List", icon: Activity },
  ]

  const stats = [
    {
      label: "Total Users",
      value: "6",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      change: "+2 this month",
      trend: "up",
    },
    {
      label: "Active Tasks",
      value: "23",
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      change: "+5 today",
      trend: "up",
    },
    {
      label: "Completed Today",
      value: "8",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      change: "+12% vs yesterday",
      trend: "up",
    },
    {
      label: "Pending Issues",
      value: "4",
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      change: "-2 resolved",
      trend: "down",
    },
  ]

  const handleTaskCreated = (newTasks) => {
    setTasks((prev) => [...prev, ...newTasks])
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
    setUserModalTab("pending")
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewContent users={mockUsers} stats={stats} activeTasks={mockActiveTasks} onViewUser={handleViewUser} />
        )
      case "assign-task":
        return <AssignTaskForm onTaskCreated={handleTaskCreated} />
      case "tasks-table":
        return <TasksTable tasks={tasks} />
      case "developer-stage":
        return <DeveloperStagePage />
      case "pending-tasks":
        return <TaskList type="pending" />
      case "completed-tasks":
        return <TaskList type="completed" />
      case "troubleshoot":
        return <TroubleShootPage />
      case "systems":
        return <SystemsList />
      default:
        return (
          <OverviewContent users={mockUsers} stats={stats} activeTasks={mockActiveTasks} onViewUser={handleViewUser} />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Enhanced Admin Dashboard
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Welcome back, {username}</span>
                  <span>•</span>
                  <span>{currentTime.toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-sm w-48"
                />
              </div>
              <Button
                onClick={onLogout}
                variant="outline"
                className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 min-h-screen shadow-sm">
          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-gray-100 hover:shadow-sm"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />}
                </motion.button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>

      {/* User Tasks Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{selectedUser.avatar}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUser.name}'s Tasks</h2>
                    <p className="text-blue-100">
                      {selectedUser.tasksCompleted}/{selectedUser.tasksAssigned} tasks completed •{" "}
                      {selectedUser.completionRate}% completion rate
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setUserModalTab("pending")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    userModalTab === "pending"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Pending Tasks</span>
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      {mockUserTasks[selectedUser.id]?.pending?.length || 0}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setUserModalTab("completed")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                    userModalTab === "completed"
                      ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed Tasks</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {mockUserTasks[selectedUser.id]?.completed?.length || 0}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {userModalTab === "pending" && (
                <div className="space-y-4">
                  {mockUserTasks[selectedUser.id]?.pending?.length > 0 ? (
                    mockUserTasks[selectedUser.id].pending.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-orange-50 border border-orange-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="w-4 h-4 text-orange-500" />
                              <h3 className="font-semibold text-gray-900">{task.title}</h3>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                              <div>
                                <span className="font-medium">System:</span> {task.systemName}
                              </div>
                              <div>
                                <span className="font-medium">Party:</span> {task.partyName}
                              </div>
                              <div>
                                <span className="font-medium">Due Date:</span>{" "}
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No pending tasks</p>
                    </div>
                  )}
                </div>
              )}
              {userModalTab === "completed" && (
                <div className="space-y-4">
                  {mockUserTasks[selectedUser.id]?.completed?.length > 0 ? (
                    mockUserTasks[selectedUser.id].completed.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <h3 className="font-semibold text-gray-900">{task.title}</h3>
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}
                              >
                                {task.priority}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                              <div>
                                <span className="font-medium">System:</span> {task.systemName}
                              </div>
                              <div>
                                <span className="font-medium">Party:</span> {task.partyName}
                              </div>
                              <div>
                                <span className="font-medium">Completed:</span>{" "}
                                {new Date(task.completedDate).toLocaleDateString()}
                              </div>
                              <div>
                                <span className="font-medium">Due Date:</span>{" "}
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No completed tasks</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function OverviewContent({ users, stats, activeTasks, onViewUser }) {
  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                <TrendingUp className={`w-3 h-3 mr-1 ${stat.trend === "down" ? "rotate-180" : ""}`} />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Analytics */}
      <DashboardCharts />

      {/* Active Tasks Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Active Tasks</h2>
              <p className="text-gray-600">Currently assigned tasks</p>
            </div>
            <Target className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activeTasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{task.name}</h3>
                  <p className="text-sm text-gray-600">Assigned to {task.assignedTo}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Team Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Team Overview</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Task
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tasks Given
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-medium text-sm">{user.avatar}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">Team Member</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.tasksCompleted}/{user.tasksAssigned}
                    </div>
                    <div className="text-xs text-gray-500">Completed/Total</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.currentTask}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.timeSpent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">{user.totalTasksGiven}</div>
                    <div className="text-xs text-gray-500">Total assigned</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                          style={{ width: `${user.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">{user.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === "busy" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
