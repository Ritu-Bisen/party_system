




// OverviewContent Component with User Role Support
function OverviewContent({ users, stats, activeTasks, onViewUser, projectData, userRole, companyData, userFilterData, supabaseData }) {
  // Company filters state
  const [companyFilters, setCompanyFilters] = useState({
    typeOfWork: '',
    status: '',
    priority: ''
  })

  // Admin filters state
  const [adminFilters, setAdminFilters] = useState({
    partyName: '',
    systemName: '',
    stage: ''
  })

  const [filterMember, setFilterMember] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  
  // Filter stats based on user role
  const filteredStats = (() => {
    if (userRole === 'company') {
      return stats.filter(stat => stat.label !== "Active Tasks")  // Hide Active Tasks card for company
    } else if (userRole === 'user') {
      // For individual users, show only relevant stats
      return stats.filter(stat =>
        stat.label === "Total Tasks" ||
        stat.label === "Completed Today" ||
        stat.label === "Pending Issues"
      )
    }
    return stats // Show all stats for admin
  })()


  const handleCompanyFilterChange = (filterType, value) => {
    setCompanyFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearCompanyFilters = () => {
    setCompanyFilters({
      typeOfWork: '',
      status: '',
      priority: ''
    })
  }

  // Handle admin filter changes
  const handleAdminFilterChange = (filterType, value) => {
    setAdminFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearAdminFilters = () => {
    setAdminFilters({
      partyName: '',
      systemName: '',
      stage: ''
    })
  }

 // Filter project data for admin based on filters
  const filteredProjectData = projectData.filter(project => {
    if (adminFilters.partyName && project.partyName !== adminFilters.partyName) return false
    if (adminFilters.systemName && project.systemName !== adminFilters.systemName) return false
    
    // Stage filtering logic
    if (adminFilters.stage) {
      const hasStageMatch = 
        (adminFilters.stage === 'Active' && (project.stage1 === 'Active' || project.stage2 === 'Active' || project.stage3 === 'Active')) ||
        (adminFilters.stage === 'Completed' && project.currentStage === 'Completed') ||
        (adminFilters.stage === 'Pending' && (project.stage1 === 'Pending' || project.stage2 === 'Pending' || project.stage3 === 'Pending'))
      
      if (!hasStageMatch) return false
    }
    
    return true
  })

  return (
    <div className="space-y-6">
      {/* Company Filters at the top - Only for Company */}
      {userRole === 'company' && (
        <CompanyFilters
          companyData={companyData}
          supabaseData={supabaseData}
          filters={companyFilters}
          onFilterChange={handleCompanyFilterChange}
          onClearFilters={clearCompanyFilters}
        />
      )}


    

      {/* Enhanced Stats Cards */}
      {/* Enhanced Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${userRole === 'user' ? 'lg:grid-cols-3' :
          userRole === 'company' ? 'lg:grid-cols-3' :
            'lg:grid-cols-4'
        } gap-6`}>
        {filteredStats.map((stat, index) => (
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
              {stat.loading && (
                <div className="mt-2">
                  <div className="animate-pulse bg-gray-200 h-2 w-16 rounded"></div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Analytics - For Admin, Company, and Individual Users */}
      {(userRole === 'admin' || userRole === 'company' || userRole === 'user') && (
        <DashboardCharts
          userRole={userRole}
          companyData={companyData}
          userFilterData={userFilterData}
          supabaseData={supabaseData}
        />
      )}

      {/* Company Table Section - Only for Company */}
      {userRole === 'company' && (
        <CompanyTableSection
          companyData={companyData}
          supabaseData={supabaseData}
          filters={companyFilters}
        />
      )}


  {userRole === 'admin' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header & Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Heading */}
              <h2 className="text-xl font-semibold text-gray-900">Team Overview</h2>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
                  value={filterMember}
                  onChange={(e) => setFilterMember(e.target.value)}
                >
                  <option value="">All Members</option>
                  {[...new Set(users.map((u) => u.name))].map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>

                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="busy">Busy</option>
                  <option value="available">Available</option>
                </select>
              </div>
            </div>
          </div>


    {/* ------------------- Mobile Card View ------------------- */}
    <div className="lg:hidden space-y-4 max-h-96 overflow-auto p-4">
      {users && users.length > 0 ? (
        users
          .filter(
            (user) =>
              (filterMember ? user.name === filterMember : true) &&
              (filterStatus ? user.status === filterStatus : true)
          )
          .map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
            >
              {/* Avatar + Name */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-medium text-sm">{user.avatar}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.teamName}</div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-medium">Tasks:</span>{" "}
                  {user.tasksCompleted}/{user.tasksAssigned + user.tasksCompleted}
                </p>
                <p>
                  <span className="font-medium">Assign Date:</span>{" "}
                  {user.assignDate || "No assign date"}
                </p>
                <p>
                  <span className="font-medium">Time Spent:</span> {user.timeSpent}
                </p>
                <div className="flex items-center">
                  <span className="font-medium">Completion Rate:</span>
                  <div className="flex items-center ml-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: `${user.completionRate}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {user.completionRate}%
                    </span>
                  </div>
                </div>
                <p>
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "busy"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </p>
              </div>
            </div>
          ))
      ) : (
        <p className="text-center text-gray-500">
          No team members found in sheet data
        </p>
      )}
    </div>

    {/* ------------------- Desktop Table View ------------------- */}
    <div className="hidden lg:block max-h-96 overflow-auto border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Member
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Team Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tasks
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assign Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time Spent
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completion Rate
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users && users.length > 0 ? (
            users
              .filter(
                (user) =>
                  (filterMember ? user.name === filterMember : true) &&
                  (filterStatus ? user.status === filterStatus : true)
              )
              .map((user) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white font-medium text-sm">
                          {user.avatar}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">Team Member</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.teamName}
                    </div>
                    <div className="text-xs text-gray-500">Team Name</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.tasksCompleted}/{user.tasksAssigned + user.tasksCompleted}
                    </div>
                    <div className="text-xs text-gray-500">Completed/Total</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.assignDate || "No assign date"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.timeSpent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                          style={{ width: `${user.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {user.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === "busy"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                </motion.tr>
              ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="px-6 py-4 text-center text-gray-500"
              >
                No team members found in sheet data
              </td>
            </tr>
          )}
        </tbody>
      </table>
     
{users && users.length === 0 && (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
    <p className="text-yellow-800">No team members found. Check console for details.</p>
    <button 
      onClick={() => console.log('Sheet data:', sheetData)} 
      className="mt-2 text-sm text-yellow-600 underline"
    >
      Log Sheet Data
    </button>
  </div>
)}
    </div>
  </div>
)}


      {/* Project Stages Overview Table - Only for Admin */}
 {userRole === 'admin' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Project Stages Overview
                </h2>
                <p className="text-gray-600">
                  Track project progress through different stages
                </p>
              </div>

              {/* Right Section - Admin Filters */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                <adminFilters
                  projectData={projectData}
                  filters={adminFilters}
                  onFilterChange={handleAdminFilterChange}
                  onClearFilters={clearAdminFilters}
                />
              </div>
            </div>
          </div>



    {/* Desktop Table View */}
    <div className="hidden lg:block max-h-96 overflow-auto border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Description Of Work
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              System Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Party Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Taken From
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Type Of Work
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Posted By
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Stage 1
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Stage 2
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Stage 3
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProjectData && filteredProjectData.length > 0 ? (
            filteredProjectData.map((project) => (
              <motion.tr
                key={project.id}
                className="hover:bg-gray-50 transition-colors"
                whileHover={{ backgroundColor: "#f9fafb" }}
              >
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={project.descriptionOfWork}>
                    {project.descriptionOfWork}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{project.systemName}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{project.partyName}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{project.takenFrom}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{project.typeOfWork}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{project.postedBy}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${project.stage1 === 'Active'
                      ? 'bg-blue-100 text-blue-800'
                      : project.stage1 === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {project.stage1}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${project.stage2 === 'Active'
                      ? 'bg-blue-100 text-blue-800'
                      : project.stage2 === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {project.stage2}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${project.stage3 === 'Active'
                      ? 'bg-blue-100 text-blue-800'
                      : project.stage3 === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {project.stage3}
                  </span>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                No project data found matching the selected filters
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Mobile Card View */}
 <div className="lg:hidden max-h-96 overflow-auto">
      {filteredProjectData && filteredProjectData.length > 0 ? (
        <div className="space-y-4 p-4">
          {filteredProjectData.map((project) => (
            <motion.div
              key={project.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              whileHover={{ backgroundColor: "#f3f4f6" }}
            >
              {/* Project Header */}
              <div className="mb-3">
                <h3 
                  className="text-sm font-medium text-gray-900 mb-1 truncate" 
                  title={project.descriptionOfWork}
                >
                  {project.descriptionOfWork}
                </h3>
                <div 
                  className="text-xs text-gray-500 truncate" 
                  title={project.systemName}
                >
                  {project.systemName}
                </div>
              </div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Party Name</div>
                  <div 
                    className="text-gray-900 font-medium truncate" 
                    title={project.partyName}
                  >
                    {project.partyName}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Taken From</div>
                  <div 
                    className="text-gray-900 truncate" 
                    title={project.takenFrom}
                  >
                    {project.takenFrom}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Type Of Work</div>
                  <div 
                    className="text-gray-900 truncate" 
                    title={project.typeOfWork}
                  >
                    {project.typeOfWork}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Posted By</div>
                  <div 
                    className="text-gray-900 truncate" 
                    title={project.postedBy}
                  >
                    {project.postedBy}
                  </div>
                </div>
              </div>

              {/* Stages Progress */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Project Stages</div>
                <div className="flex justify-between items-center space-x-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">Stage 1</div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-full justify-center truncate ${project.stage1 === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : project.stage1 === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                      title={project.stage1}
                    >
                      {project.stage1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">Stage 2</div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-full justify-center truncate ${project.stage2 === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : project.stage2 === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                      title={project.stage2}
                    >
                      {project.stage2}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">Stage 3</div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full w-full justify-center truncate ${project.stage3 === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : project.stage3 === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                      title={project.stage3}
                    >
                      {project.stage3}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No project data found matching the selected filters
        </div>
      )}
    </div>
  </div>
)}
    </div>
  )
}

// Main AdminDashboard Component
export default function AdminDashboard({ onLogout, username, pagination, activeTab, setActiveTab, user, userFilterData, companyData }) {
  const [tasks, setTasks] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userModalTab, setUserModalTab] = useState("pending")
  const [supabaseData, setSupabaseData] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [projectData, setProjectData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalTask, setTotalTask] = useState(0);
  const [pendingTask, setPendingTask] = useState(0);
  const [completeTask, setCompleteTask] = useState(0);

  const userRole = determineUserRole(username, userFilterData, companyData)

  // Debug user role determination
  console.log('Final userRole determined:', userRole)
  console.log('UserFilterData for role determination:', userFilterData)

  
 useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch FMS data from Supabase
        const data = await fetchSupabaseData();
        setSupabaseData(data);

        // Process team data
        const processedTeamMembers = processTeamDataFromSupabase(data, userRole);
        setTeamMembers(processedTeamMembers);

        // Process project data
        const processedProjectData = processProjectData(data, userRole);
        setProjectData(processedProjectData);

        // Calculate task counts
        await fetchTaskCounts();

      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole, companyData, userFilterData]);

//  const fetchTaskCounts = async () => {
//     try {
//       // Build base query
//       let baseQuery = supabase.from("FMS").select("*", { count: "exact", head: true });

//       if (userRole === "company" && companyData?.companyName) {
//         baseQuery = baseQuery.eq("party_name", companyData.companyName);
//       } else if (userRole === "user" && userFilterData?.username) {
//         baseQuery = baseQuery.eq("employee_name_1", userFilterData.username);
//       }

//       // Total tasks
//       const { count: totalCount, error: totalError } = await baseQuery;
//       if (totalError) throw totalError;
//       setTotalTask(totalCount || 0);

//       // Pending tasks (actual3 is null)
//       let pendingQuery = supabase.from("FMS").select("*", { count: "exact", head: true }).is("actual3", null);
//       if (userRole === "company" && companyData?.companyName) {
//         pendingQuery = pendingQuery.eq("party_name", companyData.companyName);
//       } else if (userRole === "user" && userFilterData?.username) {
//         pendingQuery = pendingQuery.eq("employee_name_1", userFilterData.username);
//       }
//       const { count: pendingCount, error: pendingError } = await pendingQuery;
//       if (pendingError) throw pendingError;
//       setPendingTask(pendingCount || 0);

//       // Completed tasks (actual3 is not null)
//       let completeQuery = supabase.from("FMS").select("*", { count: "exact", head: true }).not("actual3", "is", null);
//       if (userRole === "company" && companyData?.companyName) {
//         completeQuery = completeQuery.eq("party_name", companyData.companyName);
//       } else if (userRole === "user" && userFilterData?.username) {
//         completeQuery = completeQuery.eq("employee_name_1", userFilterData.username);
//       }
//       const { count: completeCount, error: completeError } = await completeQuery;
//       if (completeError) throw completeError;
//       setCompleteTask(completeCount || 0);

//     } catch (error) {
//       console.error("Error fetching task counts:", error);
//     }
//   };

  

  // ENHANCED: User role determination with proper user filtering
 
  // Fetch sheet data on component mount
useEffect(() => {
  const loadSheetData = async () => {
    setLoading(true);
    try {
      console.log("Starting data load for Team Overview...");
      const data = await fetchSheetData();
      console.log("Fetched sheet data:", data);

      if (data && data.length > 0) {
        
        setSheetData(data);

        const processedTeamMembers = processTeamData(data, userRole);
        const processedProjectData=processProjectData(data,userRole);
        console.log("Processed team members:", processedTeamMembers);
        setTeamMembers(processedTeamMembers);
        setProjectData(processedProjectData);
      } else {
        console.warn("No rows returned from FMS table");
      }
    } catch (error) {
      console.error("Error loading sheet data:", error);
    } finally {
      setLoading(false);
    }
  };

  loadSheetData();
}, [userRole]);


  // Fetch task counts from Supabase
  const fetchTaskCounts = async () => {
    try {
      // Build base query
      let baseQuery = supabase.from("FMS").select("*", { count: "exact", head: true });

      if (userRole === "company" && companyData?.companyName) {
        baseQuery = baseQuery.eq("party_name", companyData.companyName);
      } else if (userRole === "user" && userFilterData?.username) {
        baseQuery = baseQuery.eq("employee_name_1", userFilterData.username);
      }

      // Total tasks
      const { count: totalCount, error: totalError } = await baseQuery;
      if (totalError) throw totalError;
      setTotalTask(totalCount || 0);

      // Pending tasks (actual3 is null)
      let pendingQuery = supabase.from("FMS").select("*", { count: "exact", head: true }).is("actual3", null);
      if (userRole === "company" && companyData?.companyName) {
        pendingQuery = pendingQuery.eq("party_name", companyData.companyName);
      } else if (userRole === "user" && userFilterData?.username) {
        pendingQuery = pendingQuery.eq("employee_name_1", userFilterData.username);
      }
      const { count: pendingCount, error: pendingError } = await pendingQuery;
      if (pendingError) throw pendingError;
      setPendingTask(pendingCount || 0);

      // Completed tasks (actual3 is not null)
      let completeQuery = supabase.from("FMS").select("*", { count: "exact", head: true }).not("actual3", "is", null);
      if (userRole === "company" && companyData?.companyName) {
        completeQuery = completeQuery.eq("party_name", companyData.companyName);
      } else if (userRole === "user" && userFilterData?.username) {
        completeQuery = completeQuery.eq("employee_name_1", userFilterData.username);
      }
      const { count: completeCount, error: completeError } = await completeQuery;
      if (completeError) throw completeError;
      setCompleteTask(completeCount || 0);

    } catch (error) {
      console.error("Error fetching task counts:", error);
    }
  };

  // Create stats array with actual data
  const stats = [
    {
      label: "Total Tasks",
      value: loading ? "..." : totalTask.toString(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      change: "+2 this month",
      trend: "up",
      loading: loading,
    },
    {
      label: "Active Tasks",
      value: loading ? "..." :pendingTask.toString(),
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      change: "+5 today",
      trend: "up",
      loading: loading,
    },
    {
      label: "Completed Today",
      value: loading ? "..." : completeTask.toString(),
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      change: "+12% vs yesterday",
      trend: "up",
      loading: loading,
    },
    {
      label: "Pending Issues",
      value: loading ? "..." : pendingTask.toString(),
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      change: "-2 resolved",
      trend: "down",
      loading: loading,
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

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewContent
            users={teamMembers}
            stats={stats}
            activeTasks={[]}
            onViewUser={handleViewUser}
            projectData={projectData}
            userRole={userRole}
            companyData={companyData}
            userFilterData={userFilterData}
            supabaseData={supabaseData}
          />
        )
      case "assign-task": {
        console.log('Assign Task - Using userRole:', userRole)
        return (
          <AssignTaskForm
            userRole={userRole}
            onTaskCreated={handleTaskCreated}
          />
        )
      }
      case "tasks-table":
        return <TasksTable tasks={tasks} />
      case "developer-stage":
        return <DeveloperStagePage />
      case "pending-tasks":
        return <TaskList
          type="pending"
          userFilterData={userFilterData}
          companyData={companyData}
          supabaseData={supabaseData}
        />
      case "completed-tasks":
        return <TaskList
          type="completed"
          userFilterData={userFilterData}
          companyData={companyData}
          supabaseData={supabaseData}
        />
      case "troubleshoot":
        return <TroubleShootPage />
      case "systems":
        return <SystemsList
          userRole={userRole}
          companyData={companyData}
          supabaseData={supabaseData}
        />
      default:
        return (
          <OverviewContent
            users={teamMembers}
            stats={stats}
            activeTasks={[]}
            onViewUser={handleViewUser}
            projectData={projectData}
            userRole={userRole}
            companyData={companyData}
            userFilterData={userFilterData}
            supabaseData={supabaseData}
          />
        )
    }
  }


  return (
    <div className="space-y-6">

      {/* Loading indicator */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-blue-800">Loading sheet data...</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="overflow-auto">{renderContent()}</main>

      {/* User Tasks Modal - Only for admin */}
      {showUserModal && selectedUser && userRole === 'admin' && (
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
                      {selectedUser.tasksCompleted}/{selectedUser.totalTasksGiven} tasks completed •{" "}
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
                  onClick={() => setUserModalTab("inprogress")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${userModalTab === "inprogress"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>In Progress</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {selectedUser.inProgressTasks || 0}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setUserModalTab("completed")}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${userModalTab === "completed"
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed Tasks</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {selectedUser.tasksCompleted || 0}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {userModalTab === "pending" && (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Pending tasks data will be loaded from sheet in future update</p>
                  </div>
                </div>
              )}
              {userModalTab === "completed" && (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Completed tasks data will be loaded from sheet in future update</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
} "use client"

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
  ChevronDown,
} from "lucide-react"
import Button from "../ui/Button"
import AssignTaskForm from "./AssignTaskForm"
import TaskList from "./TaskList"
import TroubleShootPage from "./TroubleShootPage"
import SystemsList from "./SystemsList"
import TasksTable from "./TaskTable"
import DashboardCharts from "./DashboardCharts"
import DeveloperStagePage from "./DeveloperStagePage"
import supabase from "../../supabaseClient"


// Fetch data from Supabase
const fetchSupabaseData = async () => {
  try {
    // Query all rows from FMS table
    const { data, error } = await supabase
      .from("FMS")
      .select("*")
   

    if (error) throw error;

    // Ensure array response
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching Supabase FMS data:", error);
    return [];
  }
};

// Enhanced user role determination (unchanged)
const determineUserRole = (username, userFilterData, companyData) => {
  console.log('Enhanced Role Determination:');
  console.log('  - username:', username);
  console.log('  - userFilterData:', userFilterData);
  console.log('  - companyData:', companyData);

  // Method 1: Check if username is admin (highest priority)
  if (username === 'admin') {
    console.log('  Admin detected via username');
    return 'admin';
  }

  // Method 2: Check userFilterData.isAdmin
  if (userFilterData?.isAdmin === true) {
    console.log('  Admin detected via userFilterData.isAdmin');
    return 'admin';
  }

  // Method 3: Check for company data (company login)
  if (companyData && companyData.companyName && !userFilterData?.username) {
    console.log('  Company detected via companyData');
    return 'company';
  }

  // Method 4: Check if user has individual user data (individual user login)
  if (userFilterData && (userFilterData.username || userFilterData.name || userFilterData.memberName)) {
    console.log('  Individual user detected via userFilterData');
    return 'user';
  }

  // Method 5: Check session storage for role
  if (typeof window !== 'undefined') {
    try {
      const session = sessionStorage.getItem('userSession');
      if (session) {
        const userData = JSON.parse(session);
        if (userData.role === 'admin') {
          console.log('  Admin detected via session storage');
          return 'admin';
        }
        if (userData.role === 'company') {
          console.log('  Company detected via session storage');
          return 'company';
        }
        if (userData.role === 'user') {
          console.log('  User detected via session storage');
          return 'user';
        }
      }
    } catch (error) {
      console.log('  Error reading session storage:', error);
    }
  }

  // Default to user if we have user data, otherwise admin
  const defaultRole = userFilterData ? 'user' : 'admin';
  console.log('  Defaulting to role:', defaultRole);
  return defaultRole;
};

// Calculate stats from Supabase data
const calculateStatsFromSupabase = (supabaseData, userRole = 'admin', companyData = null, userFilterData = null) => {
  if (!supabaseData || !Array.isArray(supabaseData)) {
    return {
      totalTasks: 0,
      activeTasks: 0,
      completedToday: 0,
      pendingIssues: 0
    };
  }

  console.log('Starting data filtering for role:', userRole);
  console.log('Total rows before filtering:', supabaseData.length);

  let filteredData = [...supabaseData];

  // Filter data based on user role
  if (userRole === 'company' && companyData && companyData.companyName) {
    console.log('Filtering data for company:', companyData.companyName);
    
    filteredData = filteredData.filter(item => 
      item.party_name && item.party_name.toLowerCase() === companyData.companyName.toLowerCase()
    );
    
    console.log(`After company filtering: ${filteredData.length} tasks found`);
  }
  else if (userRole === 'user' && userFilterData) {
    console.log('Filtering data for user:', userFilterData);

    let userName = null;
    if (userFilterData.username) {
      userName = userFilterData.username;
    } else if (userFilterData.name) {
      userName = userFilterData.name;
    } else if (userFilterData.memberName) {
      userName = userFilterData.memberName;
    }

    console.log('Final username for filtering:', userName);

    if (userName && userName !== 'undefined' && userName !== 'Unknown User') {
      filteredData = filteredData.filter(item => {
        const employeeName1 = item.employee_name_1 ? item.employee_name_1.toString().trim().toLowerCase() : '';
        const employeeName2 = item.employee_name_2 ? item.employee_name_2.toString().trim().toLowerCase() : '';
        const userNameLower = userName.toLowerCase();
        
        return employeeName1 === userNameLower || employeeName2 === userNameLower;
      });
      
      console.log(`After user filtering: ${filteredData.length} tasks found for user "${userName}"`);
    } else {
      console.log('No valid username found for filtering');
      filteredData = [];
    }
  }

  console.log('Final filtered rows count:', filteredData.length);

  const stats = {
    // Total Tasks: Count all rows
    totalTasks: filteredData.length,

    // Active Tasks: Tasks where actual3 is null (not completed)
    activeTasks: userRole === 'admin' ? filteredData.filter(item => 
      !item.actual3 || item.actual3.toString().trim() === ''
    ).length : 0,

    // Completed Today: Count where actual3 has data (completed)
    completedToday: filteredData.filter(item => 
      item.actual3 && item.actual3.toString().trim() !== ''
    ).length,

    // Pending Issues: Same as active tasks for company/user view
    pendingIssues: filteredData.filter(item => 
      !item.actual3 || item.actual3.toString().trim() === ''
    ).length
  };

  console.log('Final calculated stats:', stats);
  return stats;
};

// Get company table data from Supabase
const getCompanyTableDataFromSupabase = (supabaseData, companyData) => {
  console.log('=== getCompanyTableDataFromSupabase ===');
  console.log('supabaseData available:', !!supabaseData, 'length:', supabaseData?.length);
  console.log('companyData:', companyData);

  if (!supabaseData || !Array.isArray(supabaseData) || !companyData || !companyData.companyName) {
    console.log('Missing required data for company table');
    return [];
  }

  console.log('Getting company table data for:', companyData.companyName);

  // Filter data for the company
  const filteredData = supabaseData.filter(item => 
    item.party_name && item.party_name.toLowerCase() === companyData.companyName.toLowerCase()
  );

  console.log('Filtered company data count:', filteredData.length);

  // Process and format the data
  const tableData = filteredData.map((item, index) => {
    // Determine status based on actual3 field
    let status = 'Not Started';
    if (item.actual3 && item.actual3.toString().trim() !== '') {
      status = 'Completed';
    } else if (item.planned3 && item.planned3.toString().trim() !== '') {
      status = 'In Progress';
    }

    return {
      id: item.id || index + 1,
      taskNo: item.task_no || `Task-${index + 1}`,
      status: status,
      partyName: item.party_name || 'N/A',
      typeOfWork: item.type_of_work || 'N/A',
      systemName: item.system_name || 'N/A',
      descriptionOfWork: item.description_of_work || 'N/A',
      notes: item.notes || 'N/A',
      takenFrom: item.taken_from || 'N/A',
      expectedDateToClose: item.expected_date_to_close || 'N/A',
      priority: item.priority_in_customer || 'Normal',
      linkOfSystem: item.website_link || 'N/A',
      attachmentFile: item.attachment_file || 'N/A',
      actualSubmitDate: item.actual3 || 'N/A'
    };
  }).filter(item => item.taskNo !== '');

  console.log('Final company table data processed:', tableData.length, 'rows');
  console.log('Sample data:', tableData.slice(0, 2));
  console.log('=== getCompanyTableDataFromSupabase DEBUG END ===');

  return tableData;
};

// Function to calculate time difference between two dates (unchanged)
const calculateTimeDifference = (assignDate, submitDate) => {
  if (!assignDate) {
    return '0h 0m';
  }

  try {
    // Parse dates - handle various date formats
    const parseDate = (dateStr) => {
      let date = new Date(dateStr);

      // If invalid, try parsing as DD/MM/YYYY HH:MM format
      if (isNaN(date.getTime())) {
        const parts = dateStr.toString().trim().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
        if (parts) {
          const [, day, month, year, hour, minute] = parts;
          date = new Date(year, month - 1, day, hour, minute);
        }
      }

      return date;
    };

    const assignDateTime = parseDate(assignDate);

    // If no submit date provided, use current date and time
    let endDateTime;
    if (!submitDate || submitDate.toString().trim() === '') {
      endDateTime = new Date();
    } else {
      endDateTime = parseDate(submitDate);
    }

    if (isNaN(assignDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return '0h 0m';
    }

    // Calculate difference in milliseconds
    const timeDifferenceMs = endDateTime.getTime() - assignDateTime.getTime();

    if (timeDifferenceMs < 0) {
      return '0h 0m';
    }

    // Convert to hours and minutes
    const totalMinutes = Math.floor(timeDifferenceMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  } catch (error) {
    return '0h 0m';
  }
};

// Format date function (unchanged)
const formatDateToDDMMYY = (dateInput) => {
  if (!dateInput || dateInput.toString().trim() === '') {
    return 'No assign date';
  }

  try {
    let date;
    const dateStr = dateInput.toString().trim();
    
    // Handle different date formats
    if (dateStr.includes('/')) {
      date = new Date(dateStr);
    } else if (dateStr.includes('-')) {
      date = new Date(dateStr);
    } else if (!isNaN(dateStr) && dateStr.length > 4) {
      const excelEpoch = new Date(1899, 11, 30);
      const days = parseInt(dateStr);
      date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
    } else {
      date = new Date(dateStr);
    }

    if (isNaN(date.getTime())) {
      return dateStr;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateInput.toString().trim();
  }
};

// Process team data from Supabase
const processTeamDataFromSupabase = (supabaseData, userRole = "admin") => {
  console.log("=== processTeamDataFromSupabase DEBUG START ===");
  console.log("userRole:", userRole);

  if (userRole !== "admin") {
    console.log("Not admin role, returning empty array");
    return [];
  }

  if (!supabaseData || !Array.isArray(supabaseData)) {
    console.log("No valid supabase data, returning empty array");
    return [];
  }

  console.log("Supabase data received:", supabaseData.length, "rows");

  const teamMap = new Map();

  supabaseData.forEach((item) => {
    const memberName = item.employee_name_1?.trim();
    if (!memberName) return;

    const teamName = item.team_name || "No Team";
    const plannedData = item.planned3;
    const assignDate = item.actual2;
    const actualData = item.actual3;

    if (!teamMap.has(memberName)) {
      teamMap.set(memberName, {
        id: teamMap.size + 1,
        name: memberName,
        teamName,
        avatar: memberName.charAt(0).toUpperCase(),
        assignDate: assignDate || "No assign date",
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        status: "available",
      });
    }

    const member = teamMap.get(memberName);
    member.totalTasks++;

    const plannedHasData = plannedData && plannedData.toString().trim() !== "";
    const actualHasData = actualData && actualData.toString().trim() !== "";

    if (plannedHasData && actualHasData) {
      member.completedTasks++;
      member.status = "available";
    } else if (plannedHasData && !actualHasData) {
      member.pendingTasks++;
      member.status = "busy";
    }
  });

  const teamMembers = Array.from(teamMap.values()).map((member) => ({
    ...member,
    tasksAssigned: member.pendingTasks,
    tasksCompleted: member.completedTasks,
    totalTasksGiven: member.totalTasks,
    completionRate: member.totalTasks
      ? Math.round((member.completedTasks / member.totalTasks) * 100)
      : 0,
  }));

  console.log("=== processTeamDataFromSupabase SUMMARY ===");
  console.log("Team members found:", teamMembers.length);
  console.log("Sample team members:", teamMembers.slice(0, 3));
  console.log("=== processTeamDataFromSupabase DEBUG END ===");

  return teamMembers;
};

// Process project data from Supabase (unchanged from your version)
const processProjectData = (supabaseData, userRole = 'admin') => {
  console.log('=== processProjectData DEBUG START ===');
  console.log('userRole:', userRole);
  console.log('supabaseData available:', !!supabaseData);
  console.log('supabaseData length:', supabaseData ? supabaseData.length : 0);

  if (userRole !== 'admin') {
    console.log('Not admin role, returning empty array');
    return [];
  }

  if (!supabaseData || !Array.isArray(supabaseData)) {
    console.log('No valid supabase data, returning empty array');
    return [];
  }

  console.log('Supabase data sample:', supabaseData.slice(0, 2));

  const determineStage = (record) => {
    const {
      planned1,
      actual1,
      planned2,
      actual2,
      planned3,
      actual3
    } = record;

    const hasData = (field) => field && field.toString().trim() !== '';
    const isEmpty = (field) => !field || field.toString().trim() === '';

    if (hasData(planned1) && isEmpty(actual1)) {
      return 'Stage 1';
    }

    if (hasData(planned1) && hasData(actual1) && hasData(planned2) && isEmpty(actual2)) {
      return 'Stage 2';
    }

    if (hasData(planned2) && hasData(actual2) && hasData(planned3) && isEmpty(actual3)) {
      return 'Stage 3';
    }

    if (hasData(planned3) && hasData(actual3)) {
      return 'Completed';
    }

    return 'Not Started';
  };

  const projectData = [];
  let processedCount = 0;

  supabaseData.forEach((record, index) => {
    if (!record || typeof record !== 'object') {
      console.log(`Record ${index} is not valid:`, record);
      return;
    }

    const taskNo = record.task_no;
    const descriptionOfWork = record.description_of_work;
    
    if ((!taskNo || taskNo.toString().trim() === '') && 
        (!descriptionOfWork || descriptionOfWork.toString().trim() === '')) {
      console.log(`Skipping record ${index + 1}: No Task No or Description`);
      return;
    }

    processedCount++;

    const postedBy = record.posted_by;
    const typeOfWork = record.type_of_work;
    const takenFrom = record.taken_from;
    const partyName = record.party_name;
    const systemName = record.system_name;

    const currentStage = determineStage(record);

    const projectItem = {
      id: record.id || processedCount,
      taskNo: taskNo ? taskNo.toString().trim() : `Task-${processedCount}`,
      postedBy: postedBy ? postedBy.toString().trim() : 'N/A',
      typeOfWork: typeOfWork ? typeOfWork.toString().trim() : 'N/A',
      takenFrom: takenFrom ? takenFrom.toString().trim() : 'N/A',
      partyName: partyName ? partyName.toString().trim() : 'N/A',
      systemName: systemName ? systemName.toString().trim() : 'N/A',
      descriptionOfWork: descriptionOfWork ? descriptionOfWork.toString().trim() : 'N/A',
      stage1: currentStage === 'Stage 1' ? 'Active' : 
              (currentStage === 'Stage 2' || currentStage === 'Stage 3' || currentStage === 'Completed') ? 'Completed' : 'Pending',
      stage2: currentStage === 'Stage 2' ? 'Active' : 
              (currentStage === 'Stage 3' || currentStage === 'Completed') ? 'Completed' : 'Pending',
      stage3: currentStage === 'Stage 3' ? 'Active' : 
              currentStage === 'Completed' ? 'Completed' : 'Pending',
      currentStage: currentStage,
      priority: 'Normal',
      planned1: record.planned1 || '',
      actual1: record.actual1 || '',
      planned2: record.planned2 || '',
      actual2: record.actual2 || '',
      planned3: record.planned3 || '',
      actual3: record.actual3 || '',
      timestamp: record.timestamp || '',
      givenDate: record.given_date || '',
      status: record.status || '',
      teamName: record.team_name || '',
      assignedBy: record.assigned_by || ''
    };

    projectData.push(projectItem);
  });

  console.log('=== processProjectData SUMMARY ===');
  console.log('Total records processed:', processedCount);
  console.log('Final project data length:', projectData.length);
  console.log('=== processProjectData DEBUG END ===');

  return projectData;
};

// Company Filters Component for Supabase
function CompanyFilters({ companyData, supabaseData, filters, onFilterChange, onClearFilters }) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (supabaseData && companyData) {
      const data = supabaseData.filter(item => 
        item.party_name && item.party_name.toLowerCase() === companyData.companyName.toLowerCase()
      );
      setFilteredData(data);
    }
  }, [supabaseData, companyData]);

  // Get unique values with counts for dropdowns
  const getTypeOfWorkWithCounts = () => {
    const typeOfWorkCounts = {};
    filteredData.forEach(item => {
      if (item.type_of_work) {
        typeOfWorkCounts[item.type_of_work] = (typeOfWorkCounts[item.type_of_work] || 0) + 1;
      }
    });
    return Object.entries(typeOfWorkCounts).map(([type, count]) => ({
      value: type,
      label: `${type}`,
      count: count
    }));
  };

  const getStatusWithCounts = () => {
    const statusCounts = {
      'In Progress': 0,
      'Completed': 0
    };
    
    filteredData.forEach(item => {
      const status = item.actual3 ? 'Completed' : 'In Progress';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      value: status,
      label: `${status}`,
      count: count
    }));
  };

  const getPriorityWithCounts = () => {
    const priorityCounts = {};
    filteredData.forEach(item => {
      if (item.priority_in_customer) {
        priorityCounts[item.priority_in_customer] = (priorityCounts[item.priority_in_customer] || 0) + 1;
      }
    });
    return Object.entries(priorityCounts).map(([priority, count]) => ({
      value: priority,
      label: `${priority}`,
      count: count
    }));
  };

  const typeOfWorkOptions = getTypeOfWorkWithCounts();
  const statusOptions = getStatusWithCounts();
  const priorityOptions = getPriorityWithCounts();

  return (
    <div className="bg-white shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-3 gap-4 items-center">
        {/* Type of Work Filter */}
        <div className="relative">
          <select
            value={filters.typeOfWork}
            onChange={(e) => onFilterChange('typeOfWork', e.target.value)}
            className="appearance-none w-full bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-white/90 hover:border-gray-300/70 transition-all duration-200 shadow-sm"
          >
            <option value="">All Type of Work</option>
            {typeOfWorkOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="appearance-none w-full bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-white/90 hover:border-gray-300/70 transition-all duration-200 shadow-sm"
          >
            <option value="">All Status</option>
            {statusOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Priority Filter */}
        <div className="relative">
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="appearance-none w-full bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 hover:bg-white/90 hover:border-gray-300/70 transition-all duration-200 shadow-sm"
          >
            <option value="">All Priority</option>
            {priorityOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/* Clear Filters Button */}
        {(filters.typeOfWork || filters.status || filters.priority) && (
          <div className="col-span-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="bg-white/70 backdrop-blur-sm border-gray-200/60 text-gray-700 hover:bg-white/90 hover:text-gray-900 hover:border-gray-300/70 transition-all duration-200 shadow-sm font-medium px-4 py-2.5"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Company Table Component for Supabase
function CompanyTableSection({ companyData, supabaseData, filters }) {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (supabaseData && companyData) {
      // First filter by company
      let data = supabaseData.filter(item => 
        item.party_name && item.party_name.toLowerCase() === companyData.companyName.toLowerCase()
      );

      // Then apply additional filters
      if (filters.typeOfWork) {
        data = data.filter(item => item.type_of_work === filters.typeOfWork);
      }

      if (filters.status) {
        data = data.filter(item => {
          const itemStatus = item.actual3 ? 'Completed' : 'In Progress';
          return itemStatus === filters.status;
        });
      }

      if (filters.priority) {
        data = data.filter(item => item.priority_in_customer === filters.priority);
      }

      setFilteredData(data);
    }
  }, [supabaseData, companyData, filters]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Tasks Overview</h2>
            <p className="text-sm md:text-base text-gray-600">Track your company's tasks and progress</p>
          </div>
          <div className="text-sm text-gray-500">
            {filteredData.length} tasks found
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block max-h-96 overflow-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-blue-500 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Type of Work
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                System Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Description of Work
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Expected Date to Close
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((item) => {
                const status = item.actual3 ? 'Completed' : 'In Progress';
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.type_of_work || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.system_name || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {item.description_of_work || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(item.expected_date_to_close)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.priority_in_customer === 'High'
                            ? 'bg-red-100 text-red-800'
                            : item.priority_in_customer === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {item.priority_in_customer || 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.employee_name_1 || 'N/A'}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No tasks found matching the selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden max-h-96 overflow-y-auto p-4 space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const status = item.actual3 ? 'Completed' : 'In Progress';
            
            return (
              <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {status}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.priority_in_customer === 'High'
                        ? 'bg-red-100 text-red-800'
                        : item.priority_in_customer === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {item.priority_in_customer || 'Normal'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-600">Type:</span>
                    <div className="text-sm text-gray-900 font-medium">{item.type_of_work || 'N/A'}</div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-600">System:</span>
                    <div className="text-sm text-gray-900">{item.system_name || 'N/A'}</div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-600">Description:</span>
                    <div className="text-sm text-gray-900">{item.description_of_work || 'N/A'}</div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-600">Due Date:</span>
                    <div className="text-sm text-gray-900">
                      {formatDate(item.expected_date_to_close)}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-600">Assigned To:</span>
                    <div className="text-sm text-gray-900">{item.employee_name_1 || 'N/A'}</div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">No tasks found matching the selected filters</div>
          </div>
        )}
      </div>
    </div>
  );
}