"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle, AlertTriangle, Eye, Edit, Trash2, Search } from "lucide-react"
import Button from "../ui/Button"

const mockTasks = [
  {
    id: 1,
    title: "Website Development",
    description: "Develop responsive website for client",
    assignedTo: "Satyendra",
    priority: "High",
    status: "pending",
    dueDate: "2024-01-15",
    createdDate: "2024-01-10",
    systemName: "Botivate Website",
    partyName: "Botivate",
  },
  {
    id: 2,
    title: "Database Optimization",
    description: "Optimize database queries for better performance",
    assignedTo: "Chetan",
    priority: "Medium",
    status: "completed",
    dueDate: "2024-01-12",
    createdDate: "2024-01-08",
    systemName: "CRM System",
    partyName: "Acemark Statiners",
  },
  {
    id: 3,
    title: "Bug Fix - Login Issue",
    description: "Fix login authentication bug",
    assignedTo: "Vikas",
    priority: "High",
    status: "pending",
    dueDate: "2024-01-14",
    createdDate: "2024-01-11",
    systemName: "User Portal",
    partyName: "AT Jwellers",
  },
  {
    id: 4,
    title: "UI Design Update",
    description: "Update user interface design",
    assignedTo: "Digendra",
    priority: "Low",
    status: "completed",
    dueDate: "2024-01-13",
    createdDate: "2024-01-09",
    systemName: "Dashboard",
    partyName: "Azure Interiors",
  },
  {
    id: 5,
    title: "Customer Support Integration",
    description: "Integrate WhatsApp API for customer support",
    assignedTo: "Pratap",
    priority: "Medium",
    status: "pending",
    dueDate: "2024-01-16",
    createdDate: "2024-01-12",
    systemName: "Communication Hub",
    partyName: "Botivate",
  },
]

export default function TaskList({ type = "all" }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [selectedTasks, setSelectedTasks] = useState(new Set())

  const filteredTasks = mockTasks.filter((task) => {
    const matchesType =
      type === "all" ||
      (type === "pending" && task.status === "pending") ||
      (type === "completed" && task.status === "completed") ||
      type === "user"

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = !filterPriority || task.priority === filterPriority
    const matchesStatus = !filterStatus || task.status === filterStatus

    return matchesType && matchesSearch && matchesPriority && matchesStatus
  })

  const handleTaskSelection = (taskId) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId)
    } else {
      newSelected.add(taskId)
    }
    setSelectedTasks(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set())
    } else {
      setSelectedTasks(new Set(filteredTasks.map((task) => task.id)))
    }
  }

  const handleSubmitTasks = () => {
    if (selectedTasks.size === 0) {
      alert("Please select at least one task to submit.")
      return
    }

    const selectedTaskTitles = filteredTasks
      .filter((task) => selectedTasks.has(task.id))
      .map((task) => task.title)
      .join(", ")

    alert(`Successfully submitted ${selectedTasks.size} task(s): ${selectedTaskTitles}`)
    setSelectedTasks(new Set())
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            {type === "all" && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button for Pending Tasks */}
      {type === "pending" && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTasks.size === filteredTasks.length && filteredTasks.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All ({selectedTasks.size} of {filteredTasks.length} selected)
                </span>
              </label>
            </div>
            <Button
              onClick={handleSubmitTasks}
              disabled={selectedTasks.size === 0}
              className={`${
                selectedTasks.size === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              } text-white`}
            >
              Submit Selected Tasks ({selectedTasks.size})
            </Button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No tasks found matching your criteria.</p>
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Checkbox for pending tasks */}
                  {type === "pending" && (
                    <div className="mt-1">
                      <input
                        type="checkbox"
                        checked={selectedTasks.has(task.id)}
                        onChange={() => handleTaskSelection(task.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(task.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{task.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Assigned to:</span>
                        <p>{task.assignedTo}</p>
                      </div>
                      <div>
                        <span className="font-medium">System:</span>
                        <p>{task.systemName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Party:</span>
                        <p>{task.partyName}</p>
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>
                        <p>{new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
