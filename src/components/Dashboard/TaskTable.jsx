"use client"

import { useState, useEffect } from "react"
import React from "react"
import { RefreshCw, AlertCircle, Clock, CheckCircle, Save, Users, History } from 'lucide-react'
import supabase from "../../supabaseClient"


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
    className={`flex-1 px-3 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors ${active
      ? `text-${color}-600 border-b-2 border-${color}-600 bg-${color}-50`
      : "text-gray-500 hover:text-gray-700"
      }`}
  >
    <div className="flex flex-col md:flex-row items-center justify-center md:space-x-2 space-y-1 md:space-y-0">
      <Icon className="w-4 h-4" />
      <span className="text-center leading-tight">{label}</span>
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
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2 w-full sm:w-auto"
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
        {options.slice(1).map(option => (   // 👈 header (first item) skip
          <option key={option} value={option}>
            {option}
          </option>
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




const API_CONFIG = {
  FETCH_URL: "https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=FMS&action=fetch",
  UPDATE_URL: "https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec",
  MASTER_SHEET_URL: "https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=Master%20Sheet%20Link&action=fetch"
}

const TABLE_COLUMNS = [
  { key: 'task_no', label: 'Task No', index: 1 },
  { key: 'given_date', label: 'Given Date', index: 2 },
  { key: 'posted_by', label: 'Posted By', index: 3 },
  { key: 'type_of_work', label: 'Type Of Work', index: 4 },
  { key: 'taken_from', label: 'Taken From', index: 5 },
  { key: 'party_name', label: 'Party Name', index: 6 },
  { key: 'system_name', label: 'System Name', index: 7 },
  { key: 'description_of_work', label: 'Description Of Work', index: 8 },
  { key: 'link_of_system', label: 'Link Of System', index: 9 },
  { key: 'attachment_file', label: 'Attachment File', index: 10 },
  { key: 'priority_in_customer', label: 'Priority In Customer', index: 11 },
  { key: 'notes', label: 'Notes', index: 12 },
  { key: 'expected_date_to_close', label: 'Expected Date To Close', index: 13 }
]
// Add this after the TABLE_COLUMNS constant and before the main component
const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}
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
  const [teamMembers, setTeamMembers] = useState([]) // Store team members from Master Sheet

  // ==================== API FUNCTIONS ====================
const fetchTeamMembers = async () => {
  try {
    const { data, error } = await supabase
      .from("dropdown")
      .select("member_name") // adjust to your actual column

    if (error) throw error

    const members = [...new Set(data.map(row => row.member_name).filter(Boolean))]
    setTeamMembers(members)
  } catch (err) {
    console.error("Error fetching team members:", err)
    // fallback dummy
    setTeamMembers(["Satyendra", "Chetan", "Vikas", "Digendra", "Pratap", "Rahul", "Priya", "Amit"])
  }
}



const transformSheetData = (rawData) => {
  const tasks = rawData.map((row, index) => {
    // ✅ Determine status directly from planned1 / actual1
    let status = "pending"
    if (row.planned1 && row.actual1) {
      status = "completed"
    } else if (row.planned1 && !row.actual1) {
      status = "pending"
    }

    return {
      id: row.id,
      status,

      // Direct Supabase field mappings
      planned1: row.planned1 || null,
      actual1: row.actual1 || null,
      team_member_name: row.team_member_name || "",
      how_many_time_take: row.how_many_time_take || "",
      remarks: row.remarks || "",

      // Other FMS fields

      task_no: row.task_no || "",
      given_date: row.given_date || "",
      posted_by: row.posted_by || "",
      type_of_work: row.type_of_work || "",
      taken_from:row.taken_from||"",
      party_name: row.party_name || "",
      system_name: row.system_name || "",
      description_of_work: row.description_of_work || "",
      link_of_system: row.link_of_system || "",
      attachment_file: row.attachment_file || "",
      priority_in_customer: row.priority_in_customer || "",
      notes: row.notes || "",
      expected_date_to_close: row.expected_date_to_close || ""
    }
  })

  // ✅ Sorting: assigned (planned1 but no actual1) first
  return tasks.sort((a, b) => {
    const aIsCurrentlyAssigned = a.planned1 && !a.actual1
    const bIsCurrentlyAssigned = b.planned1 && !b.actual1

    if (aIsCurrentlyAssigned && !bIsCurrentlyAssigned) return -1
    if (!aIsCurrentlyAssigned && bIsCurrentlyAssigned) return 1
    if (aIsCurrentlyAssigned && bIsCurrentlyAssigned) return b.id - a.id

    return b.id - a.id
  })
}


const filterTasksByStatus = (tasks, status) => {
  return tasks.filter(task => {
    if (status === "pending") {
      // planned1 filled, actual1 empty
      return task.planned1 && !task.actual1
    } else if (status === "completed") {
      // planned1 + actual1 both filled
      return task.planned1 && task.actual1
    } else if (status === "history") {
      // history shows tasks with any assignment details
      return task.team_member_name || task.how_many_time_take || task.remarks
    }
    return true // if no filter, return all
  })
}

  // ==================== API FUNCTIONS ====================
 const fetchTasksFromAPI = async () => {
  setLoading(true)
  setError(null)

  try {
    const { data, error } = await supabase
      .from("FMS")
      .select("*") // or only needed columns

    if (error) throw error

    const transformedTasks = transformSheetData(data) // 👈 you can reuse transformation
    setAllTasks(transformedTasks)
  } catch (err) {
    console.error("Error fetching tasks:", err)
    setError(err.message)
  } finally {
    setLoading(false)
  }
}


const submitTaskAssignment = async (task, formData) => {
  try {
    const submissionDate = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from("FMS")
      .update({
        team_member_name: formData.assignedMember,
        how_many_time_take: formData.timeRequired,
        remarks: formData.remarks,
        actual1: submissionDate,
      })
      .eq("task_no", task.task_no) // adjust if primary key is different

    if (error) throw error

    return { success: true, data }
  } catch (err) {
    console.error("Error updating task assignment:", err)
    return { success: false, error: err.message }
  }
}


  // ==================== EVENT HANDLERS ====================
const handleRefresh = () => {
  fetchTasksFromAPI()
  fetchTeamMembers()
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
    return !form?.assignedMember   // 👈 ab sirf member name required hai
  })

  if (incompleteTask) {
    alert("Please select Member Name for all selected tasks")
    return
  }

  setSubmitting(true)

  try {
    let successCount = 0
    let errorCount = 0

    // Process each selected task
    for (const taskId of selectedTasks) {
      try {
        const task = displayedTasks.find(t => t.task_no === taskId)
        const formData = assignmentForm[taskId] || {}

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
  fetchTeamMembers()
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
        <div className="p-4 md:p-6 border-b border-gray-200">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
            <div className="mb-4 md:mb-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Task Assignment System</h1>
              <p className="text-sm md:text-base text-gray-600">Assign tasks to team members efficiently</p>
            </div>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center justify-center space-x-2 w-full md:w-auto"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Task Status Tabs - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-4 md:mb-6">
            <div className="flex w-full">
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
          </div>

          {/* Submission Banner - Mobile Responsive */}
          {selectedTasks.size > 0 && (
            <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 md:w-5 h-4 md:h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm md:text-base text-blue-800 font-medium">
                    {selectedTasks.size} task(s) selected for assignment
                  </span>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <Save className="w-4 h-4" />
                  <span className="text-sm md:text-base">{submitting ? 'Submitting...' : 'Submit Assignments'}</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto relative" style={{ maxHeight: '70vh' }}>
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
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full">
                  {/* Table Header with sticky positioning */}
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      {/* Only show Select column for pending tab */}
                      {activeTab === "pending" && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                      )}
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
                      <tr key={task.task_no} className="hover:bg-gray-50">
                        {/* Checkbox - Only for pending tab */}
                        {activeTab === "pending" && (
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedTasks.has(task.task_no)}
                              onChange={(e) => handleCheckboxChange(task.task_no, e.target.checked)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                        )}

                        {/* Assignment Form Columns for Pending Tab */}
                        {activeTab === "pending" && (
                          <>
                            <td className="px-4 py-3">
                              {selectedTasks.has(task.task_no) ? (
                               <AssignmentInput
  type="select"
  value={assignmentForm[task.task_no]?.assignedMember || ''}
  onChange={(value) => handleFormChange(task.task_no, 'assignedMember', value)}
  options={teamMembers}
/>

                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {selectedTasks.has(task.task_no) ? (
                             <AssignmentInput
  type="text"
  value={assignmentForm[task.task_no]?.timeRequired || ''}
  onChange={(value) => handleFormChange(task.task_no, 'timeRequired', value)}
  placeholder="e.g., 2 hours"
/>
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {selectedTasks.has(task.task_no) ? (
                               <AssignmentInput
  type="text"
  value={assignmentForm[task.task_no]?.remarks || ''}
  onChange={(value) => handleFormChange(task.task_no, 'remarks', value)}
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
                                {task.team_member_name || '-'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-900">
                                {task.how_many_time_taken || '-'}
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
                            ) : column.key === 'attachmentFile' && task[column.key] ? (
                              <a
                                href={task[column.key]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Attachment File
                              </a>
                            ) : column.key === 'givenDate' || column.key === 'expectedDateToClose' ? (
                              formatDate(task[column.key])
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
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {displayedTasks.map((task) => (
                  <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    {/* Mobile Task Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {activeTab === "pending" && (
                          <input
                            type="checkbox"
                            checked={selectedTasks.has(task.task_no)}
                            onChange={(e) => handleCheckboxChange(task.id, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        )}
                        <h3 className="font-medium text-gray-900">Task #{task.taskNo}</h3>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(task.givenDate)}
                      </span>
                    </div>

                    {/* Mobile Assignment Section - Only for pending tab */}
                    {activeTab === "pending" && selectedTasks.has(task.task_no) && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Assign Member</label>
                          <AssignmentInput
                            type="select"
                            value={assignmentForm[task.id]?.assignedMember || ''}
                            onChange={(value) => handleFormChange(task.id, 'assignedMember', value)}
                            options={teamMembers}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Time Required</label>
                          <AssignmentInput
                            type="text"
                            value={assignmentForm[task.id]?.timeRequired || ''}
                            onChange={(value) => handleFormChange(task.id, 'timeRequired', value)}
                            placeholder="e.g., 2 hours"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                          <AssignmentInput
                            type="text"
                            value={assignmentForm[task.id]?.remarks || ''}
                            onChange={(value) => handleFormChange(task.id, 'remarks', value)}
                            placeholder="Add remarks"
                          />
                        </div>
                      </div>
                    )}

                    {/* Mobile Assignment History - Only for history tab */}
                    {activeTab === "history" && (task.assignedMember || task.timeRequired || task.remarks) && (
                      <div className="bg-green-50 rounded-lg p-3 mb-3">
                        <h4 className="text-xs font-medium text-green-800 mb-2">Assignment Details</h4>
                        <div className="space-y-1 text-xs text-green-700">
                          {task.assignedMember && <div><span className="font-medium">Member:</span> {task.assignedMember}</div>}
                          {task.timeRequired && <div><span className="font-medium">Time:</span> {task.timeRequired}</div>}
                          {task.remarks && <div><span className="font-medium">Remarks:</span> {task.remarks}</div>}
                        </div>
                      </div>
                    )}

                    {/* Mobile Task Details */}
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium text-gray-600">Posted By:</span> {task.postedBy}</div>
                      <div><span className="font-medium text-gray-600">Work Type:</span> {task.typeOfWork}</div>
                      <div><span className="font-medium text-gray-600">Party:</span> {task.partyName}</div>
                      <div><span className="font-medium text-gray-600">System:</span> {task.systemName}</div>
                      {task.descriptionOfWork && (
                        <div><span className="font-medium text-gray-600">Description:</span> {task.descriptionOfWork}</div>
                      )}
                      {task.expectedDateToClose && (
                        <div><span className="font-medium text-gray-600">Expected Close:</span> {formatDate(task.expectedDateToClose)}</div>
                      )}
                      {task.priorityInCustomer && (
                        <div><span className="font-medium text-gray-600">Priority:</span> {task.priorityInCustomer}</div>
                      )}
                      {task.notes && (
                        <div><span className="font-medium text-gray-600">Notes:</span> {task.notes}</div>
                      )}
                    </div>

                    {/* Mobile Links */}
                    <div className="flex space-x-4 mt-3 pt-3 border-t border-gray-100">
                      {task.linkOfSystem && (
                        <a
                          href={task.linkOfSystem}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          System Link
                        </a>
                      )}
                      {task.attachmentFile && (
                        <a
                          href={task.attachmentFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Attachment
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
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