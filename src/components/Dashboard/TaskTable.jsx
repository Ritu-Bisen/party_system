"use client"

import { useState, useEffect } from "react"
import React from "react"
import { RefreshCw, AlertCircle, Clock, CheckCircle, Save, Users, History } from 'lucide-react'

// ==================== COMPONENTS ====================

const Button = ({ children, variant = "default", className = "", disabled = false, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400"
  }
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className} ${disabled ? 'cursor-not-allowed' : ''}`} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const StatsCard = ({ title, count, description, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{count}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <div className={`w-12 h-12 bg-gradient-to-r ${color === 'text-orange-600' ? 'from-orange-500 to-red-600' : color === 'text-purple-600' ? 'from-purple-500 to-indigo-600' : 'from-green-500 to-emerald-600'} rounded-lg flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
)

const LoadingIndicator = ({ message }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div className="flex items-center space-x-2">
      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      <span className="text-blue-800">{message}</span>
    </div>
  </div>
)

const ErrorMessage = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center space-x-2">
      <AlertCircle className="w-4 h-4 text-red-600" />
      <span className="text-red-800">Error: {error}</span>
    </div>
  </div>
)

const TabButton = ({ active, onClick, icon: Icon, label, count, color }) => (
  <button
    onClick={onClick}
    className={`flex-1 max-w-xs px-6 py-3 text-sm font-medium transition-colors ${
      active
        ? `text-${color}-600 border-b-2 border-${color}-600 bg-${color}-50`
        : "text-gray-500 hover:text-gray-700"
    }`}
  >
    <div className="flex items-center justify-center space-x-2">
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      <span className={`bg-${color}-100 text-${color}-800 text-xs px-2 py-1 rounded-full`}>
        {count}
      </span>
    </div>
  </button>
)

const SubmissionBanner = ({ selectedCount, onSubmit, submitting }) => (
  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Users className="w-5 h-5 text-blue-600" />
        <span className="text-blue-800 font-medium">
          {selectedCount} task(s) selected for assignment
        </span>
      </div>
      <Button 
        onClick={onSubmit}
        disabled={submitting}
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>{submitting ? 'Submitting...' : 'Submit Assignments'}</span>
      </Button>
    </div>
  </div>
)

const AssignmentInput = ({ type, value, onChange, placeholder, options = [] }) => {
  if (type === 'select') {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select Member</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    )
  }
  
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
    />
  )
}

// ==================== CONSTANTS ====================

const TEAM_MEMBERS = [
  "Satyendra", "Chetan", "Vikas", "Digendra", 
  "Pratap", "Rahul", "Priya", "Amit"
]

const API_CONFIG = {
  FETCH_URL: "https://script.google.com/macros/s/AKfycbzehX6dSdiSpAWd9LGoG-bgthpt4o85HUEGvvPJhV6mX6FoyoQKiXrzh83Y-xYaAKd0/exec?sheet=FMS&action=fetch",
  UPDATE_URL: "https://script.google.com/macros/s/AKfycbzehX6dSdiSpAWd9LGoG-bgthpt4o85HUEGvvPJhV6mX6FoyoQKiXrzh83Y-xYaAKd0/exec"
}

const TABLE_COLUMNS = [
  { key: 'taskNo', label: 'Task No', index: 1 },
  { key: 'givenDate', label: 'Given Date', index: 2 },
  { key: 'postedBy', label: 'Posted By', index: 3 },
  { key: 'typeOfWork', label: 'Type Of Work', index: 4 },
  { key: 'takenFrom', label: 'Taken From', index: 5 },
  { key: 'partyName', label: 'Party Name', index: 6 },
  { key: 'systemName', label: 'System Name', index: 7 },
  { key: 'descriptionOfWork', label: 'Description Of Work', index: 8 },
  { key: 'linkOfSystem', label: 'Link Of System', index: 9 },
  { key: 'attachmentFile', label: 'Attachment File', index: 10 },
  { key: 'priorityInCustomer', label: 'Priority In Customer', index: 11 },
  { key: 'notes', label: 'Notes', index: 12 },
  { key: 'expectedDateToClose', label: 'Expected Date To Close', index: 13 }
]

// ==================== MAIN COMPONENT ====================

export default function TaskAssignmentSystem() {
  // ==================== STATE ====================
  const [allTasks, setAllTasks] = useState([]) // Store ALL tasks here
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedTasks, setSelectedTasks] = useState(new Set())
  const [assignmentForm, setAssignmentForm] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // ==================== DATA TRANSFORMATION ====================
  const transformSheetData = (rawData) => {
    const dataRows = rawData.slice(6) // Skip first 6 rows (header is in row 6)
    
    return dataRows.map((row, index) => {
      const columnO = row[14] // Column O - Assignment indicator
      const columnP = row[15] // Column P - Completion date
      
      // Determine status based on column conditions
      let status = "pending"
      if (columnO && columnP) {
        status = "completed"
      } else if (columnO && !columnP) {
        status = "pending"
      }
      
      // Transform row data to task object
      const task = {
        id: index + 1,
        rowNumber: index + 7, // Actual sheet row number
        status: status,
        columnO: columnO,
        columnP: columnP
      }
      
      // Map columns to task properties
      TABLE_COLUMNS.forEach(column => {
        task[column.key] = row[column.index] || ""
      })
      
      // Assignment fields (columns R, S, T) - FETCH EXISTING DATA
      task.assignedMember = row[17] || ""  // Column R
      task.timeRequired = row[18] || ""    // Column S
      task.remarks = row[19] || ""         // Column T
      
      return task
    })
  }

  const filterTasksByStatus = (tasks, status) => {
    return tasks.filter(task => {
      if (status === "pending") {
        return task.columnO && !task.columnP
      } else if (status === "completed") {
        return task.columnO && task.columnP
      } else if (status === "history") {
        // History shows tasks that have assignment data (R, S, T columns filled)
        return task.assignedMember || task.timeRequired || task.remarks
      }
      return true
    })
  }

  // ==================== API FUNCTIONS ====================
  const fetchTasksFromAPI = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(API_CONFIG.FETCH_URL)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success && Array.isArray(data.data)) {
        const transformedTasks = transformSheetData(data.data)
        setAllTasks(transformedTasks) // Store ALL tasks
      } else {
        throw new Error(data.message || "Failed to fetch data")
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const submitTaskAssignment = async (task, formData) => {
    const submissionDate = new Date().toISOString().split('T')[0]
    console.log(`Submitting assignment for task: ${task.taskNo}`)
    
    const formDataToSend = new FormData()
    formDataToSend.append('sheetName', 'FMS')
    formDataToSend.append('action', 'update_task_assignment')
    formDataToSend.append('taskNo', task.taskNo)
    formDataToSend.append('assignedMember', formData.assignedMember)
    formDataToSend.append('timeRequired', formData.timeRequired)
    formDataToSend.append('remarks', formData.remarks)
    formDataToSend.append('submissionDate', submissionDate)

    const response = await fetch(API_CONFIG.UPDATE_URL, {
      method: 'POST',
      body: formDataToSend
    })

    return await response.json()
  }

  // ==================== EVENT HANDLERS ====================
  const handleRefresh = () => {
    fetchTasksFromAPI()
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSelectedTasks(new Set())
    setAssignmentForm({})
  }

  const handleCheckboxChange = (taskId, checked) => {
    const newSelected = new Set(selectedTasks)
    if (checked) {
      newSelected.add(taskId)
    } else {
      newSelected.delete(taskId)
      const newForm = { ...assignmentForm }
      delete newForm[taskId]
      setAssignmentForm(newForm)
    }
    setSelectedTasks(newSelected)
  }

  const handleFormChange = (taskId, field, value) => {
    setAssignmentForm(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }))
  }

  const handleSubmit = async () => {
    // Validation
    if (selectedTasks.size === 0) {
      alert("Please select at least one task to assign")
      return
    }

    const incompleteTask = Array.from(selectedTasks).find(taskId => {
      const form = assignmentForm[taskId]
      return !form?.assignedMember || !form?.timeRequired || !form?.remarks
    })

    if (incompleteTask) {
      alert("Please fill all fields (Member, Time Required, Remarks) for selected tasks")
      return
    }

    setSubmitting(true)
    
    try {
      let successCount = 0
      let errorCount = 0
      
      // Process each selected task
      for (const taskId of selectedTasks) {
        try {
          const task = displayedTasks.find(t => t.id === taskId)
          const formData = assignmentForm[taskId]
          
          const result = await submitTaskAssignment(task, formData)
          
          if (result.success) {
            successCount++
          } else {
            errorCount++
            console.error(`Failed to update task ${task.taskNo}:`, result.error)
          }
          
        } catch (taskError) {
          errorCount++
          console.error(`Error updating task ${taskId}:`, taskError)
        }
      }
      
      // Show results
      if (successCount > 0 && errorCount === 0) {
        alert(`Successfully assigned ${successCount} task(s)!`)
      } else if (successCount > 0 && errorCount > 0) {
        alert(`Assigned ${successCount} task(s) successfully, but ${errorCount} failed. Check console for details.`)
      } else {
        throw new Error(`Failed to assign all ${errorCount} task(s)`)
      }
      
      // Reset and refresh
      setSelectedTasks(new Set())
      setAssignmentForm({})
      fetchTasksFromAPI()
      
    } catch (err) {
      console.error("Error submitting assignments:", err)
      alert("Error submitting assignments: " + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchTasksFromAPI()
  }, []) // Only fetch once when component mounts

  // ==================== COMPUTED VALUES ====================
  const displayedTasks = filterTasksByStatus(allTasks, activeTab) // Filter for current tab
  const pendingCount = filterTasksByStatus(allTasks, "pending").length
  const historyCount = filterTasksByStatus(allTasks, "history").length

  // ==================== RENDER ====================
  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="Pending Tasks"
          count={pendingCount}
          description="Ready for assignment"
          icon={Clock}
          color="text-orange-600"
        />
        <StatsCard
          title="Assignment History"
          count={historyCount}
          description="Tasks with assignment data"
          icon={History}
          color="text-purple-600"
        />
      </div>

      {/* Loading and Error States */}
      {loading && <LoadingIndicator message="Fetching data from Google Sheets..." />}
      {error && <ErrorMessage error={error} />}

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Assignment System</h1>
              <p className="text-gray-600">Assign tasks to team members efficiently</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Task Status Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <TabButton
              active={activeTab === "pending"}
              onClick={() => handleTabChange("pending")}
              icon={Clock}
              label="Pending Assignment"
              count={pendingCount}
              color="orange"
            />
            <TabButton
              active={activeTab === "history"}
              onClick={() => handleTabChange("history")}
              icon={History}
              label="Assignment History"
              count={historyCount}
              color="purple"
            />
          </div>

          {/* Submission Banner */}
          {selectedTasks.size > 0 && (
            <SubmissionBanner
              selectedCount={selectedTasks.size}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto">
          {loading ? (
            /* Loading State for Table */
            <div className="text-center py-16">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">Loading {activeTab === "pending" ? "Pending Tasks" : "Assignment History"}...</h3>
                  <p className="text-gray-500">Fetching data from Google Sheets</p>
                </div>
              </div>
            </div>
          ) : (
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                  {activeTab === "pending" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assign Member</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Required</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                    </>
                  )}
                  {activeTab === "history" && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Member</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Required</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                    </>
                  )}
                  {TABLE_COLUMNS.map(column => (
                    <th key={column.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      {activeTab === "pending" && (
                        <input
                          type="checkbox"
                          checked={selectedTasks.has(task.id)}
                          onChange={(e) => handleCheckboxChange(task.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      )}
                    </td>
                    
                    {/* Assignment Form Columns for Pending Tab */}
                    {activeTab === "pending" && (
                      <>
                        <td className="px-4 py-3">
                          {selectedTasks.has(task.id) ? (
                            <AssignmentInput
                              type="select"
                              value={assignmentForm[task.id]?.assignedMember || ''}
                              onChange={(value) => handleFormChange(task.id, 'assignedMember', value)}
                              options={TEAM_MEMBERS}
                            />
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {selectedTasks.has(task.id) ? (
                            <AssignmentInput
                              type="text"
                              value={assignmentForm[task.id]?.timeRequired || ''}
                              onChange={(value) => handleFormChange(task.id, 'timeRequired', value)}
                              placeholder="e.g., 2 hours"
                            />
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {selectedTasks.has(task.id) ? (
                            <AssignmentInput
                              type="text"
                              value={assignmentForm[task.id]?.remarks || ''}
                              onChange={(value) => handleFormChange(task.id, 'remarks', value)}
                              placeholder="Add remarks"
                            />
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                      </>
                    )}

                    {/* Assignment History Columns for History Tab */}
                    {activeTab === "history" && (
                      <>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900 font-medium">
                            {task.assignedMember || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {task.timeRequired || '-'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900 max-w-xs truncate block">
                            {task.remarks || '-'}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Data Columns */}
                    {TABLE_COLUMNS.map(column => (
                      <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                        {column.key === 'linkOfSystem' && task[column.key] ? (
                          <a 
                            href={task[column.key]} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline"
                          >
                            Link
                          </a>
                        ) : column.key === 'descriptionOfWork' || column.key === 'notes' ? (
                          <span className="max-w-xs truncate block">{task[column.key]}</span>
                        ) : (
                          task[column.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Empty State */}
        {displayedTasks.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === "history" ? (
                <History className="w-8 h-8 text-gray-400" />
              ) : (
                <Clock className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {activeTab === "pending" 
                ? "No tasks pending assignment" 
                : "No assignment history found"}
            </p>
            <Button 
              onClick={handleRefresh} 
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Refresh Data
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}