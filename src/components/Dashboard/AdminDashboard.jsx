// OverviewContent Component with User Role Support
function OverviewContent({ users, stats, activeTasks, onViewUser, projectData, userRole, companyData, userFilterData, sheetData, masterSheetData }) {
  // Company filters state
  const [companyFilters, setCompanyFilters] = useState({
    typeOfWork: '',
    status: '',
    priority: ''
  })

  // Admin filters state
  const [adminFilters, setAdminFilters] = useState({
    priority: '',
    systemName: ''
  })

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

  // Handle company filter changes
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
      priority: '',
      systemName: ''
    })
  }

  // Filter project data for admin based on filters
  const filteredProjectData = projectData.filter(project => {
    if (adminFilters.priority && project.priority !== adminFilters.priority) return false
    if (adminFilters.systemName && project.systemName !== adminFilters.systemName) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Company Filters at the top - Only for Company */}
      {userRole === 'company' && (
        <CompanyFilters
          companyData={companyData}
          sheetData={sheetData}
          masterSheetData={masterSheetData}
          filters={companyFilters}
          onFilterChange={handleCompanyFilterChange}
          onClearFilters={clearCompanyFilters}
        />
      )}

      {/* Admin Filters at the top - Only for Admin */}
      {userRole === 'admin' && (
        <AdminFilters
          projectData={projectData}
          filters={adminFilters}
          onFilterChange={handleAdminFilterChange}
          onClearFilters={clearAdminFilters}
        />
      )}

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
        />
      )}

      {/* Company Table Section - Only for Company */}
      {userRole === 'company' && (
        <CompanyTableSection
          companyData={companyData}
          sheetData={sheetData}
          masterSheetData={masterSheetData}
          filters={companyFilters}
        />
      )}

      {/* Enhanced Team Overview - Only for Admin */}
     {userRole === 'admin' && (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Team Overview</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
    </div>

    {/* Desktop Table View */}
    <div className="hidden lg:block max-h-96 overflow-auto border border-gray-200 rounded-lg">
      <table className="w-full">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Team Member
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Team Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Tasks
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Assign Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Time Spent
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Total Tasks Given
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Completion Rate
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users && users.length > 0 ? (
            users.map((user) => (
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
                  <div className="text-sm font-medium text-gray-900">{user.teamName}</div>
                  <div className="text-xs text-gray-500">Team Name</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.tasksCompleted}/{user.tasksAssigned + user.tasksCompleted}
                  </div>
                  <div className="text-xs text-gray-500">Completed/Total</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.assignDate || 'No assign date'}</div>
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
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${user.status === "busy" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
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
            ))
          ) : (
            <tr>
              <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                No team members found in sheet data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Mobile Card View */}
    <div className="lg:hidden max-h-96 overflow-auto">
      {users && users.length > 0 ? (
        <div className="space-y-4 p-4">
          {users.map((user) => (
            <motion.div
              key={user.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              whileHover={{ backgroundColor: "#f3f4f6" }}
            >
              {/* Header with Avatar and Name */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-medium text-xs">{user.avatar}</span>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.teamName}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewUser(user)}
                    className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-green-600 hover:text-green-900 transition-colors p-1">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === "busy" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                >
                  {user.status}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Tasks</div>
                  <div className="text-gray-900 font-medium">
                    {user.tasksCompleted}/{user.tasksAssigned + user.tasksCompleted}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Time Spent</div>
                  <div className="text-gray-900">{user.timeSpent}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Total Tasks</div>
                  <div className="text-blue-600 font-medium">{user.totalTasksGiven}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Assign Date</div>
                  <div className="text-gray-900">{user.assignDate || 'No assign date'}</div>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="mt-3">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Completion Rate</div>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                      style={{ width: `${user.completionRate}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{user.completionRate}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          No team members found in sheet data
        </div>
      )}
    </div>
  </div>
)}

      {/* Project Stages Overview Table - Only for Admin */}
    {userRole === 'admin' && (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Project Stages Overview</h2>
          <p className="text-gray-600 hidden sm:block">Track project progress through different stages</p>
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
                <h3 className="text-sm font-medium text-gray-900 mb-1">{project.descriptionOfWork}</h3>
                <div className="text-xs text-gray-500">{project.systemName}</div>
              </div>

              {/* Project Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Party Name</div>
                  <div className="text-gray-900 font-medium">{project.partyName}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Taken From</div>
                  <div className="text-gray-900">{project.takenFrom}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Type Of Work</div>
                  <div className="text-gray-900">{project.typeOfWork}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Posted By</div>
                  <div className="text-gray-900">{project.postedBy}</div>
                </div>
              </div>

              {/* Stages Progress */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Project Stages</div>
                <div className="flex justify-between items-center space-x-2">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Stage 1</div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-full justify-center ${project.stage1 === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : project.stage1 === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {project.stage1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Stage 2</div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full w-full justify-center ${project.stage2 === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : project.stage2 === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {project.stage2}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">Stage 3</div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full w-full justify-center ${project.stage3 === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : project.stage3 === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        }`}
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
  const [sheetData, setSheetData] = useState(null)
  const [masterSheetData, setMasterSheetData] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [projectData, setProjectData] = useState([])
  const [statsData, setStatsData] = useState({
    totalTasks: 0,
    activeTasks: 0,
    completedToday: 0,
    pendingIssues: 0
  })
  const [loading, setLoading] = useState(true)

  // ENHANCED: User role determination with proper user filtering
  const userRole = determineUserRole(username, userFilterData, companyData)

  // Debug user role determination
  console.log('Final userRole determined:', userRole)
  console.log('UserFilterData for role determination:', userFilterData)

  // Fetch sheet data on component mount
  useEffect(() => {
    const loadSheetData = async () => {
      setLoading(true)

      try {
        console.log('Starting data load...')
        console.log('User Role:', userRole)
        console.log('Company Data:', companyData)
        console.log('User Filter Data:', userFilterData)

        // Fetch FMS sheet data
        const data = await fetchSheetData()

        // Fetch Master Sheet Link data for company filtering - ALWAYS fetch for company role
        let masterData = null
        if ((userRole === 'company' || userRole === 'admin') && companyData) {
          console.log('Fetching Master Sheet Link for company:', companyData.companyName)
          masterData = await fetchMasterSheetLinkData()
          setMasterSheetData(masterData)
          console.log('Master Sheet Link data loaded:', masterData ? masterData.length : 0, 'rows')
        } else if (userRole === 'company') {
          // Try to fetch Master Sheet Link even without companyData
          console.log('Trying to fetch Master Sheet Link for company role')
          masterData = await fetchMasterSheetLinkData()
          setMasterSheetData(masterData)
          console.log('Master Sheet Link data loaded:', masterData ? masterData.length : 0, 'rows')
        }

        if (data) {
          setSheetData(data)
          console.log('FMS Sheet data loaded:', data.length, 'rows')

          // ENHANCED: Pass userFilterData to calculateStats for proper user filtering
          const calculatedStats = calculateStats(data, userRole, companyData, masterData, userFilterData)
          console.log('Calculated stats for role', userRole, ':', calculatedStats)
          setStatsData(calculatedStats)

          // Process team data (only for admin)
          const processedTeamMembers = processTeamData(data, userRole)
          setTeamMembers(processedTeamMembers)

          // Process project data (only for admin)
          const processedProjectData = processProjectData(data, userRole)
          setProjectData(processedProjectData)
        }
      } catch (error) {
        console.error('Error loading sheet data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSheetData()
  }, [userRole, companyData, userFilterData]) // Added userFilterData as dependency

  // Create stats array with actual data
  const stats = [
    {
      label: "Total Tasks",
      value: loading ? "..." : statsData.totalTasks.toString(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      change: "+2 this month",
      trend: "up",
      loading: loading,
    },
    {
      label: "Active Tasks",
      value: loading ? "..." : statsData.activeTasks.toString(),
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      change: "+5 today",
      trend: "up",
      loading: loading,
    },
    {
      label: "Completed Today",
      value: loading ? "..." : statsData.completedToday.toString(),
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      change: "+12% vs yesterday",
      trend: "up",
      loading: loading,
    },
    {
      label: "Pending Issues",
      value: loading ? "..." : statsData.pendingIssues.toString(),
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
            sheetData={sheetData}
            masterSheetData={masterSheetData}
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
        />
      case "completed-tasks":
        return <TaskList
          type="completed"
          userFilterData={userFilterData}
          companyData={companyData}
        />
      case "troubleshoot":
        return <TroubleShootPage />
      case "systems":
        return <SystemsList
          userRole={userRole}
          companyData={companyData}
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
            sheetData={sheetData}
            masterSheetData={masterSheetData}
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

// Function to fetch data from Google Sheets
const fetchSheetData = async () => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=FMS')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Handle different response formats
    if (data && typeof data === 'object') {
      if (data.data && Array.isArray(data.data)) {
        return data.data
      }
      if (data.FMS && Array.isArray(data.FMS)) {
        return data.FMS
      }
      if (Array.isArray(data)) {
        return data
      }
      if (data.values && Array.isArray(data.values)) {
        return data.values
      }
    }

    return data
  } catch (error) {
    console.error('Error fetching sheet data:', error)
    return null
  }
}

// Function to fetch Master Sheet Link data for company matching
const fetchMasterSheetLinkData = async () => {
  try {
    const payload = new URLSearchParams()
    payload.append("action", "getMasterSheetData")
    payload.append("sheet", "Master Sheet Link")

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload,
      }
    )

    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    // Fallback: try GET method with sheet parameter
    try {
      const timestamp = new Date().getTime()
      const response = await fetch(`https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec?sheet=Master Sheet Link&timestamp=${timestamp}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.success ? data.data : null
    } catch (fallbackError) {
      console.error("Error fetching Master Sheet Link data:", fallbackError)
      return null
    }
  }
}

// Function to get party names that match the logged-in company
const getCompanyPartyNames = (companyName, masterSheetData) => {
  if (!companyName || !masterSheetData || !Array.isArray(masterSheetData)) {
    console.log('Missing data for company matching:')
    console.log('  - Company Name:', companyName)
    console.log('  - Master Sheet Data:', masterSheetData ? 'Available' : 'Missing')
    console.log('  - Is Array:', Array.isArray(masterSheetData))
    return []
  }

  console.log('Looking for company:', companyName)
  console.log('Master Sheet data rows:', masterSheetData.length)

  const matchingParties = []

  // Skip header row (start from index 1)
  for (let i = 1; i < masterSheetData.length; i++) {
    const row = masterSheetData[i]
    if (!row || !Array.isArray(row)) continue

    const companyNameInSheet = row[2] ? row[2].toString().trim() : '' // Column C (index 2)

    if (companyNameInSheet.toLowerCase() === companyName.toLowerCase()) {
      console.log('Found matching company in Master Sheet Link:', companyNameInSheet)

      // Check multiple columns for potential party names
      const possiblePartyColumns = [2, 6, 7, 8] // Column C, G, H, I

      for (const colIndex of possiblePartyColumns) {
        if (row[colIndex]) {
          const partyName = row[colIndex].toString().trim()
          if (partyName && !matchingParties.includes(partyName)) {
            matchingParties.push(partyName)
            console.log(`Added party name: "${partyName}" from column ${colIndex} for company "${companyName}"`)
          }
        }
      }

      // If no specific party mapping found, use company name as party name
      if (matchingParties.length === 0) {
        matchingParties.push(companyNameInSheet)
        console.log(`Using company name "${companyNameInSheet}" as party name`)
      }
    }
  }

  console.log('Final matching parties:', matchingParties)
  return matchingParties
}

// Enhanced user role determination
const determineUserRole = (username, userFilterData, companyData) => {
  console.log('Enhanced Role Determination:')
  console.log('  - username:', username)
  console.log('  - userFilterData:', userFilterData)
  console.log('  - companyData:', companyData)

  // Method 1: Check if username is admin (highest priority)
  if (username === 'admin') {
    console.log('  Admin detected via username')
    return 'admin'
  }

  // Method 2: Check userFilterData.isAdmin
  if (userFilterData?.isAdmin === true) {
    console.log('  Admin detected via userFilterData.isAdmin')
    return 'admin'
  }

  // Method 3: Check for company data (company login)
  if (companyData && companyData.companyName && !userFilterData?.username) {
    console.log('  Company detected via companyData')
    return 'company'
  }

  // Method 4: Check if user has individual user data (individual user login)
  if (userFilterData && (userFilterData.username || userFilterData.name || userFilterData.memberName)) {
    console.log('  Individual user detected via userFilterData')
    return 'user'
  }

  // Method 5: Check session storage for role
  if (typeof window !== 'undefined') {
    try {
      const session = sessionStorage.getItem('userSession')
      if (session) {
        const userData = JSON.parse(session)
        if (userData.role === 'admin') {
          console.log('  Admin detected via session storage')
          return 'admin'
        }
        if (userData.role === 'company') {
          console.log('  Company detected via session storage')
          return 'company'
        }
        if (userData.role === 'user') {
          console.log('  User detected via session storage')
          return 'user'
        }
      }
    } catch (error) {
      console.log('  Error reading session storage:', error)
    }
  }

  // Default to user if we have user data, otherwise admin
  const defaultRole = userFilterData ? 'user' : 'admin'
  console.log('  Defaulting to role:', defaultRole)
  return defaultRole
}

// Enhanced calculateStats function with user role filtering - SUPPORTS BOTH COLUMN X AND Y
const calculateStats = (sheetData, userRole = 'admin', companyData = null, masterSheetData = null, userFilterData = null) => {
  if (!sheetData || !Array.isArray(sheetData)) {
    return {
      totalTasks: 0,
      activeTasks: 0,
      completedToday: 0,
      pendingIssues: 0
    }
  }

  // Find header row and Task No. column
  let headerRowIndex = -1
  let taskNoColumnIndex = -1

  // Search for "Task No." header in first few rows
  for (let i = 0; i < Math.min(10, sheetData.length); i++) {
    const row = sheetData[i]
    if (Array.isArray(row)) {
      for (let j = 0; j < row.length; j++) {
        const cell = row[j]
        if (cell && typeof cell === 'string') {
          if (cell.toLowerCase().includes('task no') || cell.toLowerCase() === 'task no.') {
            headerRowIndex = i
            taskNoColumnIndex = j
            break
          }
        }
      }
      if (headerRowIndex !== -1) break
    }
  }

  // If not found, use default positions
  if (headerRowIndex === -1) {
    if (sheetData.length > 5 && sheetData[5] && sheetData[5][1]) {
      headerRowIndex = 5
      taskNoColumnIndex = 1
    } else {
      headerRowIndex = 0
      taskNoColumnIndex = 1
    }
  }

  // Column mappings: A=0, B=1, ..., G=6, R=17, AB=27, AC=28
  const columnGIndex = 6  // Party Name (Column G)
  const columnRIndex = 17 // Team/Member Name (Column R)
  const columnABIndex = 27 // Column AB
  const columnACIndex = 28 // Column AC

  // Get data rows (skip header and rows before data)
  const dataStartRow = Math.max(headerRowIndex + 1, 6)
  let dataRows = sheetData.slice(dataStartRow)

  console.log('Starting data filtering for role:', userRole)
  console.log('Total rows before filtering:', dataRows.length)

  // Filter data based on user role
  if (userRole === 'company' && companyData && companyData.companyName) {
    console.log('Filtering data for company:', companyData.companyName)

    // Get matching party names from Master Sheet Link
    const matchingPartyNames = getCompanyPartyNames(companyData.companyName, masterSheetData)
    console.log('Matching party names found:', matchingPartyNames)

    if (matchingPartyNames.length > 0) {
      const originalLength = dataRows.length
      dataRows = dataRows.filter(row => {
        if (!row || row.length <= columnGIndex) return false

        const partyName = row[columnGIndex] ? row[columnGIndex].toString().trim() : ''

        // Check if party name matches any of the company's party names
        const matches = matchingPartyNames.some(companyParty =>
          partyName.toLowerCase() === companyParty.toLowerCase()
        )

        return matches
      })

      console.log(`After company filtering: ${dataRows.length} tasks found (from ${originalLength} total)`)
    } else {
      // Fallback: direct company name matching
      console.log('No party names found, trying direct company name matching')
      const originalLength = dataRows.length
      dataRows = dataRows.filter(row => {
        if (!row || row.length <= columnGIndex) return false

        const partyName = row[columnGIndex] ? row[columnGIndex].toString().trim().toLowerCase() : ''
        const companyNameLower = companyData.companyName.toLowerCase()

        return partyName === companyNameLower
      })

      console.log(`Fallback filtering: ${dataRows.length} tasks found (from ${originalLength} total)`)
    }
  }
  else if (userRole === 'user' && userFilterData) {
    console.log('Filtering data for user:', userFilterData)

    const originalLength = dataRows.length

    // Get username (already working)
    let userName = null
    if (userFilterData.username) {
      userName = userFilterData.username
    } else if (userFilterData.name) {
      userName = userFilterData.name
    } else if (userFilterData.memberName) {
      userName = userFilterData.memberName
    } else if (userFilterData.userRowData && userFilterData.userRowData[23]) {
      userName = userFilterData.userRowData[23].toString().trim()
    } else if (userFilterData.userRowData && userFilterData.userRowData[24]) {
      userName = userFilterData.userRowData[24].toString().trim()
    }

    console.log('Final username for filtering:', userName)

    if (userName && userName !== 'undefined' && userName !== 'Unknown User') {
      console.log('Looking for user in BOTH Column X and Column Y:', userName)

      // UPDATED LOGIC: Check BOTH Column X (index 23) AND Column Y (index 24)
      dataRows = dataRows.filter(row => {
        if (!row || row.length <= 24) return false // Check both columns exist

        const columnXValue = row[23] ? row[23].toString().trim() : '' // Column X (assigned user)
        const columnYValue = row[24] ? row[24].toString().trim() : '' // Column Y (alternate assignment)
        
        // Check if user matches EITHER Column X OR Column Y
        const matchesColumnX = columnXValue.toLowerCase() === userName.toLowerCase()
        const matchesColumnY = columnYValue.toLowerCase() === userName.toLowerCase()
        
        const matches = matchesColumnX || matchesColumnY

        if (matches) {
          console.log('Found task for user:', userName)
          console.log('  - Column X Value:', columnXValue)
          console.log('  - Column Y Value:', columnYValue)
          console.log('  - Matched in:', matchesColumnX ? 'Column X' : 'Column Y')
          console.log('  - Task:', row[taskNoColumnIndex])
          console.log('  - Team Member (Column R):', row[columnRIndex] || 'N/A')
          console.log('  - Description:', row[8] ? row[8].toString().slice(0, 50) + '...' : 'N/A')
          console.log('  - Column AB:', row[columnABIndex] || 'Empty')
          console.log('  - Column AC:', row[columnACIndex] || 'Empty')
        }

        return matches
      })

      console.log(`After Column X & Y filtering: ${dataRows.length} tasks found for user "${userName}" (from ${originalLength} total)`)

      // Debug if no matches found
      if (dataRows.length === 0) {
        console.log('No tasks found in Column X or Y. Checking available values:')
        
        // Check Column X values
        console.log('Column X values:')
        const allColumnXValues = [...new Set(sheetData.slice(dataStartRow)
          .map(row => row[23] ? row[23].toString().trim() : '')
          .filter(name => name !== ''))]

        allColumnXValues.slice(0, 10).forEach((value, idx) => {
          const isMatch = value.toLowerCase() === userName.toLowerCase()
          console.log(`  ${idx + 1}. "${value}" ${isMatch ? '← MATCH!' : ''}`)
        })

        // Check Column Y values
        console.log('Column Y values:')
        const allColumnYValues = [...new Set(sheetData.slice(dataStartRow)
          .map(row => row[24] ? row[24].toString().trim() : '')
          .filter(name => name !== ''))]

        allColumnYValues.slice(0, 10).forEach((value, idx) => {
          const isMatch = value.toLowerCase() === userName.toLowerCase()
          console.log(`  ${idx + 1}. "${value}" ${isMatch ? '← MATCH!' : ''}`)
        })

        console.log(`Total unique Column X values: ${allColumnXValues.length}`)
        console.log(`Total unique Column Y values: ${allColumnYValues.length}`)
      }
    } else {
      console.log('No valid username found for filtering')
      dataRows = []
    }
  }

  console.log('Final filtered rows count:', dataRows.length)

  const stats = {
    // Total Tasks: Count all rows with data in Task No. column (filtered by user role)
    totalTasks: dataRows.filter(row => {
      const hasTaskNo = row && row.length > taskNoColumnIndex &&
        row[taskNoColumnIndex] &&
        row[taskNoColumnIndex].toString().trim() !== ''

      if (userRole === 'user' && hasTaskNo) {
        console.log('Counting total task:', row[taskNoColumnIndex])
      }

      return hasTaskNo
    }).length,

    // Active Tasks: Tasks with Task No. + AB has data + AC is empty (only for admin)
    activeTasks: userRole === 'admin' ? dataRows.filter(row => {
      if (!row || row.length <= taskNoColumnIndex) return false

      const hasTaskNo = row[taskNoColumnIndex] && row[taskNoColumnIndex].toString().trim() !== ''
      const hasABData = row.length > columnABIndex && row[columnABIndex] && row[columnABIndex].toString().trim() !== ''
      const acIsEmpty = row.length <= columnACIndex || !row[columnACIndex] || row[columnACIndex].toString().trim() === ''

      return hasTaskNo && hasABData && acIsEmpty
    }).length : 0,

    // Completed Today: Count where both AB and AC have data
    completedToday: dataRows.filter(row => {
      if (!row || row.length <= columnABIndex) return false

      const abHasData = row[columnABIndex] && row[columnABIndex].toString().trim() !== ''
      const acHasData = row.length > columnACIndex && row[columnACIndex] && row[columnACIndex].toString().trim() !== ''
      const hasTaskNo = row[taskNoColumnIndex] && row[taskNoColumnIndex].toString().trim() !== ''

      const isCompleted = hasTaskNo && abHasData && acHasData

      if (userRole === 'user' && isCompleted) {
        console.log('Counting completed task:', row[taskNoColumnIndex])
      }

      return isCompleted
    }).length,

    // Pending Issues: Count where AB has data but AC is empty
    pendingIssues: dataRows.filter(row => {
      if (!row || row.length <= columnABIndex) return false

      const abHasData = row[columnABIndex] && row[columnABIndex].toString().trim() !== ''
      const acIsEmpty = row.length <= columnACIndex || !row[columnACIndex] || row[columnACIndex].toString().trim() === ''
      const hasTaskNo = row[taskNoColumnIndex] && row[taskNoColumnIndex].toString().trim() !== ''

      const isPending = hasTaskNo && abHasData && acIsEmpty

      if (userRole === 'user' && isPending) {
        console.log('Counting pending task:', row[taskNoColumnIndex])
      }

      return isPending
    }).length
  }

  console.log('Final calculated stats:', stats)
  return stats
}


// Updated getCompanyTableData function with correct FMS column mapping
const getCompanyTableData = (sheetData, companyData, masterSheetData) => {
  console.log('=== getCompanyTableData with FMS Column Mapping ===')
  console.log('sheetData available:', !!sheetData, 'length:', sheetData?.length)
  console.log('companyData:', companyData)
  console.log('masterSheetData available:', !!masterSheetData, 'length:', masterSheetData?.length)

  if (!sheetData || !Array.isArray(sheetData) || !companyData || !companyData.companyName) {
    console.log('Missing required data for company table')
    return []
  }

  console.log('Getting company table data for:', companyData.companyName)

  // Get data rows (starting from row 6 to skip headers) - FMS data
  const dataStartRow = 6
  let dataRows = sheetData.slice(dataStartRow)
  console.log('Total FMS data rows before filtering:', dataRows.length)

  // Filter FMS data based on logged-in company's party name (Column G = companyName)
  // Include rows where AB has data (both In Progress and Completed)
  const filteredFMSData = dataRows.filter(row => {
    if (!row || row.length <= 27) return false

    const partyName = row[6] ? row[6].toString().trim().toLowerCase() : '' // Column G
    const companyNameLower = companyData.companyName.toLowerCase().trim()
    const columnAB = row[27] ? row[27].toString().trim() : '' // Column AB

    const partyMatch = partyName === companyNameLower
    const hasABData = columnAB !== '' // Only need AB data for both In Progress and Completed

    if (partyMatch && hasABData) {
      console.log('Found matching FMS record for party:', partyName)
    }

    return partyMatch && hasABData
  })

  console.log('Filtered FMS data count:', filteredFMSData.length)

  // Process and format the data with correct FMS column mapping
  const tableData = filteredFMSData.map((row, index) => {
    if (!row || row.length <= 1) return null

    // Determine status based on AB and AC columns (SystemsList logic)
    const abHasData = row[27] && row[27].toString().trim() !== '' // Column AB
    const acHasData = row[28] && row[28].toString().trim() !== '' // Column AC

    let status = 'Not Started'
    if (abHasData && acHasData) {
      status = 'Completed'
    } else if (abHasData && !acHasData) {
      status = 'In Progress'
    }

    // Only include tasks that have AB data (both In Progress and Completed)
    // Remove the status filter to show both completed and in-progress tasks

    // FMS Sheet Column Mapping:
    // A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7, I=8, J=9, K=10, L=11, M=12, N=13, O=14, P=15...
    const taskData = {
      id: index + 1,
      taskNo: row[1] ? row[1].toString().trim() : '', // Column B (Task No.)
      status: status,
      partyName: row[6] ? row[6].toString().trim() : 'N/A', // Column G (Party Name)
      typeOfWork: row[4] ? row[4].toString().trim() : 'N/A', // Column E (Type Of Work)
      systemName: row[7] ? row[7].toString().trim() : 'N/A', // Column H (System Name)
      descriptionOfWork: row[8] ? row[8].toString().trim() : 'N/A', // Column I (Description Of Work)
      notes: row[12] ? row[12].toString().trim() : 'N/A', // Column J (Notes)
      takenFrom: row[5] ? row[5].toString().trim() : 'N/A', // Column F (Taken From)
      expectedDateToClose: row[13] ? row[13].toString().trim() : 'N/A', // Column AB (Expected date to close)
      priority: row[11] ? row[11].toString().trim() : 'Normal', // Column K (Priority)
      linkOfSystem: row[9] ? row[9].toString().trim() : 'N/A', // Column L (Link of System)
      attachmentFile: row[10] ? row[10].toString().trim() : 'N/A', // Column M (Attachment File)
      actualSubmitDate: row[28] ? row[28].toString().trim() : 'N/A', // Column AC (Actual Submit Date)
    }

    console.log('Processing task:', taskData.taskNo, 'Status:', status, 'Party:', taskData.partyName)
    return taskData
  }).filter(item => item !== null && item.taskNo !== '')

  console.log('Final company table data processed:', tableData.length, 'rows')
  console.log('Sample data:', tableData.slice(0, 2))
  console.log('=== getCompanyTableData DEBUG END ===')

  return tableData
}
// Function to calculate time difference between two dates
const calculateTimeDifference = (assignDate, submitDate) => {
  if (!assignDate) {
    return '0h 0m'
  }

  try {
    // Parse dates - handle various date formats
    const parseDate = (dateStr) => {
      let date = new Date(dateStr)

      // If invalid, try parsing as DD/MM/YYYY HH:MM format
      if (isNaN(date.getTime())) {
        const parts = dateStr.toString().trim().match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/)
        if (parts) {
          const [, day, month, year, hour, minute] = parts
          date = new Date(year, month - 1, day, hour, minute)
        }
      }

      return date
    }

    const assignDateTime = parseDate(assignDate)

    // If no submit date provided, use current date and time
    let endDateTime
    if (!submitDate || submitDate.toString().trim() === '') {
      endDateTime = new Date()
    } else {
      endDateTime = parseDate(submitDate)
    }

    if (isNaN(assignDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return '0h 0m'
    }

    // Calculate difference in milliseconds
    const timeDifferenceMs = endDateTime.getTime() - assignDateTime.getTime()

    if (timeDifferenceMs < 0) {
      return '0h 0m'
    }

    // Convert to hours and minutes
    const totalMinutes = Math.floor(timeDifferenceMs / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    return `${hours}h ${minutes}m`
  } catch (error) {
    return '0h 0m'
  }
}
const formatDateToDDMMYY = (dateInput) => {
  if (!dateInput || dateInput.toString().trim() === '') {
    return 'No assign date'
  }

  try {
    let date
    const dateStr = dateInput.toString().trim()
    
    // Handle different date formats that might come from Excel
    if (dateStr.includes('/')) {
      // Already in date format like dd/mm/yyyy or mm/dd/yyyy
      date = new Date(dateStr)
    } else if (dateStr.includes('-')) {
      // Format like yyyy-mm-dd
      date = new Date(dateStr)
    } else if (!isNaN(dateStr) && dateStr.length > 4) {
      // Excel serial number format
      const excelEpoch = new Date(1899, 11, 30) // Excel's epoch
      const days = parseInt(dateStr)
      date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000)
    } else {
      // Try to parse as is
      date = new Date(dateStr)
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateStr // Return original if can't parse
    }

    // Format to dd/mm/yy
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2) // Get last 2 digits

    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateInput.toString().trim()
  }
}


// Function to process sheet data for team overview (only for admin)
const processTeamData = (sheetData, userRole = 'admin') => {
  // Only process team data for admin
  if (userRole !== 'admin') {
    return []
  }

  if (!sheetData || !Array.isArray(sheetData)) {
    return []
  }

  // Default column positions
  const columnMapping = {
    teamMemberName: 17, // Column R (Team/Member Name)
    assignDate: 21, // Column V (Assign date and time)
    teamName: 31, // Column AF (Team Name)
    columnAB: 27, // Column AB
    columnAC: 28, // Column AC (Submit date and time)
  }

  // Get data rows (starting from row 6 to skip headers)
  const dataStartRow = 6
  const dataRows = sheetData.slice(dataStartRow)

  // Group data by team member
  const teamMap = new Map()

  dataRows.forEach((row, index) => {
    if (!row || row.length <= columnMapping.teamMemberName) return

    const teamMemberName = row[columnMapping.teamMemberName]
    const assignDate = row[columnMapping.assignDate]
    const submitDate = row[columnMapping.columnAC]
    const teamName = row[columnMapping.teamName]
    const columnAB = row[columnMapping.columnAB]
    const columnAC = row[columnMapping.columnAC]

    if (!teamMemberName || teamMemberName.toString().trim() === '') return

    const memberName = teamMemberName.toString().trim()
    const memberTeamName = teamName ? teamName.toString().trim() : 'No Team'

    if (!teamMap.has(memberName)) {
      teamMap.set(memberName, {
        id: teamMap.size + 1,
        name: memberName,
        teamName: memberTeamName,
        avatar: memberName.charAt(0).toUpperCase(),
        assignDate: assignDate ? assignDate.toString().trim() : '',
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        status: 'available',
        latestAssignDate: assignDate ? assignDate.toString().trim() : '',
        totalTimeSpent: 0,
        completedTasksWithTime: []
      })
    }

    const member = teamMap.get(memberName)
    member.totalTasks++

    // Update team name if available
    if (teamName && teamName.toString().trim() !== '') {
      member.teamName = teamName.toString().trim()
    }

    // Check if task is completed (both AB and AC have data)
    const abHasData = columnAB && columnAB.toString().trim() !== ''
    const acHasData = columnAC && columnAC.toString().trim() !== ''

    if (abHasData && acHasData) {
      member.completedTasks++

      if (assignDate) {
        const timeSpent = calculateTimeDifference(assignDate, submitDate)
        member.completedTasksWithTime.push({
          assignDate: assignDate.toString().trim(),
          submitDate: submitDate.toString().trim(),
          timeSpent: timeSpent,
          status: 'completed'
        })

        try {
          const timeMatch = timeSpent.match(/(\d+)h (\d+)m/)
          if (timeMatch) {
            const hours = parseInt(timeMatch[1])
            const minutes = parseInt(timeMatch[2])
            member.totalTimeSpent += (hours * 60) + minutes
          }
        } catch (error) {
          console.error('Error parsing time for total calculation:', error)
        }
      }
    } else if (abHasData && !acHasData) {
      member.pendingTasks++
      member.status = 'busy'

      if (assignDate) {
        const timeSpent = calculateTimeDifference(assignDate, null)
        member.completedTasksWithTime.push({
          assignDate: assignDate.toString().trim(),
          submitDate: 'In Progress',
          timeSpent: timeSpent,
          status: 'pending'
        })

        try {
          const timeMatch = timeSpent.match(/(\d+)h (\d+)m/)
          if (timeMatch) {
            const hours = parseInt(timeMatch[1])
            const minutes = parseInt(timeMatch[2])
            member.totalTimeSpent += (hours * 60) + minutes
          }
        } catch (error) {
          console.error('Error parsing time for total calculation:', error)
        }
      }
    }

    // Update assign date to latest one (most recent)
    if (assignDate && assignDate.toString().trim() !== '') {
      const currentAssignDate = assignDate.toString().trim()
      if (!member.latestAssignDate || currentAssignDate > member.latestAssignDate) {
        member.latestAssignDate = currentAssignDate
        member.assignDate = currentAssignDate
      }
    }
  })

  // Convert map to array and calculate completion rates
  const teamMembers = Array.from(teamMap.values()).map(member => {
    const completionRate = member.totalTasks > 0
      ? Math.round((member.completedTasks / member.totalTasks) * 100)
      : 0

    // Convert total time spent back to hours and minutes
    const totalHours = Math.floor(member.totalTimeSpent / 60)
    const totalMinutes = member.totalTimeSpent % 60
    const formattedTotalTime = `${totalHours}h ${totalMinutes}m`

    return {
      ...member,
      tasksAssigned: member.pendingTasks,
      tasksCompleted: member.completedTasks,
      assignDate: member.assignDate || 'No assign date',
      timeSpent: formattedTotalTime,
      totalTasksGiven: member.totalTasks,
      completionRate: completionRate
    }
  })

  return teamMembers
}

// Function to process project data with stages (only for admin)
const processProjectData = (sheetData, userRole = 'admin') => {
  // Only process project data for admin
  if (userRole !== 'admin') {
    return []
  }

  if (!sheetData || !Array.isArray(sheetData)) {
    return []
  }

  // Column mappings
  const projectColumnMapping = {
    postedBy: 3, // Column D (Posted By)
    typeOfWork: 4, // Column E (Type Of Work)
    takenFrom: 5, // Column F (Taken From)
    partyName: 6, // Column G (Party Name)
    systemName: 7, // Column H (System Name)
    descriptionOfWork: 8, // Column I (Description Of Work)
    columnO: 14, // Column O
    columnP: 15, // Column P
    columnU: 20, // Column U
    columnV: 21, // Column V
    columnAB: 27, // Column AB
    columnAC: 28, // Column AC
  }

  // Get data rows (starting from row 6 to skip headers)
  const dataStartRow = 6
  const dataRows = sheetData.slice(dataStartRow)

  // Function to determine current stage
  const determineStage = (row) => {
    const columnO = row[projectColumnMapping.columnO]
    const columnP = row[projectColumnMapping.columnP]
    const columnU = row[projectColumnMapping.columnU]
    const columnV = row[projectColumnMapping.columnV]
    const columnAB = row[projectColumnMapping.columnAB]
    const columnAC = row[projectColumnMapping.columnAC]

    // Helper function to check if column has data
    const hasData = (col) => col && col.toString().trim() !== ''
    const isEmpty = (col) => !col || col.toString().trim() === ''

    // Stage 1: Column O has data, Column P is empty
    if (hasData(columnO) && isEmpty(columnP)) {
      return 'Stage 1'
    }

    // Stage 2: Column O and P both have data, Column U has data, Column V is empty
    if (hasData(columnO) && hasData(columnP) && hasData(columnU) && isEmpty(columnV)) {
      return 'Stage 2'
    }

    // Stage 3: Column U and V both have data, Column AB has data, Column AC is empty
    if (hasData(columnU) && hasData(columnV) && hasData(columnAB) && isEmpty(columnAC)) {
      return 'Stage 3'
    }

    // Completed: Column AB and AC both have data
    if (hasData(columnAB) && hasData(columnAC)) {
      return 'Completed'
    }

    return 'Not Started'
  }

  const projectData = []

  dataRows.forEach((row, index) => {
    if (!row || row.length <= projectColumnMapping.descriptionOfWork) return

    // Get all required data
    const postedBy = row[projectColumnMapping.postedBy]
    const typeOfWork = row[projectColumnMapping.typeOfWork]
    const takenFrom = row[projectColumnMapping.takenFrom]
    const partyName = row[projectColumnMapping.partyName]
    const systemName = row[projectColumnMapping.systemName]
    const descriptionOfWork = row[projectColumnMapping.descriptionOfWork]

    // Skip rows without essential data
    if (!descriptionOfWork || descriptionOfWork.toString().trim() === '') return

    // Determine current stage
    const currentStage = determineStage(row)

    const projectItem = {
      id: index + 1,
      postedBy: postedBy ? postedBy.toString().trim() : 'N/A',
      typeOfWork: typeOfWork ? typeOfWork.toString().trim() : 'N/A',
      takenFrom: takenFrom ? takenFrom.toString().trim() : 'N/A',
      partyName: partyName ? partyName.toString().trim() : 'N/A',
      systemName: systemName ? systemName.toString().trim() : 'N/A',
      descriptionOfWork: descriptionOfWork.toString().trim(),
      stage1: currentStage === 'Stage 1' ? 'Active' : currentStage === 'Stage 2' || currentStage === 'Stage 3' || currentStage === 'Completed' ? 'Completed' : 'Pending',
      stage2: currentStage === 'Stage 2' ? 'Active' : currentStage === 'Stage 3' || currentStage === 'Completed' ? 'Completed' : 'Pending',
      stage3: currentStage === 'Stage 3' ? 'Active' : currentStage === 'Completed' ? 'Completed' : 'Pending',
      currentStage: currentStage,
      priority: 'Normal', // Default priority for filtering
      columnO: row[projectColumnMapping.columnO] || '',
      columnP: row[projectColumnMapping.columnP] || '',
      columnU: row[projectColumnMapping.columnU] || '',
      columnV: row[projectColumnMapping.columnV] || '',
      columnAB: row[projectColumnMapping.columnAB] || '',
      columnAC: row[projectColumnMapping.columnAC] || ''
    }

    projectData.push(projectItem)
  })

  return projectData
}

// Company Filters Component (to be placed at top of dashboard) with count functionality
// Company Filters Component (to be placed at top of dashboard) with count functionality
function CompanyFilters({ companyData, sheetData, masterSheetData, filters, onFilterChange, onClearFilters }) {
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    if (sheetData && companyData && masterSheetData) {
      const data = getCompanyTableData(sheetData, companyData, masterSheetData)
      setTableData(data)
    }
  }, [sheetData, companyData, masterSheetData])

  // Get unique values with counts for dropdowns
  const getTypeOfWorkWithCounts = () => {
    const typeOfWorkCounts = {}
    tableData.forEach(item => {
      if (item.typeOfWork !== 'N/A') {
        typeOfWorkCounts[item.typeOfWork] = (typeOfWorkCounts[item.typeOfWork] || 0) + 1
      }
    })
    return Object.entries(typeOfWorkCounts).map(([type, count]) => ({
      value: type,
      label: `${type}`,
      count: count
    }))
  }

  const getStatusWithCounts = () => {
    const statusCounts = {}
    tableData.forEach(item => {
      if (item.status === 'In Progress' || item.status === 'Completed') {
        statusCounts[item.status] = (statusCounts[item.status] || 0) + 1
      }
    })
    return Object.entries(statusCounts).map(([status, count]) => ({
      value: status,
      label: `${status}`,
      count: count
    }))
  }

  const getPriorityWithCounts = () => {
    const priorityCounts = {}
    tableData.forEach(item => {
      if (item.priority !== 'N/A') {
        priorityCounts[item.priority] = (priorityCounts[item.priority] || 0) + 1
      }
    })
    return Object.entries(priorityCounts).map(([priority, count]) => ({
      value: priority,
      label: `${priority}`,
      count: count
    }))
  }

  const typeOfWorkOptions = getTypeOfWorkWithCounts()
  const statusOptions = getStatusWithCounts()
  const priorityOptions = getPriorityWithCounts()

  return (
    <div className="bg-white  shadow-sm border border-gray-200 p-4 mb-6">
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
  )
}

// Admin Filters Component for admin tables
function AdminFilters({ projectData, filters, onFilterChange, onClearFilters }) {
  // Get unique values for dropdowns from project data
  const uniquePriorities = [...new Set(projectData.map(item => item.priority || 'Normal'))].filter(item => item !== 'N/A')
  const uniqueSystemNames = [...new Set(projectData.map(item => item.systemName))].filter(item => item !== 'N/A')

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <h3 className="text-sm font-medium text-gray-700">Filters:</h3>

        {/* System Name Filter */}
        <div className="relative">
          <select
            value={filters.systemName}
            onChange={(e) => onFilterChange('systemName', e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All System Names</option>
            {uniqueSystemNames.map((systemName, index) => (
              <option key={index} value={systemName}>{systemName}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Clear Filters Button */}
        {(filters.priority || filters.systemName) && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}

// Company Table Component (simplified, filters moved to top)
function CompanyTableSection({ companyData, sheetData, masterSheetData, filters }) {
  const [tableData, setTableData] = useState([])
  const [filteredData, setFilteredData] = useState([])

  // Date formatting function
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString === '') {
      return 'N/A'
    }

    try {
      const date = new Date(dateString)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString // Return original if invalid
      }

      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = String(date.getFullYear()).slice(-2) // Get last 2 digits of year

      return `${day}/${month}/${year}`
    } catch (error) {
      return dateString // Return original if error occurs
    }
  }

  useEffect(() => {
    if (sheetData && companyData && masterSheetData) {
      const data = getCompanyTableData(sheetData, companyData, masterSheetData)
      setTableData(data)
      setFilteredData(data)
    }
  }, [sheetData, companyData, masterSheetData])

  // Apply filters
  useEffect(() => {
    let filtered = tableData

    if (filters.typeOfWork) {
      filtered = filtered.filter(item =>
        item.typeOfWork.toLowerCase().includes(filters.typeOfWork.toLowerCase())
      )
    }

    if (filters.status) {
      filtered = filtered.filter(item =>
        item.status === filters.status
      )
    }

    if (filters.priority) {
      filtered = filtered.filter(item =>
        item.priority.toLowerCase().includes(filters.priority.toLowerCase())
      )
    }

    setFilteredData(filtered)
  }, [filters, tableData])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Tasks Overview</h2>
            <p className="text-sm md:text-base text-gray-600">Track your company's tasks and progress</p>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block max-h-96 overflow-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-blue-500 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                Party Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                Type of Work
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                System Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                Description of Work
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                Notes
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                Taken From
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                Expected Date to Close
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                Priority
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                Link of System
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-blue-500">
                Attachment File
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <motion.tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                  whileHover={{ backgroundColor: "#f9fafb" }}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.partyName}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.typeOfWork}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.systemName}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={item.descriptionOfWork}>
                      {item.descriptionOfWork}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={item.notes}>
                      {item.notes}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.takenFrom}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(item.expectedDateToClose)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : item.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : item.priority === 'Low'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.linkOfSystem !== 'N/A' && item.linkOfSystem ? (
                      <a
                        href={item.linkOfSystem.startsWith('http') ? item.linkOfSystem : `https://${item.linkOfSystem}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        Open Link
                      </a>
                    ) : (
                      <div className="text-sm text-gray-400">No Link</div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.attachmentFile !== 'N/A' && item.attachmentFile ? (
                      <a
                        href={item.attachmentFile.startsWith('http') ? item.attachmentFile : `https://${item.attachmentFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 text-sm underline"
                      >
                        View File
                      </a>
                    ) : (
                      <div className="text-sm text-gray-400">No File</div>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="px-6 py-4 text-center text-gray-500">
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
          filteredData.map((item) => (
            <motion.div
              key={item.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              {/* Mobile Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {item.status}
                  </span>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.priority === 'High'
                        ? 'bg-red-100 text-red-800'
                        : item.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : item.priority === 'Low'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {item.priority}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {formatDate(item.expectedDateToClose)}
                </div>
              </div>

              {/* Mobile Card Content */}
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium text-gray-600">Party:</span>
                  <div className="text-sm text-gray-900 font-medium">{item.partyName}</div>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-600">Work Type:</span>
                  <div className="text-sm text-gray-900">{item.typeOfWork}</div>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-600">System:</span>
                  <div className="text-sm text-gray-900">{item.systemName}</div>
                </div>

                {item.descriptionOfWork && (
                  <div>
                    <span className="text-xs font-medium text-gray-600">Description:</span>
                    <div className="text-sm text-gray-900">{item.descriptionOfWork}</div>
                  </div>
                )}

                {item.notes && (
                  <div>
                    <span className="text-xs font-medium text-gray-600">Notes:</span>
                    <div className="text-sm text-gray-900">{item.notes}</div>
                  </div>
                )}

                <div>
                  <span className="text-xs font-medium text-gray-600">Taken From:</span>
                  <div className="text-sm text-gray-900">{item.takenFrom}</div>
                </div>
              </div>

              {/* Mobile Card Links */}
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                {item.linkOfSystem !== 'N/A' && item.linkOfSystem ? (
                  <a
                    href={item.linkOfSystem.startsWith('http') ? item.linkOfSystem : `https://${item.linkOfSystem}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
                  >
                    System Link
                  </a>
                ) : null}

                {item.attachmentFile !== 'N/A' && item.attachmentFile ? (
                  <a
                    href={item.attachmentFile.startsWith('http') ? item.attachmentFile : `https://${item.attachmentFile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-full hover:bg-green-200"
                  >
                    View File
                  </a>
                ) : null}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">No tasks found matching the selected filters</div>
          </div>
        )}
      </div>
    </div>
  )
}