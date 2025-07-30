"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, User, Building, FileText, Link, Paperclip, AlertCircle, Plus, X } from "lucide-react"
import Button from "../ui/Button"

const postedByOptions = ["Satyendra", "Chetan", "Digendra", "Pratap", "Vikas", "Tuleshwar"]

const partyNames = [
  "Acemark Statiners",
  "AT Jwellers",
  "AT PLUS",
  "Azra",
  "Azure Interiors",
  "Botivate",
  "Chandan Trading",
  "Delight Agrico",
  "Divine Empire",
  "Divya Exports",
  "Gotmefit",
  "H3epicura",
  "House Of sansa",
  "Icy Spicy",
  "Iron tailor",
  "Jainx",
  "JJSPL",
  "Mamta Super Speciality Hospital",
  "Modern Orthodontics",
  "Pahlajani's",
  "Passary Minerals",
  "Piramal Petroleum Private Limited",
  "Pune Wines",
  "Rama Udyog",
  "RBP ENGERY",
  "Refrasynth",
  "Rigga Industries",
  "Rn Creations",
  "Sankalp Homes",
  "Saurabh Rolling Mills Pvt Ltd",
  "Sbh Hospital",
  "Shady Studios",
  "Shankar Hardware",
  "Shyama Dairy",
  "Ska Ispat",
  "SKA LLP",
  "The Madbakers",
  "THIRUBALA CHEMICALS PRIVATE LIMITED",
  "Vaswani Industries",
]

const workTypes = ["Existing System Edit & Update", "New System", "Error Received", "Complain Report"]

export default function AssignTaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    date: "",
    postedBy: "",
    takenFrom: "",
    partyName: "",
    typeOfWork: "",
    systemName: "",
    description: "",
    link: "",
    attachment: null,
    priority: "",
    notes: "",
    expectedDate: "",
  })

  const [additionalTasks, setAdditionalTasks] = useState([])
  const [showAdditionalSection, setShowAdditionalSection] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      attachment: e.target.files[0],
    }))
  }

  const addAdditionalTask = () => {
    setAdditionalTasks([
      ...additionalTasks,
      {
        id: Date.now(),
        typeOfWork: "",
        systemName: "",
        description: "",
        link: "",
        priority: "",
        notes: "",
        expectedDate: "",
      },
    ])
  }

  const removeAdditionalTask = (id) => {
    setAdditionalTasks(additionalTasks.filter((task) => task.id !== id))
  }

  const updateAdditionalTask = (id, field, value) => {
    setAdditionalTasks(additionalTasks.map((task) => (task.id === id ? { ...task, [field]: value } : task)))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.postedBy) newErrors.postedBy = "Posted By is required"
    if (!formData.partyName) newErrors.partyName = "Party Name is required"
    if (!formData.typeOfWork) newErrors.typeOfWork = "Type of Work is required"
    if (!formData.systemName) newErrors.systemName = "System Name is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (!formData.expectedDate) newErrors.expectedDate = "Expected Date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // First fetch the last task number from the sheet
        const fetchResponse = await fetch(
          'https://script.google.com/macros/s/AKfycbzehX6dSdiSpAWd9LGoG-bgthpt4o85HUEGvvPJhV6mX6FoyoQKiXrzh83Y-xYaAKd0/exec?sheet=FMS&action=fetch',
          {
            method: 'GET'
          }
        );
  
        const sheetData = await fetchResponse.json();
        let lastTaskNumber = 0;
  
        if (sheetData.success && sheetData.data.length > 1) {
          // Find the last non-empty task number
          for (let i = sheetData.data.length - 1; i >= 1; i--) {
            const taskCell = sheetData.data[i][1]; // Column B (index 1) contains task numbers
            if (taskCell && taskCell.startsWith('TK-')) {
              const num = parseInt(taskCell.split('-')[1]);
              if (!isNaN(num)) {
                lastTaskNumber = num;
                break;
              }
            }
          }
        }
  
        // Generate new task numbers
        const allTasks = [formData, ...additionalTasks].map((task, index) => {
          const taskNumber = `TK-${String(lastTaskNumber + index + 1).padStart(3, '0')}`;
          const currentDate = new Date();
          
          return {
            ...task,
            id: `task-${Date.now()}-${index}`,
            createdAt: currentDate.toISOString(),
            timestamp: currentDate.toLocaleString(), // Localized timestamp
            taskNumber: taskNumber,
            status: "pending",
          };
        });
  
        // Prepare data for submission to Google Sheets
        const submissionData = allTasks.map(task => ({
          timestamp: task.timestamp, // Column A - current timestamp
          taskNumber: task.taskNumber, // Column B - generated task number
          date: formData.date, // Add this line to include the selected date
          postedBy: task.postedBy,
          typeOfWork: task.typeOfWork,
          takenFrom: task.takenFrom,
          partyName: task.partyName,
          systemName: task.systemName,
          description: task.description,
          link: task.link,
          attachment: task.attachment ? task.attachment.name : '',
          priority: task.priority,
          notes: task.notes,
          expectedDate: task.expectedDate,
          // status: task.status,
          // createdAt: task.createdAt
        }));
  
        // Submit each task to Google Sheets
        for (const task of submissionData) {
          const response = await fetch(
            'https://script.google.com/macros/s/AKfycbzehX6dSdiSpAWd9LGoG-bgthpt4o85HUEGvvPJhV6mX6FoyoQKiXrzh83Y-xYaAKd0/exec',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                sheetName: 'FMS',
                action: 'insert',
                rowData: JSON.stringify([
                  task.timestamp, // Column A - timestamp
                  task.taskNumber, // Column B - task number
                  task.date,  
                  task.postedBy,
                  task.typeOfWork,
                  task.takenFrom,
                  task.partyName,
                  task.systemName,
                  task.description,
                  task.link,
                  task.attachment,
                  task.priority,
                  task.notes,
                  task.expectedDate,
                  // task.status,
                  // task.createdAt
                ])
              })
            }
          );
  
          if (!response.ok) {
            throw new Error('Failed to submit data to Google Sheets');
          }
        }
  
        console.log("Tasks submitted:", allTasks);
        if (onTaskCreated) {
          onTaskCreated(allTasks);
        }
  
        alert(`${allTasks.length} task(s) assigned successfully with numbers: ${allTasks.map(t => t.taskNumber).join(', ')}!`);
  
        // Reset form
        setFormData({
          date: "",
          postedBy: "",
          typeOfWork: "",
          takenFrom: "",
          partyName: "",
          systemName: "",
          description: "",
          link: "",
          attachment: null,
          priority: "",
          notes: "",
          // expectedDate: "",
        });
        setAdditionalTasks([]);
        setShowAdditionalSection(false);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit tasks. Please try again.");
      }
    }
  };

  const handleShowAdditionalSection = () => {
    if (!showAdditionalSection) {
      setShowAdditionalSection(true)
      addAdditionalTask()
    } else {
      setShowAdditionalSection(false)
      setAdditionalTasks([])
    }
  }

  const renderTaskForm = (task, index, isMain = false) => (
    <div
      key={isMain ? "main" : task.id}
      className={`${isMain ? "" : "bg-gray-50 border border-gray-200 rounded-lg p-6 relative"}`}
    >
      {!isMain && (
        <button
          type="button"
          onClick={() => removeAdditionalTask(task.id)}
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className={`${!isMain ? "pr-8" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type of Work */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type of Work {isMain && <span className="text-red-500">*</span>}
            </label>
            <select
              name={isMain ? "typeOfWork" : ""}
              value={isMain ? formData.typeOfWork : task.typeOfWork}
              onChange={(e) =>
                isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "typeOfWork", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isMain && errors.typeOfWork ? "border-red-300" : "border-gray-300"
              }`}
            >
              <option value="">Select Type of Work</option>
              {workTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {isMain && errors.typeOfWork && <p className="mt-1 text-sm text-red-600">{errors.typeOfWork}</p>}
          </div>

          {/* System Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Name {isMain && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name={isMain ? "systemName" : ""}
              value={isMain ? formData.systemName : task.systemName}
              onChange={(e) =>
                isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "systemName", e.target.value)
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isMain && errors.systemName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter system name"
            />
            {isMain && errors.systemName && <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>}
          </div>

          {/* Link of System */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link of System</label>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                name={isMain ? "link" : ""}
                value={isMain ? formData.link : task.link}
                onChange={(e) =>
                  isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "link", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority in Customer</label>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name={isMain ? "priority" : ""}
                value={isMain ? formData.priority : task.priority}
                onChange={(e) =>
                  isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "priority", e.target.value)
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Expected Date */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Date to Close {isMain && <span className="text-red-500">*</span>}
            </label>
            <div className="relative max-w-md">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                name={isMain ? "expectedDate" : ""}
                value={isMain ? formData.expectedDate : task.expectedDate}
                onChange={(e) =>
                  isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "expectedDate", e.target.value)
                }
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isMain && errors.expectedDate ? "border-red-300" : "border-gray-300"
                }`}
              />
            </div>
            {isMain && errors.expectedDate && <p className="mt-1 text-sm text-red-600">{errors.expectedDate}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description Of Work {isMain && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              name={isMain ? "description" : ""}
              value={isMain ? formData.description : task.description}
              onChange={(e) =>
                isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "description", e.target.value)
              }
              rows={4}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isMain && errors.description ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Describe the work to be done..."
            />
          </div>
          {isMain && errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            name={isMain ? "notes" : ""}
            value={isMain ? formData.notes : task.notes}
            onChange={(e) => (isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "notes", e.target.value))}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes or comments..."
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Assign New Task</h2>
              <p className="text-gray-600">Create and assign tasks to team members</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Main Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? "border-red-300" : "border-gray-300"
                  }`}
                />
              </div>
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            {/* Posted By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posted By <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="postedBy"
                  value={formData.postedBy}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.postedBy ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Posted By</option>
                  {postedByOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {errors.postedBy && <p className="mt-1 text-sm text-red-600">{errors.postedBy}</p>}
            </div>

            {/* Taken From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taken From <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="takenFrom"
                  value={formData.takenFrom}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Taken From</option>
                  {postedByOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Party Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Party Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="partyName"
                  value={formData.partyName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.partyName ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Party Name</option>
                  {partyNames.map((party) => (
                    <option key={party} value={party}>
                      {party}
                    </option>
                  ))}
                </select>
              </div>
              {errors.partyName && <p className="mt-1 text-sm text-red-600">{errors.partyName}</p>}
            </div>

            {/* Attachment */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachment File</label>
              <div className="relative">
                <Paperclip className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Main Task Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Primary Task Details</h3>
            </div>
            {renderTaskForm(formData, 0, true)}
          </div>

          {/* Additional Tasks Section */}
          <AnimatePresence>
            {showAdditionalSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Tasks</h3>
                  <Button
                    type="button"
                    onClick={addAdditionalTask}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Another Task
                  </Button>
                </div>
                {additionalTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {renderTaskForm(task, index + 1)}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <Button
                type="button"
                onClick={handleShowAdditionalSection}
                variant="outline"
                className="bg-transparent border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showAdditionalSection ? "Hide" : "Add"} Additional Tasks
              </Button>
            </div>
            <div className="flex space-x-4">
              <Button type="button" variant="outline" className="px-6 py-3 bg-transparent">
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Add Task{additionalTasks.length > 0 ? `s (${additionalTasks.length + 1})` : ""}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
