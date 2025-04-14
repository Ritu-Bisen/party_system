"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./Context/AuthContext"
import { MessageSquare, Plus, Edit, Trash2, Save, X, Search, CheckCircle, AlertCircle } from "lucide-react"

const WhatsappTemplate = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [templates, setTemplates] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "active", // active or inactive
    message: "",
  })
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  })
  const [submitting, setSubmitting] = useState(false)

  // Add these new states for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState(null)

  // Google Sheet Details
  const sheetId = user?.sheetId || "1ghSQ9d2dfSotfnh8yrkiqIT00kg_ej7n0pnygzP0B9w"
  const scriptUrl =
    user?.appScriptUrl ||
    "https://script.google.com/macros/s/AKfycbx-5-79dRjYuTIBFjHTh3_Q8WQa0wWrRKm7ukq5854ET9OCHiAwno-gL1YmZ9juotMH/exec"
  const sheetName = "Whatsapp Temp" // Changed to match requested sheet name

  // Fetch templates from Google Sheet
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        console.log("Fetching WhatsApp templates from sheet:", sheetName)

        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`)
        }

        const text = await response.text()
        const jsonStart = text.indexOf("{")
        const jsonEnd = text.lastIndexOf("}")
        const jsonString = text.substring(jsonStart, jsonEnd + 1)
        const data = JSON.parse(jsonString)

        if (!data.table || !data.table.cols || data.table.cols.length === 0) {
          console.log("No data found in the sheet")
          setTemplates([])
          setLoading(false)
          return
        }

        let headers = []
        let allRows = data.table.rows || []

        if (data.table.cols && data.table.cols.some((col) => col.label)) {
          headers = data.table.cols.map((col, index) => ({
            id: `col${index}`,
            label: col.label || `Column ${index + 1}`,
            type: col.type || "string",
            originalIndex: index,
          }))
        } else if (allRows.length > 0 && allRows[0].c && allRows[0].c.some((cell) => cell && cell.v)) {
          headers = allRows[0].c.map((cell, index) => ({
            id: `col${index}`,
            label: cell && cell.v ? String(cell.v) : `Column ${index + 1}`,
            type: data.table.cols[index]?.type || "string",
            originalIndex: index,
          }))
          allRows = allRows.slice(1)
        }

        // Define column indexes (adjust these based on your actual sheet structure)
        const idIndex = 0 // Assuming column A is ID
        const nameIndex = 1 // Assuming column B is Template Name
        const typeIndex = 2 // Assuming column C is Type
        const messageIndex = 3 // Assuming column D is Message
        const createdAtIndex = 4 // Assuming column E is Created At
        const deletedIndex = 5 // Assuming column F is delete flag

        const templatesData = allRows
          .filter((row) => {
            // Skip deleted templates
            const isDeleted =
              row.c && row.c.length > deletedIndex && row.c[deletedIndex] && row.c[deletedIndex].v === "Yes"
            return !isDeleted && row.c && row.c.some((cell) => cell && cell.v)
          })
          .map((row, rowIndex) => {
            const templateData = {
              _rowIndex: rowIndex + 2, // +2 because of header row and 1-indexed
            }

            // Extract data from each cell
            if (row.c && row.c[idIndex] && row.c[idIndex].v) {
              templateData.id = String(row.c[idIndex].v)
            } else {
              templateData.id = `template-${Date.now()}-${rowIndex}`
            }

            if (row.c && row.c[nameIndex] && row.c[nameIndex].v) {
              templateData.name = String(row.c[nameIndex].v)
            } else {
              templateData.name = "Unnamed Template"
            }

            if (row.c && row.c[typeIndex] && row.c[typeIndex].v) {
              templateData.type = String(row.c[typeIndex].v).toLowerCase()
            } else {
              templateData.type = "active"
            }

            if (row.c && row.c[messageIndex] && row.c[messageIndex].v) {
              templateData.message = String(row.c[messageIndex].v)
            } else {
              templateData.message = ""
            }

            if (row.c && row.c[createdAtIndex] && row.c[createdAtIndex].v) {
              if (row.c[createdAtIndex].v.toString().indexOf("Date") === 0) {
                const dateString = row.c[createdAtIndex].v.toString()
                const dateParts = dateString.substring(5, dateString.length - 1).split(",")

                if (dateParts.length >= 3) {
                  const year = Number.parseInt(dateParts[0])
                  const month = Number.parseInt(dateParts[1]) + 1
                  const day = Number.parseInt(dateParts[2])

                  // Format as DD/MM/YYYY
                  templateData.createdAt = `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`
                } else {
                  templateData.createdAt = String(row.c[createdAtIndex].v)
                }
              } else {
                templateData.createdAt = String(row.c[createdAtIndex].v)
              }
            } else {
              templateData.createdAt = new Date().toLocaleDateString("en-GB") // Default to current date
            }

            return templateData
          })

        console.log("Fetched templates:", templatesData)
        setTemplates(templatesData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching templates:", error)
        setError("Failed to load WhatsApp templates")
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [sheetId, sheetName])

  // Handle adding a new template
  const handleAddTemplate = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Create a new template object
      const template = {
        id: `template-${Date.now()}`,
        name: newTemplate.name,
        type: newTemplate.type,
        message: newTemplate.message,
        createdAt: new Date().toLocaleDateString("en-GB"), // DD/MM/YYYY format
      }

      // Prepare data for Google Sheets
      const templateData = [
        template.id,
        template.name,
        template.type,
        template.message,
        template.createdAt,
        "No", // Not deleted
      ]

      // Send to Google Sheets
      const formData = new FormData()
      formData.append("sheetName", sheetName)
      formData.append("rowData", JSON.stringify(templateData))
      formData.append("action", "insert")

      const response = await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      })

      console.log("Template submitted to Google Sheets")

      // Add to templates list in UI
      setTemplates([{ ...template, _rowIndex: 2 }, ...templates.map((t) => ({ ...t, _rowIndex: t._rowIndex + 1 }))])

      // Reset form and close it
      setNewTemplate({
        name: "",
        type: "active",
        message: "",
      })
      setShowAddForm(false)

      // Show success notification
      setNotification({
        show: true,
        message: "Template added successfully!",
        type: "success",
      })

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 3000)
    } catch (error) {
      console.error("Error adding template:", error)

      // Show error notification
      setNotification({
        show: true,
        message: `Failed to add template: ${error.message}`,
        type: "error",
      })

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 5000)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle editing a template
  const handleEditClick = (template) => {
    setEditingTemplate({ ...template })
    setShowEditForm(true)
  }

  // Handle updating a template
  const handleUpdateTemplate = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const rowIndex = editingTemplate._rowIndex

      if (!rowIndex) {
        throw new Error("Could not determine the row index for updating this template")
      }

      // Prepare data for Google Sheets
      const templateData = [
        editingTemplate.id,
        editingTemplate.name,
        editingTemplate.type,
        editingTemplate.message,
        editingTemplate.createdAt,
        "No", // Not deleted
      ]

      // Send to Google Sheets
      const formData = new FormData()
      formData.append("sheetName", sheetName)
      formData.append("rowData", JSON.stringify(templateData))
      formData.append("rowIndex", rowIndex)
      formData.append("action", "update")

      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      })

      console.log("Template update submitted to Google Sheets")

      // Update the template in the list
      const updatedTemplates = templates.map((template) =>
        template.id === editingTemplate.id ? { ...editingTemplate } : template,
      )

      setTemplates(updatedTemplates)
      setShowEditForm(false)

      // Show success notification
      setNotification({
        show: true,
        message: "Template updated successfully!",
        type: "success",
      })

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 3000)
    } catch (error) {
      console.error("Error updating template:", error)

      // Show error notification
      setNotification({
        show: true,
        message: `Failed to update template: ${error.message}`,
        type: "error",
      })

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 5000)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle deleting a template (soft delete by marking deleted column)
  const handleDeleteClick = (template) => {
    setTemplateToDelete(template)
    setShowDeleteConfirm(true)
  }

  const handleDeleteTemplate = async () => {
    setSubmitting(true)

    try {
      if (!templateToDelete || !templateToDelete._rowIndex) {
        throw new Error("Could not determine the row index for deleting this template")
      }

      const rowIndex = templateToDelete._rowIndex

      // Find the delete column index (assuming it's column F = index 5+1 = 6)
      const deleteColumnIndex = 6 // Column F in 1-indexed for the API

      // Send soft delete to Google Sheets
      const formData = new FormData()
      formData.append("sheetName", sheetName)
      formData.append("rowIndex", rowIndex)
      formData.append("action", "markDeleted")
      formData.append("columnIndex", deleteColumnIndex)
      formData.append("value", "Yes")

      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      })

      console.log("Template deleted in Google Sheets")

      // Update UI
      const updatedTemplates = templates.filter((template) => template.id !== templateToDelete.id)
      setTemplates(updatedTemplates)

      // Close the confirmation popup
      setShowDeleteConfirm(false)
      setTemplateToDelete(null)

      // Show success notification
      setNotification({
        show: true,
        message: "Template deleted successfully!",
        type: "success",
      })

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 3000)
    } catch (error) {
      console.error("Error deleting template:", error)

      // Show error notification
      setNotification({
        show: true,
        message: `Failed to delete template: ${error.message}`,
        type: "error",
      })

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" })
      }, 5000)
    } finally {
      setSubmitting(false)
    }
  }

  // Filter templates based on search term
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">WhatsApp Templates</h2>

      {/* Search and Add Bar */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={18} />
          <span>Add Template</span>
        </button>
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500 mb-4"></div>
            <p className="text-purple-600">Loading templates...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            {error}{" "}
            <button className="underline ml-2" onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="text-purple-600" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            template.type === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md truncate">{template.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-purple-600 hover:text-purple-800 mr-3"
                          onClick={() => handleEditClick(template)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(template)}
                          disabled={submitting}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No templates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Template Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-purple-800">Add New Template</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowAddForm(false)}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddTemplate} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-purple-700">
                      Template Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-purple-700">
                      Template Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={newTemplate.type}
                      onChange={(e) => setNewTemplate({ ...newTemplate, type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-purple-700">
                      Message Template
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={newTemplate.message}
                      onChange={(e) => setNewTemplate({ ...newTemplate, message: e.target.value })}
                      className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                      placeholder="Use {name}, {date}, {time}, etc. as placeholders"
                      required
                    ></textarea>
                    <p className="mt-1 text-sm text-gray-500">
                      Use {"{name}"}, {"{date}"}, {"{time}"} as placeholders for dynamic content.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-purple-100">
                  <button
                    type="button"
                    className="px-4 py-2 border border-purple-300 rounded-md shadow-sm text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={() => setShowAddForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 flex items-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Template
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditForm && editingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-purple-800">Edit Template</h3>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowEditForm(false)}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateTemplate} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-purple-700">
                      Template Name
                    </label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-type" className="block text-sm font-medium text-purple-700">
                      Template Type
                    </label>
                    <select
                      id="edit-type"
                      name="type"
                      value={editingTemplate.type}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="edit-message" className="block text-sm font-medium text-purple-700">
                      Message Template
                    </label>
                    <textarea
                      id="edit-message"
                      name="message"
                      rows={6}
                      value={editingTemplate.message}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, message: e.target.value })}
                      className="mt-1 block w-full rounded-md border-blue-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                      placeholder="Use {name}, {date}, {time}, etc. as placeholders"
                      required
                    ></textarea>
                    <p className="mt-1 text-sm text-gray-500">
                      Use {"{name}"}, {"{date}"}, {"{time}"} as placeholders for dynamic content.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-purple-100">
                  <button
                    type="button"
                    className="px-4 py-2 border border-purple-300 rounded-md shadow-sm text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={() => setShowEditForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 flex items-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Update Template
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && templateToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 border border-red-100">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Template</h3>
              <p className="text-gray-600">
                Are you sure you want to delete the template "{templateToDelete.name}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setTemplateToDelete(null)
                }}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 flex items-center"
                onClick={handleDeleteTemplate}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} className="mr-2" />
                    Delete Template
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {notification.show && (
        <div
          className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
          ) : (
            <AlertCircle className="h-6 w-6 mr-3 text-red-600" />
          )}
          <p className="font-medium">{notification.message}</p>
          <button
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default WhatsappTemplate
