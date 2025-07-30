"use client"

import React from "react"

import { useState } from "react"
import {
  Code,
  Users,
  Edit,
  Eye,
  Trash2,
  Search,
  Download,
  Clock,
  CheckCircle,
  X,
  Save,
  Target,
  Activity,
  ChevronDown,
  ChevronRight,
  Plus,
} from "lucide-react"

// Mock Button component
const Button = ({ children, variant = "default", className = "", ...props }) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
  }
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// Enhanced team structure with team leaders and their tasks
const teamLeaderTasks = [
  {
    id: 1,
    taskTitle: "E-commerce Website Development",
    description: "Complete e-commerce platform with payment integration and user management",
    teamLeader: "Rahul Kumar",
    department: "Frontend Development",
    priority: "High",
    status: "in-progress",
    stage: "development",
    dueDate: "2024-01-20",
    createdDate: "2024-01-10",
    estimatedHours: 80,
    completedHours: 45,
    assignedMembers: ["Satyendra", "Rahul"],
    availableMembers: [
      {
        id: 1,
        name: "Satyendra",
        role: "Senior Frontend Developer",
        skills: ["React", "Vue.js", "CSS", "JavaScript"],
        status: "busy",
        currentLoad: 75,
      },
      {
        id: 6,
        name: "Rahul",
        role: "Junior Frontend Developer",
        skills: ["React", "HTML", "CSS", "JavaScript"],
        status: "available",
        currentLoad: 40,
      },
    ],
    systemName: "E-commerce Platform",
    partyName: "TechMart Solutions",
    notes: "Client requires mobile-first approach with PWA capabilities",
  },
  {
    id: 2,
    taskTitle: "API Development & Database Design",
    description: "Design and implement RESTful APIs with optimized database structure",
    teamLeader: "Priya Sharma",
    department: "Backend Development",
    priority: "High",
    status: "pending",
    stage: "planning",
    dueDate: "2024-01-25",
    createdDate: "2024-01-12",
    estimatedHours: 60,
    completedHours: 15,
    assignedMembers: ["Chetan"],
    availableMembers: [
      {
        id: 2,
        name: "Chetan",
        role: "Backend Developer",
        skills: ["Node.js", "Python", "Database", "API"],
        status: "available",
        currentLoad: 60,
      },
      {
        id: 7,
        name: "Priya",
        role: "Senior Backend Developer",
        skills: ["Java", "Spring Boot", "Microservices"],
        status: "busy",
        currentLoad: 85,
      },
    ],
    systemName: "CRM Backend",
    partyName: "Business Solutions Inc",
    notes: "Focus on scalability and performance optimization",
  },
  {
    id: 3,
    taskTitle: "Mobile App Testing & QA",
    description: "Comprehensive testing of mobile application across different devices and platforms",
    teamLeader: "Amit Singh",
    department: "QA & Testing",
    priority: "Medium",
    status: "pending",
    stage: "testing",
    dueDate: "2024-01-18",
    createdDate: "2024-01-08",
    estimatedHours: 40,
    completedHours: 20,
    assignedMembers: ["Vikas"],
    availableMembers: [
      {
        id: 3,
        name: "Vikas",
        role: "QA Engineer",
        skills: ["Testing", "Automation", "Bug Tracking"],
        status: "busy",
        currentLoad: 70,
      },
      {
        id: 8,
        name: "Amit",
        role: "Mobile Developer",
        skills: ["React Native", "Flutter", "iOS", "Android"],
        status: "available",
        currentLoad: 50,
      },
    ],
    systemName: "Mobile Testing Suite",
    partyName: "AppTech Solutions",
    notes: "Include performance testing and security validation",
  },
  {
    id: 4,
    taskTitle: "UI/UX Design System",
    description: "Create comprehensive design system with components and style guide",
    teamLeader: "Digendra Patel",
    department: "UI/UX Design",
    priority: "Medium",
    status: "completed",
    stage: "completed",
    dueDate: "2024-01-15",
    createdDate: "2024-01-05",
    estimatedHours: 50,
    completedHours: 50,
    assignedMembers: ["Digendra"],
    availableMembers: [
      {
        id: 4,
        name: "Digendra",
        role: "UI/UX Designer",
        skills: ["Figma", "Adobe XD", "Design Systems"],
        status: "available",
        currentLoad: 30,
      },
    ],
    systemName: "Design System",
    partyName: "Creative Agency",
    notes: "Design system successfully implemented and documented",
  },
  {
    id: 5,
    taskTitle: "Cloud Infrastructure Setup",
    description: "Setup and configure cloud infrastructure with CI/CD pipelines",
    teamLeader: "Pratap Kumar",
    department: "DevOps & Infrastructure",
    priority: "High",
    status: "in-progress",
    stage: "development",
    dueDate: "2024-01-22",
    createdDate: "2024-01-14",
    estimatedHours: 35,
    completedHours: 20,
    assignedMembers: ["Pratap"],
    availableMembers: [
      {
        id: 5,
        name: "Pratap",
        role: "DevOps Engineer",
        skills: ["AWS", "Docker", "CI/CD", "Monitoring"],
        status: "busy",
        currentLoad: 80,
      },
    ],
    systemName: "Cloud Infrastructure",
    partyName: "Enterprise Solutions",
    notes: "Focus on security and scalability requirements",
  },
]

const taskStages = [
  { id: "planning", label: "Planning", color: "bg-blue-100 text-blue-800" },
  { id: "development", label: "Development", color: "bg-purple-100 text-purple-800" },
  { id: "testing", label: "Testing", color: "bg-yellow-100 text-yellow-800" },
  { id: "review", label: "Review", color: "bg-orange-100 text-orange-800" },
  { id: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
]

export default function DeveloperStagePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  const filteredTasks = teamLeaderTasks.filter((task) => {
    const matchesSearch =
      task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.teamLeader.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !filterDepartment || task.department === filterDepartment
    const matchesStatus = !filterStatus || task.status === filterStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const toggleRowExpansion = (taskId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedRows(newExpanded)
  }

  const handleEditClick = (task) => {
    setEditingTask(task)
    setEditFormData({
      taskTitle: task.taskTitle,
      description: task.description,
      teamLeader: task.teamLeader,
      department: task.department,
      priority: task.priority,
      status: task.status,
      stage: task.stage,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      completedHours: task.completedHours,
      assignedMembers: [...task.assignedMembers],
      systemName: task.systemName,
      partyName: task.partyName,
      notes: task.notes,
    })
    setIsEditModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setEditingTask(null)
    setEditFormData({})
  }

  const handleFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMemberAssignment = (memberName, isAssigned) => {
    setEditFormData((prev) => {
      const newAssignedMembers = isAssigned
        ? [...prev.assignedMembers, memberName]
        : prev.assignedMembers.filter((name) => name !== memberName)
      return {
        ...prev,
        assignedMembers: newAssignedMembers,
      }
    })
  }

  const handleSaveTask = () => {
    console.log("Saving task with assignments:", editFormData)
    handleCloseModal()
    alert("Task assignments updated successfully!")
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStageColor = (stage) => {
    const stageInfo = taskStages.find((s) => s.id === stage)
    return stageInfo ? stageInfo.color : "bg-gray-100 text-gray-800"
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "in-progress":
        return <Activity className="w-4 h-4 text-blue-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getWorkloadColor = (load) => {
    if (load >= 80) return "bg-red-100 text-red-800"
    if (load >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const uniqueDepartments = [...new Set(teamLeaderTasks.map((task) => task.department))]

  // Calculate stats
  const totalTasks = teamLeaderTasks.length
  const pendingTasks = teamLeaderTasks.filter((task) => task.status === "pending").length
  const inProgressTasks = teamLeaderTasks.filter((task) => task.status === "in-progress").length
  const completedTasks = teamLeaderTasks.filter((task) => task.status === "completed").length

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{pendingTasks}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                <Code className="w-8 h-8 text-blue-500" />
                <span>Developer Stage - Team Leader Tasks</span>
              </h1>
              <p className="text-gray-600">Manage team leader tasks and assign team members</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Team Task
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks, team leaders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Task Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Leader
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority & Stage
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Members
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleRowExpansion(task.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {expandedRows.has(task.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(task.status)}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{task.taskTitle}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                            <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                              {task.department}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{task.teamLeader}</div>
                          <div className="text-xs text-gray-500">Team Leader</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                        <br />
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStageColor(task.stage)}`}
                        >
                          {taskStages.find((s) => s.id === task.stage)?.label || task.stage}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {task.assignedMembers.slice(0, 2).map((member, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">{member.charAt(0)}</span>
                            </div>
                            <span className="text-sm text-gray-900">{member}</span>
                          </div>
                        ))}
                        {task.assignedMembers.length > 2 && (
                          <div className="text-xs text-gray-500">+{task.assignedMembers.length - 2} more</div>
                        )}
                        <div className="text-xs text-blue-600">{task.assignedMembers.length} assigned</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                task.status === "completed"
                                  ? "bg-gradient-to-r from-green-400 to-green-600"
                                  : "bg-gradient-to-r from-blue-400 to-purple-500"
                              }`}
                              style={{ width: `${(task.completedHours / task.estimatedHours) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">
                            {Math.round((task.completedHours / task.estimatedHours) * 100)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {task.completedHours}h / {task.estimatedHours}h
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">
                        {Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(task)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(task.id) && (
                    <tr className="bg-gray-50">
                      <td colSpan="7" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">System Name:</span>
                            <p className="text-gray-600">{task.systemName}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Party Name:</span>
                            <p className="text-gray-600">{task.partyName}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Created Date:</span>
                            <p className="text-gray-600">{new Date(task.createdDate).toLocaleDateString()}</p>
                          </div>
                          <div className="md:col-span-2 lg:col-span-3">
                            <span className="font-medium text-gray-700">Notes:</span>
                            <p className="text-gray-600 mt-1">{task.notes}</p>
                          </div>
                          <div className="md:col-span-2 lg:col-span-3">
                            <span className="font-medium text-gray-700">Available Team Members:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {task.availableMembers.map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center space-x-2 bg-white rounded-lg p-2 border border-gray-200"
                                >
                                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">{member.name.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-gray-900">{member.name}</p>
                                    <p className="text-xs text-gray-500">{member.role}</p>
                                  </div>
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${getWorkloadColor(member.currentLoad)}`}
                                  >
                                    {member.currentLoad}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>

      {/* Edit Task & Assign Members Modal */}
      {isEditModalOpen && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Edit Task & Assign Team Members</h2>
                  <p className="text-sm text-gray-600">Update task details and manage team member assignments</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Task Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>

                    {/* Task Title */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                      <input
                        type="text"
                        value={editFormData.taskTitle || ""}
                        onChange={(e) => handleFormChange("taskTitle", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter task title"
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={editFormData.description || ""}
                        onChange={(e) => handleFormChange("description", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter task description"
                      />
                    </div>

                    {/* Team Leader Info */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Team Leader</label>
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{editFormData.teamLeader}</p>
                          <p className="text-xs text-gray-600">{editFormData.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Priority & Status */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select
                          value={editFormData.priority || ""}
                          onChange={(e) => handleFormChange("priority", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="High">High Priority</option>
                          <option value="Medium">Medium Priority</option>
                          <option value="Low">Low Priority</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={editFormData.status || ""}
                          onChange={(e) => handleFormChange("status", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                      <input
                        type="date"
                        value={editFormData.dueDate || ""}
                        onChange={(e) => handleFormChange("dueDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Hours */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                        <input
                          type="number"
                          value={editFormData.estimatedHours || ""}
                          onChange={(e) => handleFormChange("estimatedHours", Number.parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Completed Hours</label>
                        <input
                          type="number"
                          value={editFormData.completedHours || ""}
                          onChange={(e) => handleFormChange("completedHours", Number.parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          max={editFormData.estimatedHours || undefined}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Team Member Assignment */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Member Assignment</h3>

                    {/* Currently Assigned Members */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Currently Assigned ({editFormData.assignedMembers?.length || 0})
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {editFormData.assignedMembers?.map((memberName, index) => {
                          const memberInfo = editingTask.availableMembers.find((m) => m.name === memberName)
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">{memberName.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{memberName}</p>
                                  <p className="text-xs text-gray-600">{memberInfo?.role || "Team Member"}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleMemberAssignment(memberName, false)}
                                className="text-red-600 hover:text-red-800 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        })}
                        {(!editFormData.assignedMembers || editFormData.assignedMembers.length === 0) && (
                          <p className="text-sm text-gray-500 italic">No members assigned yet</p>
                        )}
                      </div>
                    </div>

                    {/* Available Team Members */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Available Team Members</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {editingTask.availableMembers?.map((member) => {
                          const isAssigned = editFormData.assignedMembers?.includes(member.name)
                          return (
                            <div
                              key={member.id}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                isAssigned
                                  ? "bg-gray-100 border-gray-300 opacity-50"
                                  : "bg-blue-50 border-blue-200 hover:bg-blue-100"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-medium">{member.name.charAt(0)}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                  <p className="text-xs text-gray-600">{member.role}</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${getWorkloadColor(member.currentLoad)}`}
                                    >
                                      {member.currentLoad}% load
                                    </span>
                                    <span
                                      className={`px-2 py-1 text-xs rounded-full ${
                                        member.status === "available"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {member.status}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {member.skills.slice(0, 3).map((skill, skillIndex) => (
                                      <span
                                        key={skillIndex}
                                        className="px-1 py-0.5 text-xs bg-gray-200 text-gray-700 rounded"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleMemberAssignment(member.name, !isAssigned)}
                                disabled={isAssigned}
                                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                                  isAssigned
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                              >
                                {isAssigned ? "Assigned" : "Assign"}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Visualization */}
              {editFormData.estimatedHours > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Task Progress</h4>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-4">
                      <div
                        className="h-4 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(((editFormData.completedHours || 0) / (editFormData.estimatedHours || 1)) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600 min-w-[60px]">
                      {Math.round(((editFormData.completedHours || 0) / (editFormData.estimatedHours || 1)) * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {editFormData.completedHours || 0}h completed of {editFormData.estimatedHours || 0}h estimated
                  </p>
                </div>
              )}

              {/* Notes */}
              <div className="border-t border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes & Comments</label>
                <textarea
                  value={editFormData.notes || ""}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add notes or comments about the task..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button variant="outline" onClick={handleCloseModal} className="px-6 bg-transparent">
                Cancel
              </Button>
              <Button
                onClick={handleSaveTask}
                className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
