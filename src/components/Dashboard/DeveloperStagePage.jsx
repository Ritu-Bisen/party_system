"use client"

import React, { useState, useEffect } from "react";
import {
  Code, Users, Search, Download, Clock,
  CheckCircle, Target, Activity, History,
  RefreshCw, AlertCircle, Save, Plus, Calendar, Clock as ClockIcon
} from "lucide-react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import supabase from "../../supabaseClient";

// Button component
const Button = ({ children, variant = "default", className = "", disabled = false, ...props }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-400",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 disabled:bg-gray-100",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-400",
  };
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className} ${disabled ? 'cursor-not-allowed' : ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Loading and Error Components
const LoadingIndicator = ({ message }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <div className="flex items-center space-x-2">
      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
      <span className="text-blue-800">{message}</span>
    </div>
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center space-x-2">
      <AlertCircle className="w-4 h-4 text-red-600" />
      <span className="text-red-800">Error: {error}</span>
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label, count, color }) => (
  <button
    onClick={onClick}
    className={`flex-1 max-w-xs px-6 py-3 text-sm font-medium transition-colors ${active
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
);

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
);

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
    );
  }

  if (type === 'datetime') {
    return (
      <div className="relative">
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={(date) => onChange(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          placeholderText="Select date and time"
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <ClockIcon className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
    />
  );
};

// Stats Card Component
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
);

// Table Columns Configuration
// Table Columns Configuration - UPDATED TO MATCH YOUR SCREENSHOT
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
];

const API_CONFIG = {
  FETCH_URL: "https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=FMS&action=fetch",
  MASTER_SHEET_URL: "https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=Master Sheet Link&action=fetch",
  UPDATE_URL: "https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec"
};

// Helper function to format date as DD/MM/YYYY HH:MM
const formatDateTime = (dateString) => {
  if (!dateString) return '';

  // If already in correct format, return as-is
  if (typeof dateString === 'string' && dateString.match(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/)) {
    return dateString;
  }

  // If it's a Date object or ISO string
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Return original if invalid date

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function DeveloperStagePage() {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPostedBy, setFilterPostedBy] = useState("all");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [assignmentForm, setAssignmentForm] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [uniquePostedBy, setUniquePostedBy] = useState([]);
  const [teamMembers1, setTeamMembers1] = useState([]);
  const [teamMembers2, setTeamMembers2] = useState([]);
  const [masterSheetMembers, setMasterSheetMembers] = useState([]);





  // Fetch members from Master Sheet Link
 const fetchMasterSheetMembers = async () => {
  try {
    const { data, error } = await supabase
      .from("dropdown")           // your table name
      .select("member_name");     // column with member names

    if (error) {
      throw error;
    }

    if (Array.isArray(data)) {
      // Remove empty values and duplicates
      const members = data
        .map(row => row.member_name)
        .filter(member => member && member.trim() !== "");

      const uniqueMembers = [...new Set(members)];
      setMasterSheetMembers(uniqueMembers);
      return uniqueMembers;
    }

    return [];
  } catch (err) {
    console.error("Error fetching members from Supabase:", err);
    return [];
  }
};

  // Data transformation function
const transformSheetData = (rawData, masterMembers = []) => {
  if (!rawData || !Array.isArray(rawData)) {
    return { tasks: [], teamMembers1: [], teamMembers2: [] };
  }

  if (rawData.length === 0) {
    console.log("No task data found");
    return { tasks: [], teamMembers1: [], teamMembers2: [] };
  }

  const tasks = rawData.map((row, index) => {
    if (!row) return null;

    const plannedDate = row.planned1 || row.planned2;
    const actualDate = row.actual1 || row.actual2;

    let status = "pending";
    if (plannedDate && actualDate) {
      status = "completed";
    } else if (plannedDate && !actualDate) {
      status = "assigned";
    }

    return {
      id: index + 1,
      rowNumber: index + 2,
      taskNo: row.task_no || "",
      givenDate: formatDateTime(row.given_date),
      postedBy: row.posted_by || "",
      typeOfWork: row.type_of_work || "",
      takenFrom: row.taken_from || "",
      partyName: row.party_name || "",
      systemName: row.system_name || "",
      descriptionOfWork: row.description_of_work || "",
      linkOfSystem: row.link_of_system || "",
      attachmentFile: row.attachment_file || "",
      priorityInCustomer: row.priority_in_customer || "Medium",
      notes: row.notes || "",
      expectedDateToClose: formatDateTime(row.expected_date_to_close),

      planned2: formatDateTime(row.planned2),
      actual2: formatDateTime(row.actual2),
      assignedMember1: row.employee_name_1 || "",
      assignedMember2: row.employee_name_2 || "",
      timeRequired: row.how_many_time_take || "",
      remarks: row.remarks || "",

      status: row.status || status,
      priority: row.priority_in_customer || "Medium",
      isReassigned: false,
      originalAssignee: row.employee_name_1 || "",
    };
  }).filter(task => task !== null && task.taskNo);

  // ✅ Instead of membersX/membersY, use masterMembers for both
  const teamMembers1 = masterMembers;
  const teamMembers2 = masterMembers;

  const sortedTasks = tasks.sort((a, b) => {
    const aIsAssignedPending = a.planned2 && !a.actual2;
    const bIsAssignedPending = b.planned2 && !b.actual2;

    if (aIsAssignedPending && !bIsAssignedPending) return -1;
    if (!aIsAssignedPending && bIsAssignedPending) return 1;
    return b.id - a.id;
  });

  return { tasks: sortedTasks, teamMembers1, teamMembers2 };
};



  // Fetch data from Google Sheets
const fetchTasksFromAPI = async () => {
  setLoading(true);
  setError(null);

  try {
    const { data: tasksData, error: tasksError } = await supabase
      .from("FMS")
      .select("*");

    if (tasksError) throw tasksError;

    // ✅ Fetch full members list
    const masterMembers = await fetchMasterSheetMembers();

    if (!Array.isArray(tasksData)) {
      throw new Error("Invalid tasks data from Supabase");
    }

    console.log("Raw data from Supabase:", tasksData);

    // ✅ Pass masterMembers into transform
    const { tasks, teamMembers1, teamMembers2 } = transformSheetData(tasksData, masterMembers);

    setAllTasks(tasks);
    setTeamMembers1(teamMembers1);
    setTeamMembers2(teamMembers2);

    const pending = tasks.filter(item => item.planned2 && !item.actual2);
    const history = tasks.filter(item => item.planned2 && item.actual2);

    setPendingData(pending);
    setHistoryData(history);

    const postedByValues = [...new Set(tasks.map(item => item.postedBy).filter(Boolean))];
    setUniquePostedBy(postedByValues);

  } catch (err) {
    console.error("Error fetching tasks:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


// Add this useEffect to debug your data flow
useEffect(() => {
  console.log("All tasks:", allTasks);
  console.log("Pending data:", pendingData);
  console.log("History data:", historyData);
}, [allTasks, pendingData, historyData]);


  // Submit task assignment
const submitTaskAssignment = async () => {
  if (selectedTasks.size === 0) {
    toast.error("Please select at least one task to assign");
    return;
  }

  // Validation: check required fields
  const incompleteTask = Array.from(selectedTasks).find(taskId => {
    const form = assignmentForm[taskId];
    return !form?.assignedMember1 ||
      (form?.days === undefined && form?.hours === undefined) ||
      !form?.remarks;
  });

  if (incompleteTask) {
    toast.error("Please fill all fields (Member1, Days/Hours, Remarks) for selected tasks");
    return;
  }

  setSubmitting(true);

  try {
    let successCount = 0;
    let errorCount = 0;

    for (const taskId of selectedTasks) {
      const task = allTasks.find(t => t.id === taskId); // Find by id
      const formData = assignmentForm[taskId];

      const days = formData.days !== undefined ? parseInt(formData.days) : 0;
      const hours = formData.hours !== undefined ? parseInt(formData.hours) : 0;
      const totalHours = (days * 24) + hours;

      // ✅ Supabase expects ISO string for date columns
      const submissionDate = new Date().toISOString().split("T")[0];

      try {
        const { error } = await supabase
          .from("FMS")
          .update({
            employee_name_1: formData.assignedMember1 || "",
            employee_name_2: formData.assignedMember2 || "",
            how_many_time_take_2: totalHours.toString(),
            remarks_2: formData.remarks,
            actual2: submissionDate, 
            posted_by: task.postedBy || null
          })
          .eq("task_no", task.taskNo); // Use task_no for the database query

        if (error) {
          console.error(`Error updating task ${task.taskNo}:`, error.message);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (taskError) {
        console.error(`Exception updating task ${task.taskNo}:`, taskError);
        errorCount++;
      }
    }

    // ✅ Show results
    if (successCount > 0) {
      toast.success(`Successfully assigned ${successCount} task(s)!`);
      setSelectedTasks(new Set());
      setAssignmentForm({});
      fetchTasksFromAPI(); // refresh list
    }

    if (errorCount > 0) {
      toast.error(`${errorCount} task(s) failed to update.`);
    }
  } catch (err) {
    console.error("Error submitting assignments:", err);
    toast.error("Error submitting assignments: " + err.message);
  } finally {
    setSubmitting(false);
  }
};


  // Handle task completion with date+time
  const handleTaskCompletion = async (taskId) => {
    try {
      setLoading(true);
      const task = allTasks.find(t => t.id === taskId);
      if (!task) return;

      const currentDateTime = formatDateTime(new Date());

      const formData = new FormData();
      formData.append('sheetName', 'FMS');
      formData.append('action', 'update_task_completion');
      formData.append('taskNo', task.taskNo);
      formData.append('actual2', currentDateTime);

      const response = await fetch(API_CONFIG.UPDATE_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to update task');

      // Update local state
      setAllTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, actual2: currentDateTime } : t
        )
      );

      toast.success("Task marked as completed!");
      fetchTasksFromAPI();
    } catch (err) {
      console.error("Error completing task:", err);
      toast.error("Error completing task: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks
  const filteredPendingData = pendingData.filter(item => {
    const matchesSearch = item.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.taskNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.postedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.systemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descriptionOfWork?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPostedBy = filterPostedBy === 'all' || item.postedBy === filterPostedBy;
    return matchesSearch && matchesPostedBy;
  });

  const filteredHistoryData = historyData.filter(item => {
    const matchesSearch = item.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.taskNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.postedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.systemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descriptionOfWork?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPostedBy = filterPostedBy === 'all' || item.postedBy === filterPostedBy;
    return matchesSearch && matchesPostedBy;
  });

  const displayedTasks = activeTab === 'pending' ? filteredPendingData : filteredHistoryData;

  // Calculate stats
  const totalTasks = allTasks.length;
  const pendingTasks = pendingData.length;
  const historyTasks = historyData.length;

  // Handle refresh
  const handleRefresh = () => {
    fetchTasksFromAPI();
  };

  // Initial data fetch
  useEffect(() => {
    fetchTasksFromAPI();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchTasksFromAPI, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleRowExpansion = (taskId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedRows(newExpanded);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedTasks(new Set());
    setAssignmentForm({});
  };

  const handleCheckboxChange = (taskId, checked) => {
    const newSelected = new Set(selectedTasks);
    if (checked) {
      newSelected.add(taskId);
    } else {
      newSelected.delete(taskId);
      const newForm = { ...assignmentForm };
      delete newForm[taskId];
      setAssignmentForm(newForm);
    }
    setSelectedTasks(newSelected);
  };

  const handleAssignmentFormChange = (taskId, field, value) => {
    setAssignmentForm(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Tasks"
          count={totalTasks}
          description="All tasks in system"
          icon={Target}
          color="text-blue-600"
        />
        <StatsCard
          title="Pending Tasks"
          count={pendingTasks}
          description="Ready for assignment"
          icon={Clock}
          color="text-orange-600"
        />
        <StatsCard
          title="History Tasks"
          count={historyTasks}
          description="Completed assignments"
          icon={History}
          color="text-purple-600"
        />
      </div>

      {/* Loading and Error States */}
      {loading && <LoadingIndicator message="Refreshing task data..." />}
      {error && <ErrorMessage error={error} />}

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
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks, party name, system name, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterPostedBy}
              onChange={(e) => setFilterPostedBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Posted By</option>
              {uniquePostedBy.map(postedBy => (
                <option key={postedBy} value={postedBy}>{postedBy}</option>
              ))}
            </select>
          </div>

          {/* Task Status Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <TabButton
              active={activeTab === "pending"}
              onClick={() => handleTabChange("pending")}
              icon={Clock}
              label="Pending"
              count={pendingTasks}
              color="orange"
            />
            <TabButton
              active={activeTab === "history"}
              onClick={() => handleTabChange("history")}
              icon={History}
              label="History"
              count={historyTasks}
              color="purple"
            />
          </div>

          {/* Submission Banner */}
          {selectedTasks.size > 0 && (
            <SubmissionBanner
              selectedCount={selectedTasks.size}
              onSubmit={submitTaskAssignment}
              submitting={submitting}
            />
          )}
        </div>

        {/* Tasks Table */}
        <div className="overflow-x-auto relative" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {loading ? (
            <div className="text-center py-16">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">Loading Tasks...</h3>
                  <p className="text-gray-500">Refreshing task data</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                    <tr>
                      {/* Only show Select column for pending tab */}
                      {activeTab === "pending" && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Select</th>
                      )}
                      {activeTab === "pending" && (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assign Member1</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assign Member2</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Required</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                        </>
                      )}
                      {activeTab === "history" && (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Member1</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Member2</th>
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

                  <tbody className="bg-white divide-y divide-gray-200">
                    {displayedTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        {/* Checkbox - Only for pending tab */}
                       {activeTab === "pending" && (
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selectedTasks.has(task.id)} // Use task.id here
          onChange={(e) => handleCheckboxChange(task.id, e.target.checked)} // Use task.id here
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </td>
    )}

                      {activeTab === "pending" && (
      <>
        <td className="px-4 py-3">
          {selectedTasks.has(task.id) ? ( // Use task.id here
            <AssignmentInput
              type="select"
              value={assignmentForm[task.id]?.assignedMember1 || ''} // Use task.id here
              onChange={(value) => handleAssignmentFormChange(task.id, 'assignedMember1', value)} // Use task.id here
              options={teamMembers1}
            />
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </td>
        <td className="px-4 py-3">
          {selectedTasks.has(task.id) ? ( // Use task.id here
            <AssignmentInput
              type="select"
              value={assignmentForm[task.id]?.assignedMember2 || ''} // Use task.id here
              onChange={(value) => handleAssignmentFormChange(task.id, 'assignedMember2', value)} // Use task.id here
              options={teamMembers2}
            />
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </td>
        <td className="px-4 py-3">
          {selectedTasks.has(task.id) ? ( // Use task.id here
            <div className="flex gap-2">
              <select
                className="w-20 px-2 py-2 text-sm border rounded-md"
                value={assignmentForm[task.id]?.days ?? ''} // Use task.id here
                onChange={(e) => handleAssignmentFormChange(task.id, 'days', e.target.value)} // Use task.id here
              >
                <option value="">Days</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i}>{i}d</option>
                ))}
              </select>

              <select
                className="w-20 px-2 py-2 text-sm border rounded-md"
                value={assignmentForm[task.id]?.hours ?? ''} // Use task.id here
                onChange={(e) => handleAssignmentFormChange(task.id, 'hours', e.target.value)} // Use task.id here
              >
                <option value="">Hours</option>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i}h</option>
                ))}
              </select>
            </div>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </td>
        <td className="px-4 py-3">
          {selectedTasks.has(task.id) ? ( // Use task.id here
            <AssignmentInput
              type="text"
              value={assignmentForm[task.id]?.remarks || ''} // Use task.id here
              onChange={(value) => handleAssignmentFormChange(task.id, 'remarks', value)} // Use task.id here
              placeholder="Add remarks"
            />
          )  :(
            <span className="text-sm text-gray-400">-</span>
          )}
                            </td>
                          </>
                        )}

                        {activeTab === "history" && (
                          <>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-900 font-medium">
                                {task.assignedMember1 || '-'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-900 font-medium">
                                {task.assignedMember2 || '-'}
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
                                File
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
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden">
                <div className="space-y-4 p-4">
                  {displayedTasks.map((task) => (
                    <div key={task.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      {/* Checkbox for pending tab */}
                      {activeTab === "pending" && (
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            checked={selectedTasks.has(task.id)}
                            onChange={(e) => handleCheckboxChange(task.id, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                          />
                          <span className="text-sm font-medium text-gray-900">Select for Assignment</span>
                        </div>
                      )}

                      {/* Task Details from TABLE_COLUMNS */}
                      <div className="space-y-3 mb-4">
                        {TABLE_COLUMNS.map(column => (
                          <div key={column.key}>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">{column.label}</div>
                            <div className="text-sm text-gray-900 mt-1">
                              {column.key === 'linkOfSystem' && task[column.key] ? (
                                <a
                                  href={task[column.key]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View Link
                                </a>
                              ) : column.key === 'attachmentFile' && task[column.key] ? (
                                <a
                                  href={task[column.key]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View File
                                </a>
                              ) : column.key === 'descriptionOfWork' || column.key === 'notes' ? (
                                <span className="break-words">{task[column.key] || '-'}</span>
                              ) : (
                                task[column.key] || '-'
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Assignment Section for Pending Tab */}
                      {activeTab === "pending" && selectedTasks.has(task.id) && (
                        <div className="border-t border-gray-200 pt-4">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Assignment Details</div>
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider">Assign Member 1</label>
                              <AssignmentInput
                                type="select"
                                value={assignmentForm[task.id]?.assignedMember1 || ''}
                                onChange={(value) => handleAssignmentFormChange(task.id, 'assignedMember1', value)}
                                options={teamMembers1}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider">Assign Member 2</label>
                              <AssignmentInput
                                type="select"
                                value={assignmentForm[task.id]?.assignedMember2 || ''}
                                onChange={(value) => handleAssignmentFormChange(task.id, 'assignedMember2', value)}
                                options={teamMembers2}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider">Time Required</label>
                              <div className="flex gap-2 mt-1">
                                <select
                                  className="flex-1 px-3 py-2 text-sm border rounded-md"
                                  value={assignmentForm[task.id]?.days ?? ''}
                                  onChange={(e) => handleAssignmentFormChange(task.id, 'days', e.target.value)}
                                >
                                  <option value="">Days</option>
                                  {Array.from({ length: 31 }, (_, i) => (
                                    <option key={i} value={i}>{i}d</option>
                                  ))}
                                </select>
                                <select
                                  className="flex-1 px-3 py-2 text-sm border rounded-md"
                                  value={assignmentForm[task.id]?.hours ?? ''}
                                  onChange={(e) => handleAssignmentFormChange(task.id, 'hours', e.target.value)}
                                >
                                  <option value="">Hours</option>
                                  {Array.from({ length: 24 }, (_, i) => (
                                    <option key={i} value={i}>{i}h</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 uppercase tracking-wider">Remarks</label>
                              <AssignmentInput
                                type="text"
                                value={assignmentForm[task.id]?.remarks || ''}
                                onChange={(value) => handleAssignmentFormChange(task.id, 'remarks', value)}
                                placeholder="Add remarks"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Assignment Display for History Tab */}
                      {activeTab === "history" && (
                        <div className="border-t border-gray-200 pt-4">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Assignment Details</div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Member 1</div>
                              <div className="text-gray-900 font-medium">{task.assignedMember1 || '-'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Member 2</div>
                              <div className="text-gray-900 font-medium">{task.assignedMember2 || '-'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Time Required</div>
                              <div className="text-gray-900">{task.timeRequired || '-'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">Remarks</div>
                              <div className="text-gray-900 break-words">{task.remarks || '-'}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                ? "No pending tasks found"
                : "No historical tasks found"}
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
  );
}