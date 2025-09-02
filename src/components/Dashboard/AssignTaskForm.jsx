// "use client"
// import { useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Calendar, User, Building, FileText, Link, Paperclip, AlertCircle, Plus, X } from "lucide-react"
// import Button from "../ui/Button"

// const postedByOptions = [
//   "Satyendra",
//    "Chetan", 
//    "Digendra", 
//    "Pratap", 
//    "Vikas", 
//    "Tuleshwar"
//   ]

// const partyNames = [
//   "Acemark Statiners",
//   "AT Jwellers",
//   "AT PLUS",
//   "Azra",
//   "Azure Interiors",
//   "Botivate",
//   "Chandan Trading",
//   "Delight Agrico",
//   "Divine Empire",
//   "Divya Exports",
//   "Gotmefit",
//   "H3epicura",
//   "House Of sansa",
//   "Icy Spicy",
//   "Iron tailor",
//   "Jainx",
//   "JJSPL",
//   "Mamta Super Speciality Hospital",
//   "Modern Orthodontics",
//   "Pahlajani's",
//   "Passary Minerals",
//   "Piramal Petroleum Private Limited",
//   "Pune Wines",
//   "Rama Udyog",
//   "RBP ENGERY",
//   "Refrasynth",
//   "Rigga Industries",
//   "Rn Creations",
//   "Sankalp Homes",
//   "Saurabh Rolling Mills Pvt Ltd",
//   "Sbh Hospital",
//   "Shady Studios",
//   "Shankar Hardware",
//   "Shyama Dairy",
//   "Ska Ispat",
//   "SKA LLP",
//   "The Madbakers",
//   "THIRUBALA CHEMICALS PRIVATE LIMITED",
//   "Vaswani Industries",
// ]

// const workTypes = [
//   "Existing System Edit & Update", 
//   "New System",
//    "Error Received", 
//    "Complain Report"
//   ]

// // File upload utility function - Updated to work with your existing Google Apps Script
// const uploadFileToGoogleDrive = async (file, taskNumber) => {
//   if (!file) return '';

//   try {
//     // Convert file to base64
//     const fileBase64 = await new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//     const response = await fetch(
//       'https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           action: 'uploadFile',
//           fileName: `${taskNumber}_${file.name}`,
//           fileData: fileBase64,
//           mimeType: file.type,
//           taskNumber: taskNumber
//         })
//       }
//     );

//     const result = await response.json();
//     if (result.success) {
//       return result.fileUrl; // Return the Google Drive file URL
//     } else {
//       console.error('File upload failed:', result.error);
//       return `Error uploading: ${file.name}`;
//     }
//   } catch (error) {
//     console.error('File upload error:', error);
//     return `Error uploading: ${file.name}`;
//   }
// };

// export default function AssignTaskForm({ onTaskCreated, userRole = "admin" }) {
//   const [formData, setFormData] = useState({
//     date: "",
//     postedBy: "",
//     takenFrom: "",
//     partyName: "",
//     typeOfWork: "",
//     systemName: "",
//     description: "",
//     link: "",
//     attachment: null,
//     priority: "",
//     notes: "",
//     expectedDate: "",
//     personName: "", // For company login
//   })

//   const [additionalTasks, setAdditionalTasks] = useState([])
//   const [showAdditionalSection, setShowAdditionalSection] = useState(false)
//   const [errors, setErrors] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState('')

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//     console.log(prev)
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }))
//     }
//   }

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Check file size (limit to 10MB)
//       if (file.size > 10 * 1024 * 1024) {
//         alert('File size should be less than 10MB');
//         e.target.value = '';
//         return;
//       }

//       // Check file type (you can customize allowed types)
//       const allowedTypes = [
//         'image/jpeg', 'image/png', 'image/gif',
//         'application/pdf',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'application/vnd.ms-excel',
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         'text/plain'
//       ];

//       if (!allowedTypes.includes(file.type)) {
//         alert('File type not supported. Please upload images, PDF, Word, Excel, or text files.');
//         e.target.value = '';
//         return;
//       }
//     }

//     setFormData((prev) => ({
//       ...prev,
//       attachment: file,
//     }))
//   }

//   const addAdditionalTask = () => {
//     setAdditionalTasks([
//       ...additionalTasks,
//       {
//         id: Date.now(),
//         typeOfWork: "",
//         systemName: "",
//         description: "",
//         link: "",
//         priority: "",
//         notes: "",
//         expectedDate: "",
//       },
//     ])
//   }

//   const removeAdditionalTask = (id) => {
//     setAdditionalTasks(additionalTasks.filter((task) => task.id !== id))
//   }

//   const updateAdditionalTask = (id, field, value) => {
//     setAdditionalTasks(additionalTasks.map((task) => (task.id === id ? { ...task, [field]: value } : task)))
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     if (userRole === "admin") {
//       // Admin validation (original)
//       if (!formData.date) newErrors.date = "Date is required"
//       if (!formData.postedBy) newErrors.postedBy = "Posted By is required"
//       if (!formData.partyName) newErrors.partyName = "Party Name is required"
//       if (!formData.typeOfWork) newErrors.typeOfWork = "Type of Work is required"
//       if (!formData.systemName) newErrors.systemName = "System Name is required"
//       if (!formData.description) newErrors.description = "Description is required"
//       if (!formData.expectedDate) newErrors.expectedDate = "Expected Date is required"
//     } else {
//       // Company validation (simplified)
//       if (!formData.date) newErrors.date = "Date is required"
//       if (!formData.personName) newErrors.personName = "Person Name is required"
//       if (!formData.typeOfWork) newErrors.typeOfWork = "Type of Work is required"
//       if (!formData.systemName) newErrors.systemName = "System Name is required"
//       if (!formData.description) newErrors.description = "Description is required"
//       if (!formData.expectedDate) newErrors.expectedDate = "Expected Date is required"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validateForm()) return;

//   setIsSubmitting(true);
//   setUploadProgress('Preparing submission...');

//   try {
//     // Upload file first if exists
//     let fileUrl = '';
//     if (formData.attachment) {
//       setUploadProgress('Uploading file...');
//       fileUrl = await uploadFileToGoogleDrive(formData.attachment, `TK-TEMP-${Date.now()}`);
//     }

//     const allTasks = [formData, ...additionalTasks].map((task, index) => ({
//       ...task,
//       attachment: fileUrl
//     }));

//     const submittedTasks = [];

//     for (const [index, task] of allTasks.entries()) {
//       setUploadProgress(`Submitting task ${index + 1}...`);

//       const targetSheet = (userRole === "company" && task.typeOfWork === "New System") ? "New System" : "FMS";

//       const submissionData = [
//         '', // Timestamp - backend sets
//         '', // Task number - backend generates
//         formData.date,
//         userRole === "admin" ? task.postedBy : formData.personName,
//         task.typeOfWork,
//         task.takenFrom || "",
//         task.partyName || "",
//         task.systemName,
//         task.description,
//         task.link,
//         task.attachment,
//         task.priority,
//         task.notes,
//         task.expectedDate,
//       ];

//       const response = await fetch(
//         'https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//           body: new URLSearchParams({
//             sheetName: targetSheet,
//             action: 'insert',
//             rowData: JSON.stringify(submissionData)
//           })
//         }
//       );

//       const result = await response.json();
//       if (!result.success) throw new Error(result.error);

//       submittedTasks.push({ ...task, taskNumber: result.taskNumber });
//     }

//     if (onTaskCreated) onTaskCreated(submittedTasks);

//     const taskNumbers = submittedTasks.map(t => t.taskNumber).join(', ');
//     alert(`${submittedTasks.length} task(s) created: ${taskNumbers}`);

//     // Reset form
//     setFormData({
//       date: "", postedBy: "", typeOfWork: "", takenFrom: "", partyName: "",
//       systemName: "", description: "", link: "", attachment: null,
//       priority: "", notes: "", expectedDate: "", personName: "",
//     });
//     setAdditionalTasks([]);
//     setShowAdditionalSection(false);

//   } catch (error) {
//     const msg = error.message.includes('busy') ? 'System busy. Try again.' : 'Submission failed. Try again.';
//     alert(msg);
//   } finally {
//     setIsSubmitting(false);
//     setUploadProgress('');
//   }
// };

//   const handleShowAdditionalSection = () => {
//     if (!showAdditionalSection) {
//       setShowAdditionalSection(true)
//       addAdditionalTask()
//     } else {
//       setShowAdditionalSection(false)
//       setAdditionalTasks([])
//     }
//   }

//   // Company form task renderer
//   const renderCompanyTaskForm = (task, index, isMain = false) => (
//     <div key={isMain ? "main-company" : `company-task-${task.id}`} className="bg-gray-50 rounded-lg p-4 mb-4">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">Task {index + 1}</h3>
//         {!isMain && (
//           <button 
//             type="button" 
//             onClick={() => removeAdditionalTask(task.id)}
//             className="text-red-500 hover:text-red-700"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         )}
//       </div>

//       <div className="space-y-4">
//         {/* Type of Work */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Type of Work</label>
//           <select
//             name={isMain ? "typeOfWork" : ""}
//             value={isMain ? formData.typeOfWork : task.typeOfWork}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "typeOfWork", e.target.value)
//             }
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isMain && errors.typeOfWork ? "border-red-300" : "border-gray-300"
//             }`}
//           >
//             <option value="">Select Type of Work</option>
//             {workTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//           {isMain && errors.typeOfWork && <p className="mt-1 text-sm text-red-600">{errors.typeOfWork}</p>}
//         </div>

//         {/* System Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
//           <input
//             type="text"
//             name={isMain ? "systemName" : ""}
//             value={isMain ? formData.systemName : task.systemName}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "systemName", e.target.value)
//             }
//             placeholder="Enter System Name"
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isMain && errors.systemName ? "border-red-300" : "border-gray-300"
//             }`}
//           />
//           {isMain && errors.systemName && <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>}
//         </div>

//         {/* Description Of Work */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Description Of Work</label>
//           <textarea
//             name={isMain ? "description" : ""}
//             value={isMain ? formData.description : task.description}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "description", e.target.value)
//             }
//             rows={4}
//             placeholder="Enter Description"
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isMain && errors.description ? "border-red-300" : "border-gray-300"
//             }`}
//           />
//           {isMain && errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
//         </div>

//         {/* Link of System */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Link of System</label>
//           <input
//             type="url"
//             name={isMain ? "link" : ""}
//             value={isMain ? formData.link : task.link}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "link", e.target.value)
//             }
//             placeholder="Enter System Link"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         {/* Notes */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//           <textarea
//             name={isMain ? "notes" : ""}
//             value={isMain ? formData.notes : task.notes}
//             onChange={(e) => 
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "notes", e.target.value)
//             }
//             rows={3}
//             placeholder="Enter Notes"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         {/* Expected Date To Close */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Expected Date To Close</label>
//           <input
//             type="date"
//             name={isMain ? "expectedDate" : ""}
//             value={isMain ? formData.expectedDate : task.expectedDate}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "expectedDate", e.target.value)
//             }
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isMain && errors.expectedDate ? "border-red-300" : "border-gray-300"
//             }`}
//           />
//           {isMain && errors.expectedDate && <p className="mt-1 text-sm text-red-600">{errors.expectedDate}</p>}
//         </div>

//         {/* Priority for Customer */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Priority for Customer</label>
//           <select
//             name={isMain ? "priority" : ""}
//             value={isMain ? formData.priority : task.priority}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "priority", e.target.value)
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">Select Priority</option>
//             <option value="High">High</option>
//             <option value="Medium">Medium</option>
//             <option value="Low">Low</option>
//           </select>
//         </div>

//         {/* Upload File (Optional) - Only for main task */}
//         {isMain && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Upload File (Optional)
//               <span className="text-xs text-gray-500 ml-2">(Max 10MB - Images, PDF, Word, Excel, Text files)</span>
//             </label>
//             <input
//               type="file"
//               name="attachment"
//               onChange={handleFileChange}
//               accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             {formData.attachment && (
//               <p className="mt-2 text-sm text-green-600">
//                 ✓ Selected: {formData.attachment.name} ({(formData.attachment.size / 1024 / 1024).toFixed(2)} MB)
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )

//   // Company Login Form (Simplified)
//   const renderCompanyForm = () => (
//     <div className="max-w-2xl mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-lg border border-gray-200"
//       >
//         <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
//           <h2 className="text-2xl font-bold text-gray-900 text-center">Generate New Ticket</h2>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 errors.date ? "border-red-300" : "border-gray-300"
//               }`}
//             />
//             {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
//           </div>

//           {/* Person Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Person Name</label>
//             <input
//               type="text"
//               name="personName"
//               value={formData.personName}
//               onChange={handleInputChange}
//               placeholder="Enter Person Name"
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 errors.personName ? "border-red-300" : "border-gray-300"
//               }`}
//             />
//             {errors.personName && <p className="mt-1 text-sm text-red-600">{errors.personName}</p>}
//           </div>

//           {/* Main Task Section */}
//           {renderCompanyTaskForm(formData, 0, true)}

//           {/* Additional Tasks Section */}
//           <AnimatePresence>
//             {additionalTasks.map((task, index) => (
//               <motion.div
//                 key={task.id}
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//               >
//                 {renderCompanyTaskForm(task, index + 1, false)}
//               </motion.div>
//             ))}
//           </AnimatePresence>

//           {/* Progress Indicator */}
//           {isSubmitting && uploadProgress && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span className="text-blue-700">{uploadProgress}</span>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-between items-center pt-6">
//             <Button
//               type="button"
//               onClick={addAdditionalTask}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               ADD TASK
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center"
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   SUBMITTING...
//                 </>
//               ) : (
//                 `SUBMIT TICKET${additionalTasks.length > 0 ? ` (${additionalTasks.length + 1} Tasks)` : ""}`
//               )}
//             </Button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   )

//   // Admin form task renderer
//   const renderTaskForm = (task, index, isMain = false) => (
//     <div
//       key={isMain ? "main" : task.id}
//       className={`${isMain ? "" : "bg-gray-50 border border-gray-200 rounded-lg p-6 relative"}`}
//     >
//       {!isMain && (
//         <button
//           type="button"
//           onClick={() => removeAdditionalTask(task.id)}
//           className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       )}

//       <div className={`${!isMain ? "pr-8" : ""}`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Type of Work */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Type of Work {isMain && <span className="text-red-500">*</span>}
//             </label>
//             <select
//               name={isMain ? "typeOfWork" : ""}
//               value={isMain ? formData.typeOfWork : task.typeOfWork}
//               onChange={(e) =>
//                 isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "typeOfWork", e.target.value)
//               }
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 isMain && errors.typeOfWork ? "border-red-300" : "border-gray-300"
//               }`}
//             >
//               <option value="">Select Type of Work</option>
//               {workTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//             {isMain && errors.typeOfWork && <p className="mt-1 text-sm text-red-600">{errors.typeOfWork}</p>}
//           </div>

//           {/* System Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               System Name {isMain && <span className="text-red-500">*</span>}
//             </label>
//             <input
//               type="text"
//               name={isMain ? "systemName" : ""}
//               value={isMain ? formData.systemName : task.systemName}
//               onChange={(e) =>
//                 isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "systemName", e.target.value)
//               }
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 isMain && errors.systemName ? "border-red-300" : "border-gray-300"
//               }`}
//               placeholder="Enter system name"
//             />
//             {isMain && errors.systemName && <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>}
//           </div>

//           {/* Link of System */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Link of System</label>
//             <div className="relative">
//               <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="url"
//                 name={isMain ? "link" : ""}
//                 value={isMain ? formData.link : task.link}
//                 onChange={(e) =>
//                   isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "link", e.target.value)
//                 }
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="https://example.com"
//               />
//             </div>
//           </div>

//           {/* Priority */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Priority in Customer</label>
//             <div className="relative">
//               <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <select
//                 name={isMain ? "priority" : ""}
//                 value={isMain ? formData.priority : task.priority}
//                 onChange={(e) =>
//                   isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "priority", e.target.value)
//                 }
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">Select Priority</option>
//                 <option value="High">High</option>
//                 <option value="Medium">Medium</option>
//                 <option value="Low">Low</option>
//               </select>
//             </div>
//           </div>

//           {/* Expected Date */}
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Expected Date to Close {isMain && <span className="text-red-500">*</span>}
//             </label>
//             <div className="relative max-w-md">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="date"
//                 name={isMain ? "expectedDate" : ""}
//                 value={isMain ? formData.expectedDate : task.expectedDate}
//                 onChange={(e) =>
//                   isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "expectedDate", e.target.value)
//                 }
//                 className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   isMain && errors.expectedDate ? "border-red-300" : "border-gray-300"
//                 }`}
//               />
//             </div>
//             {isMain && errors.expectedDate && <p className="mt-1 text-sm text-red-600">{errors.expectedDate}</p>}
//           </div>
//         </div>

//         {/* Description */}
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Description Of Work {isMain && <span className="text-red-500">*</span>}
//           </label>
//           <div className="relative">
//             <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
//             <textarea
//               name={isMain ? "description" : ""}
//               value={isMain ? formData.description : task.description}
//               onChange={(e) =>
//                 isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "description", e.target.value)
//               }
//               rows={4}
//               className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 isMain && errors.description ? "border-red-300" : "border-gray-300"
//               }`}
//               placeholder="Describe the work to be done..."
//             />
//           </div>
//           {isMain && errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
//         </div>

//         {/* Notes */}
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//           <textarea
//             name={isMain ? "notes" : ""}
//             value={isMain ? formData.notes : task.notes}
//             onChange={(e) => (isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "notes", e.target.value))}
//             rows={3}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Additional notes or comments..."
//           />
//         </div>
//       </div>
//     </div>
//   )

//   const renderAdminForm = () => (
//     <div className="max-w-6xl mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-sm border border-gray-200"
//       >
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
//               <Plus className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">Assign New Task</h2>
//               <p className="text-gray-600">Create and assign tasks to team members</p>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-8">
//           {/* Main Form Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Date */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Date <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.date ? "border-red-300" : "border-gray-300"
//                   }`}
//                 />
//               </div>
//               {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
//             </div>

//             {/* Posted By */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Posted By <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <select
//                   name="postedBy"
//                   value={formData.postedBy}
//                   onChange={handleInputChange}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.postedBy ? "border-red-300" : "border-gray-300"
//                   }`}
//                 >
//                   <option value="">Select Posted By</option>
//                   {postedByOptions.map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {errors.postedBy && <p className="mt-1 text-sm text-red-600">{errors.postedBy}</p>}
//             </div>

//             {/* Taken From */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Taken From <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <select
//                   name="takenFrom"
//                   value={formData.takenFrom}
//                   onChange={handleInputChange}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select Taken From</option>
//                   {postedByOptions.map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Party Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Party Name <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <select
//                   name="partyName"
//                   value={formData.partyName}
//                   onChange={handleInputChange}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.partyName ? "border-red-300" : "border-gray-300"
//                   }`}
//                 >
//                   <option value="">Select Party Name</option>
//                   {partyNames.map((party) => (
//                     <option key={party} value={party}>
//                       {party}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {errors.partyName && <p className="mt-1 text-sm text-red-600">{errors.partyName}</p>}
//             </div>

//             {/* Attachment */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Attachment File
//                 <span className="text-xs text-gray-500 ml-2">(Max 10MB - Images, PDF, Word, Excel, Text files)</span>
//               </label>
//               <div className="relative">
//                 <Paperclip className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="file"
//                   name="attachment"
//                   onChange={handleFileChange}
//                   accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               {formData.attachment && (
//                 <p className="mt-2 text-sm text-green-600">
//                   ✓ Selected: {formData.attachment.name} ({(formData.attachment.size / 1024 / 1024).toFixed(2)} MB)
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Main Task Section */}
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Primary Task Details</h3>
//             </div>
//             {renderTaskForm(formData, 0, true)}
//           </div>

//           {/* Additional Tasks Section */}
//           <AnimatePresence>
//             {showAdditionalSection && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="space-y-6"
//               >
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold text-gray-900">Additional Tasks</h3>
//                   <Button
//                     type="button"
//                     onClick={addAdditionalTask}
//                     variant="outline"
//                     size="sm"
//                     className="bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50"
//                   >
//                     <Plus className="w-4 h-4 mr-2" />
//                     Add Another Task
//                   </Button>
//                 </div>
//                 {additionalTasks.map((task, index) => (
//                   <motion.div
//                     key={task.id}
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                   >
//                     {renderTaskForm(task, index + 1)}
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Progress Indicator */}
//           {isSubmitting && uploadProgress && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span className="text-blue-700">{uploadProgress}</span>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-between items-center pt-6 border-t border-gray-200">
//             <div className="flex space-x-4">
//               <Button
//                 type="button"
//                 onClick={handleShowAdditionalSection}
//                 variant="outline"
//                 className="bg-transparent border-purple-300 text-purple-600 hover:bg-purple-50"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 {showAdditionalSection ? "Hide" : "Add"} Additional Tasks
//               </Button>
//             </div>
//             <div className="flex space-x-4">
//               <Button type="button" variant="outline" className="px-6 py-3 bg-transparent">
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white flex items-center"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Submitting...
//                   </>
//                 ) : (
//                   `Add Task${additionalTasks.length > 0 ? `s (${additionalTasks.length + 1})` : ""}`
//                 )}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   )

//   // Main render logic based on userRole
//   if (userRole === "company") {
//     return renderCompanyForm()
//   } else {
//     return renderAdminForm()
//   }
// }



// "use client"
// import { useState, useEffect } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import { Calendar, User, Building, FileText, Link, Paperclip, AlertCircle, Plus, X } from "lucide-react"
// import Button from "../ui/Button"

// // File upload utility function - Updated to work with your existing Google Apps Script
// const uploadFileToGoogleDrive = async (file, taskNumber) => {
//   if (!file) return '';

//   try {
//     // Convert file to base64
//     const fileBase64 = await new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });

//     const response = await fetch(
//       'https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           action: 'uploadFile',
//           fileName: `${taskNumber}_${file.name}`,
//           fileData: fileBase64,
//           mimeType: file.type,
//           taskNumber: taskNumber
//         })
//       }
//     );

//     const result = await response.json();
//     if (result.success) {
//       return result.fileUrl; // Return the Google Drive file URL
//     } else {
//       console.error('File upload failed:', result.error);
//       return `Error uploading: ${file.name}`;
//     }
//   } catch (error) {
//     console.error('File upload error:', error);
//     return `Error uploading: ${file.name}`;
//   }
// };

// export default function AssignTaskForm({ onTaskCreated, userRole = "admin" }) {
//   const [formData, setFormData] = useState({
//     date: "",
//     postedBy: "",
//     takenFrom: "",
//     partyName: "",
//     typeOfWork: "",
//     systemName: "",
//     description: "",
//     link: "",
//     attachment: null,
//     priority: "",
//     notes: "",
//     expectedDate: "",
//     personName: "", // For company login
//   })

//   const [additionalTasks, setAdditionalTasks] = useState([])
//   const [showAdditionalSection, setShowAdditionalSection] = useState(false)
//   const [errors, setErrors] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState('')

//   // State for dropdown options from sheet
//   const [postedByOptions, setPostedByOptions] = useState([])
//   const [partyNames, setPartyNames] = useState([])
//   const [workTypes, setWorkTypes] = useState([])
//   const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true)

//   // Fetch dropdown data from Master Sheet Link
//   const fetchDropdownData = async () => {
//     try {
//       const response = await fetch(
//         'https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=Master Sheet Link&action=fetch',
//         { method: 'GET' }
//       )

//       const result = await response.json()

//       if (result.success && result.data && Array.isArray(result.data)) {
//         const data = result.data

//         // Extract unique values from respective columns
//         const postedBySet = new Set()
//         const partyNameSet = new Set()
//         const workTypeSet = new Set()

//         data.forEach((row, index) => {
//           if (index === 0) return // Skip header row

//           // Column Q (index 16) for Posted By
//           if (row[16] && String(row[16]).trim() !== '') {
//             postedBySet.add(String(row[16]).trim())
//           }

//           // Column N (index 13) for Party Name
//           if (row[13] && String(row[13]).trim() !== '') {
//             partyNameSet.add(String(row[13]).trim())
//           }

//           // Column O (index 14) for Type of Work
//           if (row[14] && String(row[14]).trim() !== '') {
//             workTypeSet.add(String(row[14]).trim())
//           }
//         })

//         const postedBy = Array.from(postedBySet).sort()
//         const parties = Array.from(partyNameSet).sort()
//         const workTypesData = Array.from(workTypeSet).sort()

//         setPostedByOptions(postedBy)
//         setPartyNames(parties)
//         setWorkTypes(workTypesData)
//       }
//     } catch (error) {
//       console.error('Error fetching dropdown data:', error)
//       // Use fallback values
//       setPostedByOptions(["Satyendra", "Chetan", "Digendra", "Pratap", "Vikas", "Tuleshwar"])
//       setPartyNames(["Acemark Statiners", "AT Jwellers", "AT PLUS", "Azra", "Azure Interiors", "Botivate"])
//       setWorkTypes(["Existing System Edit & Update", "New System", "Error Received", "Complain Report"])
//     } finally {
//       setIsLoadingDropdowns(false)
//     }
//   }

//   // Load data on component mount
//   useEffect(() => {
//     fetchDropdownData()
//   }, [])

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }))
//     }
//   }

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Check file size (limit to 10MB)
//       if (file.size > 10 * 1024 * 1024) {
//         alert('File size should be less than 10MB');
//         e.target.value = '';
//         return;
//       }

//       // Check file type (you can customize allowed types)
//       const allowedTypes = [
//         'image/jpeg', 'image/png', 'image/gif',
//         'application/pdf',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'application/vnd.ms-excel',
//         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//         'text/plain'
//       ];

//       if (!allowedTypes.includes(file.type)) {
//         alert('File type not supported. Please upload images, PDF, Word, Excel, or text files.');
//         e.target.value = '';
//         return;
//       }
//     }

//     setFormData((prev) => ({
//       ...prev,
//       attachment: file,
//     }))
//   }

//   const addAdditionalTask = () => {
//     setAdditionalTasks([
//       ...additionalTasks,
//       {
//         id: Date.now(),
//         typeOfWork: "",
//         systemName: "",
//         description: "",
//         link: "",
//         priority: "",
//         notes: "",
//         expectedDate: "",
//       },
//     ])
//   }

//   const removeAdditionalTask = (id) => {
//     setAdditionalTasks(additionalTasks.filter((task) => task.id !== id))
//   }

//   const updateAdditionalTask = (id, field, value) => {
//     setAdditionalTasks(additionalTasks.map((task) => (task.id === id ? { ...task, [field]: value } : task)))
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     if (userRole === "admin") {
//       // Admin validation (original)
//       if (!formData.date) newErrors.date = "Date is required"
//       if (!formData.postedBy) newErrors.postedBy = "Posted By is required"
//       if (!formData.partyName) newErrors.partyName = "Party Name is required"
//       if (!formData.typeOfWork) newErrors.typeOfWork = "Type of Work is required"
//       if (!formData.systemName) newErrors.systemName = "System Name is required"
//       if (!formData.description) newErrors.description = "Description is required"
//       if (!formData.expectedDate) newErrors.expectedDate = "Expected Date is required"
//     } else {
//       // Company validation (simplified)
//       if (!formData.date) newErrors.date = "Date is required"
//       if (!formData.personName) newErrors.personName = "Person Name is required"
//       if (!formData.typeOfWork) newErrors.typeOfWork = "Type of Work is required"
//       if (!formData.systemName) newErrors.systemName = "System Name is required"
//       if (!formData.description) newErrors.description = "Description is required"
//       if (!formData.expectedDate) newErrors.expectedDate = "Expected Date is required"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validateForm()) return;

//   setIsSubmitting(true);
//   setUploadProgress('Preparing submission...');

//   try {
//     // Upload file first if exists
//     let fileUrl = '';
//     if (formData.attachment) {
//       setUploadProgress('Uploading file...');
//       fileUrl = await uploadFileToGoogleDrive(formData.attachment, `TK-TEMP-${Date.now()}`);
//     }

//     const allTasks = [formData, ...additionalTasks].map((task, index) => ({
//       ...task,
//       attachment: fileUrl
//     }));

//     const submittedTasks = [];

//     for (const [index, task] of allTasks.entries()) {
//       setUploadProgress(`Submitting task ${index + 1}...`);

//       const targetSheet = (userRole === "company" && task.typeOfWork === "New System") ? "New System" : "FMS";

//       const submissionData = [
//         '', // Timestamp - backend sets
//         '', // Task number - backend generates
//         formData.date,
//         userRole === "admin" ? task.postedBy : formData.personName,
//         task.typeOfWork,
//         task.takenFrom || "",
//         task.partyName || "",
//         task.systemName,
//         task.description,
//         task.link,
//         task.attachment,
//         task.priority,
//         task.notes,
//         task.expectedDate,
//       ];

//       const response = await fetch(
//         'https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//           body: new URLSearchParams({
//             sheetName: targetSheet,
//             action: 'insert',
//             rowData: JSON.stringify(submissionData)
//           })
//         }
//       );

//       const result = await response.json();
//       if (!result.success) throw new Error(result.error);

//       submittedTasks.push({ ...task, taskNumber: result.taskNumber });
//     }

//     if (onTaskCreated) onTaskCreated(submittedTasks);

//     const taskNumbers = submittedTasks.map(t => t.taskNumber).join(', ');
//     alert(`${submittedTasks.length} task(s) created: ${taskNumbers}`);

//     // Reset form
//     setFormData({
//       date: "", postedBy: "", typeOfWork: "", takenFrom: "", partyName: "",
//       systemName: "", description: "", link: "", attachment: null,
//       priority: "", notes: "", expectedDate: "", personName: "",
//     });
//     setAdditionalTasks([]);
//     setShowAdditionalSection(false);

//   } catch (error) {
//     const msg = error.message.includes('busy') ? 'System busy. Try again.' : 'Submission failed. Try again.';
//     alert(msg);
//   } finally {
//     setIsSubmitting(false);
//     setUploadProgress('');
//   }
// };

//   const handleShowAdditionalSection = () => {
//     if (!showAdditionalSection) {
//       setShowAdditionalSection(true)
//       addAdditionalTask()
//     } else {
//       setShowAdditionalSection(false)
//       setAdditionalTasks([])
//     }
//   }

//   // Company form task renderer
//   const renderCompanyTaskForm = (task, index, isMain = false) => (
//     <div key={isMain ? "main-company" : `company-task-${task.id}`} className="bg-gray-50 rounded-lg p-4 mb-4">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-gray-900">Task {index + 1}</h3>
//         {!isMain && (
//           <button 
//             type="button" 
//             onClick={() => removeAdditionalTask(task.id)}
//             className="text-red-500 hover:text-red-700"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         )}
//       </div>

//       <div className="space-y-4">
//         {/* Type of Work */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Type of Work</label>
//           <select
//             name={isMain ? "typeOfWork" : ""}
//             value={isMain ? formData.typeOfWork : task.typeOfWork}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "typeOfWork", e.target.value)
//             }
//             disabled={isLoadingDropdowns}
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isMain && errors.typeOfWork ? "border-red-300" : "border-gray-300"
//             } ${isLoadingDropdowns ? "bg-gray-100" : ""}`}
//           >
//             <option value="">{isLoadingDropdowns ? "Loading..." : "Select Type of Work"}</option>
//             {workTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//           {isMain && errors.typeOfWork && <p className="mt-1 text-sm text-red-600">{errors.typeOfWork}</p>}
//         </div>

//         {/* System Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
//           <input
//             type="text"
//             name={isMain ? "systemName" : ""}
//             value={isMain ? formData.systemName : task.systemName}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "systemName", e.target.value)
//             }
//             placeholder="Enter System Name"
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isMain && errors.systemName ? "border-red-300" : "border-gray-300"
//             }`}
//           />
//           {isMain && errors.systemName && <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>}
//         </div>

//         {/* Description Of Work */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Description Of Work</label>
//           <textarea
//             name={isMain ? "description" : ""}
//             value={isMain ? formData.description : task.description}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "description", e.target.value)
//             }
//             rows={4}
//             placeholder="Enter Description"
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isMain && errors.description ? "border-red-300" : "border-gray-300"
//             }`}
//           />
//           {isMain && errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
//         </div>

//         {/* Link of System */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Link of System</label>
//           <input
//             type="url"
//             name={isMain ? "link" : ""}
//             value={isMain ? formData.link : task.link}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "link", e.target.value)
//             }
//             placeholder="Enter System Link"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         {/* Notes */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//           <textarea
//             name={isMain ? "notes" : ""}
//             value={isMain ? formData.notes : task.notes}
//             onChange={(e) => 
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "notes", e.target.value)
//             }
//             rows={3}
//             placeholder="Enter Notes"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>

//         {/* Expected Date To Close */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Expected Date To Close</label>
//           <input
//             type="date"
//             name={isMain ? "expectedDate" : ""}
//             value={isMain ? formData.expectedDate : task.expectedDate}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "expectedDate", e.target.value)
//             }
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               isMain && errors.expectedDate ? "border-red-300" : "border-gray-300"
//             }`}
//           />
//           {isMain && errors.expectedDate && <p className="mt-1 text-sm text-red-600">{errors.expectedDate}</p>}
//         </div>

//         {/* Priority for Customer */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">Priority for Customer</label>
//           <select
//             name={isMain ? "priority" : ""}
//             value={isMain ? formData.priority : task.priority}
//             onChange={(e) =>
//               isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "priority", e.target.value)
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">Select Priority</option>
//             <option value="High">High</option>
//             <option value="Medium">Medium</option>
//             <option value="Low">Low</option>
//           </select>
//         </div>

//         {/* Upload File (Optional) - Only for main task */}
//         {isMain && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Upload File (Optional)
//               <span className="text-xs text-gray-500 ml-2">(Max 10MB - Images, PDF, Word, Excel, Text files)</span>
//             </label>
//             <input
//               type="file"
//               name="attachment"
//               onChange={handleFileChange}
//               accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//             {formData.attachment && (
//               <p className="mt-2 text-sm text-green-600">
//                 ✓ Selected: {formData.attachment.name} ({(formData.attachment.size / 1024 / 1024).toFixed(2)} MB)
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   )

//   // Company Login Form (Simplified)
//   const renderCompanyForm = () => (
//     <div className="max-w-2xl mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-lg border border-gray-200"
//       >
//         <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
//           <h2 className="text-2xl font-bold text-gray-900 text-center">Generate New Ticket</h2>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           {/* Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
//             <input
//               type="date"
//               name="date"
//               value={formData.date}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 errors.date ? "border-red-300" : "border-gray-300"
//               }`}
//             />
//             {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
//           </div>

//           {/* Person Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Person Name</label>
//             <input
//               type="text"
//               name="personName"
//               value={formData.personName}
//               onChange={handleInputChange}
//               placeholder="Enter Person Name"
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 errors.personName ? "border-red-300" : "border-gray-300"
//               }`}
//             />
//             {errors.personName && <p className="mt-1 text-sm text-red-600">{errors.personName}</p>}
//           </div>

//           {/* Main Task Section */}
//           {renderCompanyTaskForm(formData, 0, true)}

//           {/* Additional Tasks Section */}
//           <AnimatePresence>
//             {additionalTasks.map((task, index) => (
//               <motion.div
//                 key={task.id}
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//               >
//                 {renderCompanyTaskForm(task, index + 1, false)}
//               </motion.div>
//             ))}
//           </AnimatePresence>

//           {/* Progress Indicator */}
//           {isSubmitting && uploadProgress && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span className="text-blue-700">{uploadProgress}</span>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-between items-center pt-6">
//             <Button
//               type="button"
//               onClick={addAdditionalTask}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
//             >
//               <Plus className="w-4 h-4 mr-2" />
//               ADD TASK
//             </Button>
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center"
//             >
//               {isSubmitting ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   SUBMITTING...
//                 </>
//               ) : (
//                 `SUBMIT TICKET${additionalTasks.length > 0 ? ` (${additionalTasks.length + 1} Tasks)` : ""}`
//               )}
//             </Button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   )

//   // Admin form task renderer
//   const renderTaskForm = (task, index, isMain = false) => (
//     <div
//       key={isMain ? "main" : task.id}
//       className={`${isMain ? "" : "bg-gray-50 border border-gray-200 rounded-lg p-6 relative"}`}
//     >
//       {!isMain && (
//         <button
//           type="button"
//           onClick={() => removeAdditionalTask(task.id)}
//           className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       )}

//       <div className={`${!isMain ? "pr-8" : ""}`}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Type of Work */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Type of Work {isMain && <span className="text-red-500">*</span>}
//             </label>
//             <select
//               name={isMain ? "typeOfWork" : ""}
//               value={isMain ? formData.typeOfWork : task.typeOfWork}
//               onChange={(e) =>
//                 isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "typeOfWork", e.target.value)
//               }
//               disabled={isLoadingDropdowns}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 isMain && errors.typeOfWork ? "border-red-300" : "border-gray-300"
//               } ${isLoadingDropdowns ? "bg-gray-100" : ""}`}
//             >
//               <option value="">{isLoadingDropdowns ? "Loading..." : "Select Type of Work"}</option>
//               {workTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//             {isMain && errors.typeOfWork && <p className="mt-1 text-sm text-red-600">{errors.typeOfWork}</p>}
//           </div>

//           {/* System Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               System Name {isMain && <span className="text-red-500">*</span>}
//             </label>
//             <input
//               type="text"
//               name={isMain ? "systemName" : ""}
//               value={isMain ? formData.systemName : task.systemName}
//               onChange={(e) =>
//                 isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "systemName", e.target.value)
//               }
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 isMain && errors.systemName ? "border-red-300" : "border-gray-300"
//               }`}
//               placeholder="Enter system name"
//             />
//             {isMain && errors.systemName && <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>}
//           </div>

//           {/* Link of System */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Link of System</label>
//             <div className="relative">
//               <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="url"
//                 name={isMain ? "link" : ""}
//                 value={isMain ? formData.link : task.link}
//                 onChange={(e) =>
//                   isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "link", e.target.value)
//                 }
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="https://example.com"
//               />
//             </div>
//           </div>

//           {/* Priority */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Priority in Customer</label>
//             <div className="relative">
//               <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <select
//                 name={isMain ? "priority" : ""}
//                 value={isMain ? formData.priority : task.priority}
//                 onChange={(e) =>
//                   isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "priority", e.target.value)
//                 }
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">Select Priority</option>
//                 <option value="High">High</option>
//                 <option value="Medium">Medium</option>
//                 <option value="Low">Low</option>
//               </select>
//             </div>
//           </div>

//           {/* Expected Date */}
//           <div className="md:col-span-2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Expected Date to Close {isMain && <span className="text-red-500">*</span>}
//             </label>
//             <div className="relative max-w-md">
//               <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="date"
//                 name={isMain ? "expectedDate" : ""}
//                 value={isMain ? formData.expectedDate : task.expectedDate}
//                 onChange={(e) =>
//                   isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "expectedDate", e.target.value)
//                 }
//                 className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   isMain && errors.expectedDate ? "border-red-300" : "border-gray-300"
//                 }`}
//               />
//             </div>
//             {isMain && errors.expectedDate && <p className="mt-1 text-sm text-red-600">{errors.expectedDate}</p>}
//           </div>
//         </div>

//         {/* Description */}
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Description Of Work {isMain && <span className="text-red-500">*</span>}
//           </label>
//           <div className="relative">
//             <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
//             <textarea
//               name={isMain ? "description" : ""}
//               value={isMain ? formData.description : task.description}
//               onChange={(e) =>
//                 isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "description", e.target.value)
//               }
//               rows={4}
//               className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 isMain && errors.description ? "border-red-300" : "border-gray-300"
//               }`}
//               placeholder="Describe the work to be done..."
//             />
//           </div>
//           {isMain && errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
//         </div>

//         {/* Notes */}
//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
//           <textarea
//             name={isMain ? "notes" : ""}
//             value={isMain ? formData.notes : task.notes}
//             onChange={(e) => (isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "notes", e.target.value))}
//             rows={3}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             placeholder="Additional notes or comments..."
//           />
//         </div>
//       </div>
//     </div>
//   )

//   const renderAdminForm = () => (
//     <div className="max-w-6xl mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white rounded-xl shadow-sm border border-gray-200"
//       >
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
//               <Plus className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">Assign New Task</h2>
//               <p className="text-gray-600">Create and assign tasks to team members</p>
//             </div>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-8">
//           {/* Main Form Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Date */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Date <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.date ? "border-red-300" : "border-gray-300"
//                   }`}
//                 />
//               </div>
//               {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
//             </div>

//             {/* Posted By */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Posted By <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <select
//                   name="postedBy"
//                   value={formData.postedBy}
//                   onChange={handleInputChange}
//                   disabled={isLoadingDropdowns}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.postedBy ? "border-red-300" : "border-gray-300"
//                   } ${isLoadingDropdowns ? "bg-gray-100" : ""}`}
//                 >
//                   <option value="">{isLoadingDropdowns ? "Loading..." : "Select Posted By"}</option>
//                   {postedByOptions.map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {errors.postedBy && <p className="mt-1 text-sm text-red-600">{errors.postedBy}</p>}
//             </div>

//             {/* Taken From */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Taken From <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <select
//                   name="takenFrom"
//                   value={formData.takenFrom}
//                   onChange={handleInputChange}
//                   disabled={isLoadingDropdowns}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     isLoadingDropdowns ? "bg-gray-100" : ""
//                   }`}
//                 >
//                   <option value="">{isLoadingDropdowns ? "Loading..." : "Select Taken From"}</option>
//                   {postedByOptions.map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Party Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Party Name <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <select
//                   name="partyName"
//                   value={formData.partyName}
//                   onChange={handleInputChange}
//                   disabled={isLoadingDropdowns}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.partyName ? "border-red-300" : "border-gray-300"
//                   } ${isLoadingDropdowns ? "bg-gray-100" : ""}`}
//                 >
//                   <option value="">{isLoadingDropdowns ? "Loading..." : "Select Party Name"}</option>
//                   {partyNames.map((party) => (
//                     <option key={party} value={party}>
//                       {party}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               {errors.partyName && <p className="mt-1 text-sm text-red-600">{errors.partyName}</p>}
//             </div>

//             {/* Attachment */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Attachment File
//                 <span className="text-xs text-gray-500 ml-2">(Max 10MB - Images, PDF, Word, Excel, Text files)</span>
//               </label>
//               <div className="relative">
//                 <Paperclip className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="file"
//                   name="attachment"
//                   onChange={handleFileChange}
//                   accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               {formData.attachment && (
//                 <p className="mt-2 text-sm text-green-600">
//                   ✓ Selected: {formData.attachment.name} ({(formData.attachment.size / 1024 / 1024).toFixed(2)} MB)
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Main Task Section */}
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Primary Task Details</h3>
//             </div>
//             {renderTaskForm(formData, 0, true)}
//           </div>

//           {/* Additional Tasks Section */}
//           <AnimatePresence>
//             {showAdditionalSection && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 className="space-y-6"
//               >
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold text-gray-900">Additional Tasks</h3>
//                   <Button
//                     type="button"
//                     onClick={addAdditionalTask}
//                     variant="outline"
//                     size="sm"
//                     className="bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50"
//                   >
//                     <Plus className="w-4 h-4 mr-2" />
//                     Add Another Task
//                   </Button>
//                 </div>
//                 {additionalTasks.map((task, index) => (
//                   <motion.div
//                     key={task.id}
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                   >
//                     {renderTaskForm(task, index + 1)}
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Progress Indicator */}
//           {isSubmitting && uploadProgress && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 <span className="text-blue-700">{uploadProgress}</span>
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-between items-center pt-6 border-t border-gray-200">
//             <div className="flex space-x-4">
//               <Button
//                 type="button"
//                 onClick={handleShowAdditionalSection}
//                 variant="outline"
//                 className="bg-transparent border-purple-300 text-purple-600 hover:bg-purple-50"
//               >
//                 <Plus className="w-4 h-4 mr-2" />
//                 {showAdditionalSection ? "Hide" : "Add"} Additional Tasks
//               </Button>
//             </div>
//             <div className="flex space-x-4">
//               <Button type="button" variant="outline" className="px-6 py-3 bg-transparent">
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white flex items-center"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Submitting...
//                   </>
//                 ) : (
//                   `Add Task${additionalTasks.length > 0 ? `s (${additionalTasks.length + 1})` : ""}`
//                 )}
//               </Button>
//             </div>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   )

//   // Main render logic based on userRole
//   if (userRole === "company") {
//     return renderCompanyForm()
//   } else {
//     return renderAdminForm()
//   }
// }


"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, User, Building, FileText, Link, Paperclip, AlertCircle, Plus, X } from "lucide-react"
import Button from "../ui/Button"

// File upload utility function - Updated to work with your existing Google Apps Script
const uploadFileToGoogleDrive = async (file, taskNumber) => {
  if (!file) return '';

  try {
    // Convert file to base64
    const fileBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          action: 'uploadFile',
          fileName: `${taskNumber}_${file.name}`,
          fileData: fileBase64,
          mimeType: file.type,
          taskNumber: taskNumber
        })
      }
    );

    const result = await response.json();
    if (result.success) {
      return result.fileUrl; // Return the Google Drive file URL
    } else {
      console.error('File upload failed:', result.error);
      return `Error uploading: ${file.name}`;
    }
  } catch (error) {
    console.error('File upload error:', error);
    return `Error uploading: ${file.name}`;
  }
};

export default function AssignTaskForm({ onTaskCreated, userRole = "admin" }) {
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
    personName: "", // For company login
  })

  // State for current company name (dynamic)
  const [currentCompanyName, setCurrentCompanyName] = useState('')

  const [additionalTasks, setAdditionalTasks] = useState([])
  const [showAdditionalSection, setShowAdditionalSection] = useState(false)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  // State for dropdown options from sheet
  const [postedByOptions, setPostedByOptions] = useState([])
  const [partyNames, setPartyNames] = useState([])
  const [workTypes, setWorkTypes] = useState([])
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true)

  // State for system names based on type of work selection
  const [systemNames, setSystemNames] = useState([])
  const [isLoadingSystemNames, setIsLoadingSystemNames] = useState(false)

  // Get current company name dynamically from session storage
  useEffect(() => {
    if (userRole === "company") {
      try {
        const session = sessionStorage.getItem('userSession');
        if (session) {
          const userData = JSON.parse(session);
          console.log('Session data:', userData); // Debug log

          // Try multiple sources for company name
          const companyName =
            userData.companyData?.companyName ||
            userData.companyData?.companyId ||
            userData.username ||
            '';

          console.log('Retrieved company name:', companyName); // Debug log
          setCurrentCompanyName(companyName);
        }
      } catch (error) {
        console.error('Error getting company name from session:', error);
        setCurrentCompanyName('');
      }
    }
  }, [userRole]);

  // Fetch dropdown data from Master Sheet Link
  const fetchDropdownData = async () => {
    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=Master Sheet Link&action=fetch',
        { method: 'GET' }
      )

      const result = await response.json()

      if (result.success && result.data && Array.isArray(result.data)) {
        const data = result.data

        // Extract unique values from respective columns
        const postedBySet = new Set()
        const partyNameSet = new Set()
        const workTypeSet = new Set()

        data.forEach((row, index) => {
          if (index === 0) return // Skip header row

          // Column Q (index 16) for Posted By
          if (row[16] && String(row[16]).trim() !== '') {
            postedBySet.add(String(row[16]).trim())
          }

          // Column N (index 13) for Party Name
          if (row[13] && String(row[13]).trim() !== '') {
            partyNameSet.add(String(row[13]).trim())
          }

          // ✅ FIXED: For Type of Work - always get all data first, then filter if needed
          if (row[14] && String(row[14]).trim() !== '') {
            workTypeSet.add(String(row[14]).trim())
          }
        })// ✅ NAYA CODE - Both admin and company get same Type of Work from column O
        data.forEach((row, index) => {
          if (index === 0) return // Skip header row

          // Column Q (index 16) for Posted By
          if (row[16] && String(row[16]).trim() !== '') {
            postedBySet.add(String(row[16]).trim())
          }

          // Column N (index 13) for Party Name
          if (row[13] && String(row[13]).trim() !== '') {
            partyNameSet.add(String(row[13]).trim())
          }

          // Column O (index 14) for Type of Work - NO FILTERING FOR ANY ROLE
          if (row[14] && String(row[14]).trim() !== '') {
            workTypeSet.add(String(row[14]).trim())
          }
        })

        const postedBy = Array.from(postedBySet).sort()
        const parties = Array.from(partyNameSet).sort()
        const workTypesData = Array.from(workTypeSet).sort() // Same for all roles

        setPostedByOptions(postedBy)
        setPartyNames(parties)
        setWorkTypes(workTypesData) // No role-based filtering

      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error)
      // Use fallback values
      setPostedByOptions(["Satyendra", "Chetan", "Digendra", "Pratap", "Vikas", "Tuleshwar"])
      setPartyNames(["Acemark Statiners", "AT Jwellers", "AT PLUS", "Azra", "Azure Interiors", "Botivate"])
      setWorkTypes(["Existing System Edit & Update", "New System", "Error Received", "Complain Report"])
    } finally {
      setIsLoadingDropdowns(false)
    }
  }

  // ✅ FIXED: Load data on component mount first, then when currentCompanyName changes
  useEffect(() => {
    fetchDropdownData()
  }, []) // Initial load

  // ✅ FIXED: Re-fetch only when company name changes and it's not empty
  useEffect(() => {
    if (userRole === "company" && currentCompanyName && currentCompanyName !== '') {
      fetchDropdownData()
    }
  }, [currentCompanyName]) // Re-fetch when company name changes

  // Fetch system names based on type of work selection
  const fetchSystemNames = async (typeOfWork) => {
    if (!typeOfWork) {
      setSystemNames([])
      return
    }

    setIsLoadingSystemNames(true)
    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=System List&action=fetch',
        { method: 'GET' }
      )

      const result = await response.json()

      if (result.success && result.data && Array.isArray(result.data)) {
        const data = result.data
        const systemNamesSet = new Set()

        data.forEach((row, index) => {
          if (index === 0) return // Skip header row

          // Column D (index 3) for Type of Work matching
          const rowTypeOfWork = row[3] ? String(row[3]).trim() : ''

          if (rowTypeOfWork === typeOfWork) {
            if (userRole === "admin") {
              // For admin: get all matching systems
              const systemName = row[2] ? String(row[2]).trim() : '' // Column C
              if (systemName !== '') {
                systemNamesSet.add(systemName)
              }
            } else {
              // For company: match with current company name in Column A (Party Name)
              const rowPartyName = row[0] ? String(row[0]).trim() : '' // Column A
              if (currentCompanyName && rowPartyName === currentCompanyName) {
                const systemName = row[2] ? String(row[2]).trim() : '' // Column C
                if (systemName !== '') {
                  systemNamesSet.add(systemName)
                }
              }
            }
          }
        })

        const systems = Array.from(systemNamesSet).sort()
        setSystemNames(systems)
      }
    } catch (error) {
      console.error('Error fetching system names:', error)
      setSystemNames([])
    } finally {
      setIsLoadingSystemNames(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Handle Type of Work change to fetch system names
    if (name === 'typeOfWork') {
      if (userRole === "admin") {
        fetchSystemNames(value)
      } else {
        // For company, use current company name to filter systems
        fetchSystemNames(value)
      }
      // Reset system name when type of work changes
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        systemName: "",
      }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Rest of your code remains the same...
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size should be less than 10MB');
        e.target.value = '';
        return;
      }

      // Check file type (you can customize allowed types)
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('File type not supported. Please upload images, PDF, Word, Excel, or text files.');
        e.target.value = '';
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      attachment: file,
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
    setAdditionalTasks(additionalTasks.map((task) => {
      if (task.id === id) {
        const updatedTask = { ...task, [field]: value }

        // Handle Type of Work change for additional tasks
        if (field === 'typeOfWork') {
          if (userRole === "admin") {
            fetchSystemNames(value)
          } else {
            // For company, use current company name to filter systems
            fetchSystemNames(value)
          }
          updatedTask.systemName = "" // Reset system name
        }

        return updatedTask
      }
      return task
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (userRole === "admin") {
      // Admin validation (original)
      if (!formData.date) newErrors.date = "Date is required"
      if (!formData.postedBy) newErrors.postedBy = "Posted By is required"
      if (!formData.partyName) newErrors.partyName = "Party Name is required"
      if (!formData.typeOfWork) newErrors.typeOfWork = "Type of Work is required"
      if (!formData.systemName) newErrors.systemName = "System Name is required"
      if (!formData.description) newErrors.description = "Description is required"
      if (!formData.expectedDate) newErrors.expectedDate = "Expected Date is required"
    } else {
      // Company validation (simplified)
      if (!formData.date) newErrors.date = "Date is required"
      if (!formData.personName) newErrors.personName = "Person Name is required"
      if (!formData.typeOfWork) newErrors.typeOfWork = "Type of Work is required"
      if (!formData.systemName) newErrors.systemName = "System Name is required"
      if (!formData.description) newErrors.description = "Description is required"
      if (!formData.expectedDate) newErrors.expectedDate = "Expected Date is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadProgress('Preparing submission...');

    try {
      // Upload file first if exists
      let fileUrl = '';
      if (formData.attachment) {
        setUploadProgress('Uploading file...');
        fileUrl = await uploadFileToGoogleDrive(formData.attachment, `TK-TEMP-${Date.now()}`);
      }

      const allTasks = [formData, ...additionalTasks].map((task, index) => ({
        ...task,
        attachment: fileUrl
      }));

      const submittedTasks = [];

      for (const [index, task] of allTasks.entries()) {
        setUploadProgress(`Submitting task ${index + 1}...`);

        const targetSheet = (userRole === "company" && task.typeOfWork === "New System") ? "New System" : "FMS";

        const submissionData = [
          '', // Timestamp - backend sets
          '', // Task number - backend generates
          formData.date,
          userRole === "admin" ? task.postedBy : formData.personName,
          task.typeOfWork,
          task.takenFrom || "",
          userRole === "admin" ? task.partyName : currentCompanyName, // Use currentCompanyName for company login
          task.systemName,
          task.description,
          task.link,
          task.attachment,
          task.priority,
          task.notes,
          task.expectedDate,
        ];

        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              sheetName: targetSheet,
              action: 'insert',
              rowData: JSON.stringify(submissionData)
            })
          }
        );

        const result = await response.json();
        if (!result.success) throw new Error(result.error);

        submittedTasks.push({ ...task, taskNumber: result.taskNumber });
      }

      if (onTaskCreated) onTaskCreated(submittedTasks);

      const taskNumbers = submittedTasks.map(t => t.taskNumber).join(', ');
      alert(`${submittedTasks.length} task(s) created: ${taskNumbers}`);

      // Reset form
      setFormData({
        date: "", postedBy: "", typeOfWork: "", takenFrom: "", partyName: "",
        systemName: "", description: "", link: "", attachment: null,
        priority: "", notes: "", expectedDate: "", personName: "",
      });
      setAdditionalTasks([]);
      setShowAdditionalSection(false);
      setSystemNames([]);

    } catch (error) {
      const msg = error.message.includes('busy') ? 'System busy. Try again.' : 'Submission failed. Try again.';
      alert(msg);
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
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

  // Company form task renderer
  const renderCompanyTaskForm = (task, index, isMain = false) => (
    <div key={isMain ? "main-company" : `company-task-${task.id}`} className="bg-gray-50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Task {index + 1}</h3>
        {!isMain && (
          <button
            type="button"
            onClick={() => removeAdditionalTask(task.id)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Type of Work */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type of Work</label>
          <select
            name={isMain ? "typeOfWork" : ""}
            value={isMain ? formData.typeOfWork : task.typeOfWork}
            onChange={(e) =>
              isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "typeOfWork", e.target.value)
            }
            disabled={isLoadingDropdowns}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMain && errors.typeOfWork ? "border-red-300" : "border-gray-300"
              } ${isLoadingDropdowns ? "bg-gray-100" : ""}`}
          >
            <option value="">{isLoadingDropdowns ? "Loading..." : "Select Type of Work"}</option>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">System Name</label>
          <select
            name={isMain ? "systemName" : ""}
            value={isMain ? formData.systemName : task.systemName}
            onChange={(e) =>
              isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "systemName", e.target.value)
            }
            disabled={isLoadingSystemNames || systemNames.length === 0}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMain && errors.systemName ? "border-red-300" : "border-gray-300"
              } ${(isLoadingSystemNames || systemNames.length === 0) ? "bg-gray-100" : ""}`}
          >
            <option value="">
              {isLoadingSystemNames ? "Loading systems..." :
                systemNames.length === 0 ? "Select Type of Work first" : "Select System Name"}
            </option>
            {systemNames.map((system) => (
              <option key={system} value={system}>
                {system}
              </option>
            ))}
          </select>
          {isMain && errors.systemName && <p className="mt-1 text-sm text-red-600">{errors.systemName}</p>}
        </div>

        {/* Description Of Work */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description Of Work</label>
          <textarea
            name={isMain ? "description" : ""}
            value={isMain ? formData.description : task.description}
            onChange={(e) =>
              isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "description", e.target.value)
            }
            rows={4}
            placeholder="Enter Description"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMain && errors.description ? "border-red-300" : "border-gray-300"
              }`}
          />
          {isMain && errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Link of System */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Link of System</label>
          <input
            type="url"
            name={isMain ? "link" : ""}
            value={isMain ? formData.link : task.link}
            onChange={(e) =>
              isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "link", e.target.value)
            }
            placeholder="Enter System Link"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            name={isMain ? "notes" : ""}
            value={isMain ? formData.notes : task.notes}
            onChange={(e) =>
              isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "notes", e.target.value)
            }
            rows={3}
            placeholder="Enter Notes"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Expected Date To Close */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expected Date To Close</label>
          <input
            type="date"
            name={isMain ? "expectedDate" : ""}
            value={isMain ? formData.expectedDate : task.expectedDate}
            onChange={(e) =>
              isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "expectedDate", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMain && errors.expectedDate ? "border-red-300" : "border-gray-300"
              }`}
          />
          {isMain && errors.expectedDate && <p className="mt-1 text-sm text-red-600">{errors.expectedDate}</p>}
        </div>

        {/* Priority for Customer */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority for Customer</label>
          <select
            name={isMain ? "priority" : ""}
            value={isMain ? formData.priority : task.priority}
            onChange={(e) =>
              isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "priority", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Upload File (Optional) - Only for main task */}
        {isMain && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (Optional)
              <span className="text-xs text-gray-500 ml-2">(Max 10MB - Images, PDF, Word, Excel, Text files)</span>
            </label>
            <input
              type="file"
              name="attachment"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.attachment && (
              <p className="mt-2 text-sm text-green-600">
                ✓ Selected: {formData.attachment.name} ({(formData.attachment.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )

  // Company Login Form (Simplified)
  const renderCompanyForm = () => (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Generate New Ticket</h2>
          {currentCompanyName && (
            <p className="text-center text-sm text-gray-600 mt-1">Company: {currentCompanyName}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.date ? "border-red-300" : "border-gray-300"
                }`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          {/* Person Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Person Name</label>
            <input
              type="text"
              name="personName"
              value={formData.personName}
              onChange={handleInputChange}
              placeholder="Enter Person Name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.personName ? "border-red-300" : "border-gray-300"
                }`}
            />
            {errors.personName && <p className="mt-1 text-sm text-red-600">{errors.personName}</p>}
          </div>

          {/* Main Task Section */}
          {renderCompanyTaskForm(formData, 0, true)}

          {/* Additional Tasks Section */}
          <AnimatePresence>
            {additionalTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderCompanyTaskForm(task, index + 1, false)}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Progress Indicator */}
          {isSubmitting && uploadProgress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-blue-700">{uploadProgress}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              onClick={addAdditionalTask}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              ADD TASK
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SUBMITTING...
                </>
              ) : (
                `SUBMIT TICKET${additionalTasks.length > 0 ? ` (${additionalTasks.length + 1} Tasks)` : ""}`
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )

  // Admin form task renderer
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
              disabled={isLoadingDropdowns}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMain && errors.typeOfWork ? "border-red-300" : "border-gray-300"
                } ${isLoadingDropdowns ? "bg-gray-100" : ""}`}
            >
              <option value="">{isLoadingDropdowns ? "Loading..." : "Select Type of Work"}</option>
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
            <select
              name={isMain ? "systemName" : ""}
              value={isMain ? formData.systemName : task.systemName}
              onChange={(e) =>
                isMain ? handleInputChange(e) : updateAdditionalTask(task.id, "systemName", e.target.value)
              }
              disabled={isLoadingSystemNames || systemNames.length === 0}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMain && errors.systemName ? "border-red-300" : "border-gray-300"
                } ${(isLoadingSystemNames || systemNames.length === 0) ? "bg-gray-100" : ""}`}
            >
              <option value="">
                {isLoadingSystemNames ? "Loading systems..." :
                  systemNames.length === 0 ? "Select Type of Work first" : "Select System Name"}
              </option>
              {systemNames.map((system) => (
                <option key={system} value={system}>
                  {system}
                </option>
              ))}
            </select>
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
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMain && errors.expectedDate ? "border-red-300" : "border-gray-300"
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
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isMain && errors.description ? "border-red-300" : "border-gray-300"
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

  const renderAdminForm = () => (
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
        <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-6 sm:space-y-8">
          {/* Main Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${errors.date ? "border-red-300" : "border-gray-300"
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
                  disabled={isLoadingDropdowns}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${errors.postedBy ? "border-red-300" : "border-gray-300"
                    } ${isLoadingDropdowns ? "bg-gray-100" : ""}`}
                >
                  <option value="">{isLoadingDropdowns ? "Loading..." : "Select Posted By"}</option>
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
                  disabled={isLoadingDropdowns}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${isLoadingDropdowns ? "bg-gray-100" : ""
                    }`}
                >
                  <option value="">{isLoadingDropdowns ? "Loading..." : "Select Taken From"}</option>
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
                  disabled={isLoadingDropdowns}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${errors.partyName ? "border-red-300" : "border-gray-300"
                    } ${isLoadingDropdowns ? "bg-gray-100" : ""}`}
                >
                  <option value="">{isLoadingDropdowns ? "Loading..." : "Select Party Name"}</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachment File
                <span className="text-xs text-gray-500 ml-2 block sm:inline">
                  (Max 10MB - Images, PDF, Word, Excel, Text files)
                </span>
              </label>
              <div className="relative">
                <Paperclip className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="file"
                  name="attachment"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              {formData.attachment && (
                <p className="mt-2 text-sm text-green-600 break-all">
                  ✓ Selected: {formData.attachment.name} ({(formData.attachment.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
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
                className="space-y-4 sm:space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Additional Tasks</h3>
                  <Button
                    type="button"
                    onClick={addAdditionalTask}
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-blue-300 text-blue-600 hover:bg-blue-50 w-full sm:w-auto"
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

          {/* Progress Indicator */}
          {isSubmitting && uploadProgress && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-blue-700 text-sm sm:text-base">{uploadProgress}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center pt-6 border-t border-gray-200 gap-4">
            <div className="order-2 sm:order-1">
              <Button
                type="button"
                onClick={handleShowAdditionalSection}
                variant="outline"
                className="bg-transparent border-purple-300 text-purple-600 hover:bg-purple-50 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showAdditionalSection ? "Hide" : "Add"} Additional Tasks
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 order-1 sm:order-2">
              <Button type="button" variant="outline" className="px-6 py-3 bg-transparent w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white flex items-center justify-center w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  `Add Task${additionalTasks.length > 0 ? `s (${additionalTasks.length + 1})` : ""}`
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  )

  // Main render logic based on userRole
  if (userRole === "company") {
    return renderCompanyForm()
  } else {
    return renderAdminForm()
  }
}
