"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, CheckCircle, AlertTriangle, Eye, Edit, Trash2, Search, X, User, RefreshCw, ArrowRight, FileText } from "lucide-react"
import supabase from "../../supabaseClient"

const Button = ({ children, onClick, disabled, className, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
)

// Function to fetch Master Sheet Link data for company matching
const fetchMasterSheetLinkData = async () => {
  try {
    // 👇 Replace "master_sheet_link" with your actual Supabase table name
    const { data, error } = await supabase
      .from("master") // table in Supabase
      .select("*")

    if (error) throw error

    if (data && data.length > 0) {
      console.log("Fetched Master Sheet Link data:", data.length, "rows")
      return data
    } else {
      console.warn("No Master Sheet Link data found")
      return null
    }
  } catch (error) {
    console.error("Error fetching Master Sheet Link data from Supabase:", error)
    return null
  }
}


// Function to get party names that match the logged-in company
const getCompanyPartyNames = (companyName, masterSheetData) => {
  if (!companyName || !masterSheetData || !Array.isArray(masterSheetData)) {

    console.log('  - Is Array:', Array.isArray(masterSheetData))
    return []
  }



  const matchingParties = []

  // Skip header row (start from index 1)
  for (let i = 1; i < masterSheetData.length; i++) {
    const row = masterSheetData[i]
    if (!row || !Array.isArray(row)) continue

    const companyNameInSheet = row[2] ? row[2].toString().trim() : '' // Column C (index 2)



    if (companyNameInSheet.toLowerCase() === companyName.toLowerCase()) {


      // Check multiple columns for potential party names
      const possiblePartyColumns = [2, 6, 7, 8] // Column C, G, H, I

      for (const colIndex of possiblePartyColumns) {
        if (row[colIndex]) {
          const partyName = row[colIndex].toString().trim()
          if (partyName && !matchingParties.includes(partyName)) {
            matchingParties.push(partyName)
          }
        }
      }

      // If no specific party mapping found, use company name as party name
      if (matchingParties.length === 0) {
        matchingParties.push(companyNameInSheet)

      }
    }
  }


  return matchingParties
}




export default function TaskList({ type = "all", userFilterData = null, companyData = null }) {
   const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterPriority, setFilterPriority] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterParty, setFilterParty] = useState("all")
  const [selectedTasks, setSelectedTasks] = useState(new Set())
  const [showAssignPopup, setShowAssignPopup] = useState(false)
  const [selectedTaskForAssign, setSelectedTaskForAssign] = useState(null)
  const [allTasks, setAllTasks] = useState([])
  const [pendingData, setPendingData] = useState([])
  const [historyData, setHistoryData] = useState([])
  const [uniqueParties, setUniqueParties] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState("")
  const [userRole, setUserRole] = useState("")
  const [masterSheetData, setMasterSheetData] = useState(null)
  const [masterSheetLoading, setMasterSheetLoading] = useState(false)
  const [forwardingInProgress, setForwardingInProgress] = useState(false)

  // Google Sheets API configuration
  const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzG8CyTBV-lk2wQ0PKjhrGUnBKdRBY-tkFVz-6GzGcbXqdEGYF0pWyfCl0BvGfVhi0/exec"
  const SHEET_NAME = "FMS"

  // Table Columns Configuration - Hide first 7 columns for company users
 // Table Columns Configuration - UPDATED TO MATCH YOUR SCREENSHOT
const TABLE_COLUMNS = [
  { key: 'taskNo', label: 'Task No' },
  { key: 'givenDate', label: 'Given Date' },
  { key: 'postedBy', label: 'Posted By' },
  { key: 'typeOfWork', label: 'Type Of Work' },
  { key: 'takenFrom', label: 'Taken From' },
  { key: 'partyName', label: 'Party Name' },
  { key: 'systemName', label: 'System Name' },
  { key: 'descriptionOfWork', label: 'Description Of Work' },
  { key: 'linkOfSystem', label: 'Link Of System' },
  { key: 'attachmentFile', label: 'Attachment File' },
  { key: 'priorityInCustomer', label: 'Priority In Customer' },
  { key: 'notes', label: 'Notes' },
  { key: 'expectedDateToClose', label: 'Expected Date To Close' }
];
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

  // Determine if user is company or admin/regular user
  const isCompanyUser = companyData && companyData.companyName
  const isAdminUser = userFilterData?.isAdmin

  // Filter columns based on user type
// Replace the getVisibleColumns function with this corrected version
const getVisibleColumns = () => {
  if (isCompanyUser) {
    // For company users: Type Of Work, Party Name, System Name, Description of Work, Link of System, then from index 10 onwards
    const typeOfWorkColumn = { key: 'typeOfWork', label: 'Type Of Work' }
    const partyNameColumn = { key: 'partyName', label: 'Party Name' }
    const systemNameColumn = { key: 'systemName', label: 'System Name' }
    const descriptionColumn = { key: 'descriptionOfWork', label: 'Description Of Work' }
    const linkColumn = { key: 'linkOfSystem', label: 'Link Of System' }
    
    // Remaining columns (priority, notes, expected date)
    const remainingColumns = [
      { key: 'priorityInCustomer', label: 'Priority In Customer' },
      { key: 'notes', label: 'Notes' },
      { key: 'expectedDateToClose', label: 'Expected Date To Close' }
    ]

    return [typeOfWorkColumn, partyNameColumn, systemNameColumn, descriptionColumn, linkColumn, ...remainingColumns]
  }

  // For admin/regular users, show all columns except actualDate for pending tasks
  let columns = TABLE_COLUMNS
  if (type === "pending") {
    columns = TABLE_COLUMNS.filter(col => col.key !== 'actualDate')
  }

  return columns
}

  const visibleColumns = getVisibleColumns()

  // Date formatting function
  const formatDateToDDMMYY = (dateString) => {
    if (!dateString) return ''

    try {
      // Handle various date formats
      let date

      // If it's already in dd/mm/yyyy or dd/mm/yy format, parse it
      if (dateString.includes('/')) {
        const parts = dateString.split('/')
        if (parts.length === 3) {
          const day = parseInt(parts[0])
          const month = parseInt(parts[1]) - 1 // JavaScript months are 0-indexed
          let year = parseInt(parts[2])

          // Handle 2-digit years
          if (year < 100) {
            year += year < 50 ? 2000 : 1900
          }

          date = new Date(year, month, day)
        }
      } else {
        // Try parsing as ISO date or other formats
        date = new Date(dateString)
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString // Return original if can't parse
      }

      // Format to dd/mm/yy
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear().toString().slice(-2)

      return `${day}/${month}/${year}`
    } catch (error) {
      return dateString // Return original if error
    }
  }

  // Get current user from session storage
  const getCurrentUser = () => {
  if (userFilterData && userFilterData.username) {
    return userFilterData.username;
  }
  
  try {
    const session = sessionStorage.getItem('userSession');
    if (session) {
      const userData = JSON.parse(session);
      return userData.username || currentUser;
    }
  } catch (e) {
    console.error('Error parsing session:', e);
  }
  return currentUser || "Unknown";
};

const getUserRole = () => {
  if (userFilterData) {
    return userFilterData.isAdmin ? 'admin' : 'user';
  }
  
  try {
    const session = sessionStorage.getItem('userSession');
    if (session) {
      const userData = JSON.parse(session);
      return userData.role || "user";
    }
  } catch (e) {
    console.error('Error parsing session:', e);
  }
  return "user";
};
  // Set current user and role on component mount
  useEffect(() => {
    const user = getCurrentUser()
    const role = getUserRole()
    setCurrentUser(user)
    setUserRole(role)
  }, [])

  // Check if user can access task - SIMPLIFIED VERSION for both members
const canUserAccessTask = (task) => {
  // For company users and admins, show all tasks
  if (isCompanyUser || (userFilterData && userFilterData.isAdmin)) {
    return true;
  }

  // For users with showAllData permission
  if (userFilterData && userFilterData.showAllData) {
    return true;
  }

  // For regular users, check if they're assigned to the task
  if (userFilterData && userFilterData.username) {
    const currentUsername = userFilterData.username.toLowerCase();
    const assignedMember1 = task.assignedMember1 ? task.assignedMember1.toString().toLowerCase() : '';
    const assignedMember2 = task.assignedMember2 ? task.assignedMember2.toString().toLowerCase() : '';

    // Show task if user is either Member1 or Member2
    return assignedMember1 === currentUsername || assignedMember2 === currentUsername;
  }

  return false;
};

const canUserSubmitTask = (task) => {
  // Company users cannot submit tasks (read-only access)
  if (isCompanyUser) {
    console.log(`Company user cannot submit`);
    return false;
  }

  // Check if userFilterData exists
  if (!userFilterData || !userFilterData.username) {
    console.log(`No user data available for submission check`);
    return false;
  }

  const currentUsername = userFilterData.username.toLowerCase();
  const statusAE = task.status1 ? task.status1.toString().toLowerCase() : '';
  const assignedMember1 = task.assignedMember1 ? task.assignedMember1.toString().toLowerCase() : '';
  const assignedMember2 = task.assignedMember2 ? task.assignedMember2.toString().toLowerCase() : '';

  console.log(`Submit check - User: ${currentUsername}, Status: '${statusAE}', Member1: ${assignedMember1}, Member2: ${assignedMember2}`);

  // CRITICAL: Check if task is already completed first
  if (statusAE.includes('completed by')) {
    console.log(`Task already completed - Status: ${statusAE}`);
    return false;
  }

  // Check if both submission dates exist (backup completion check)
  if (task.submissionDate1 && task.submissionDate2) {
    console.log(`Task already completed (both dates present)`);
    return false;
  }

  // If task is forwarded to member2 (forward2), only member2 can submit
  if (statusAE.includes('forward2')) {
    const canSubmit = assignedMember2 === currentUsername;
    console.log(`Forward2 - Can submit: ${canSubmit} (only Member2 can submit when forwarded)`);
    return canSubmit;
  }
  // If task is forwarded back to member1 (forward1), only member1 can submit  
  else if (statusAE.includes('forward1')) {
    const canSubmit = assignedMember1 === currentUsername;
    console.log(`Forward1 - Can submit: ${canSubmit} (only Member1 can submit when forwarded back)`);
    return canSubmit;
  }
  // For normal tasks (no forward status), only member1 can submit
  else {
    const canSubmit = assignedMember1 === currentUsername;
    console.log(`Normal - Can submit: ${canSubmit} (only Member1 can submit normal tasks)`);
    return canSubmit;
  }
};

  // FIXED: Load Master Sheet data first for company users
  const loadMasterSheetData = async () => {
    if (!isCompanyUser || masterSheetData) return masterSheetData

    console.log('Loading Master Sheet Link for company:', companyData.companyName)
    setMasterSheetLoading(true)

    try {
      const masterData = await fetchMasterSheetLinkData()
      if (masterData) {
        setMasterSheetData(masterData)
        console.log('Master Sheet Link data loaded:', masterData.length, 'rows')
        return masterData
      }
    } catch (error) {
      console.error('Error loading Master Sheet data:', error)
    } finally {
      setMasterSheetLoading(false)
    }

    return null
  }

// Add these state variables at the top of your component with the other useState declarations
const [teamMembers1, setTeamMembers1] = useState([]);
const [teamMembers2, setTeamMembers2] = useState([]);

// Replace the transformSupabaseData function with this corrected version
const transformSupabaseData = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) {
    return { tasks: [], teamMembers1: [], teamMembers2: [] };
  }

  if (rawData.length === 0) {
    console.log("No task data found");
    return { tasks: [], teamMembers1: [], teamMembers2: [] };
  }

  // Extract unique team members
  const membersX = new Set();
  const membersY = new Set();

  const tasks = rawData.map((row, index) => {
    if (!row) return null;

    // Get planned and actual dates from your screenshot column names
    const plannedDate = row.planned2 || row.planned1;
    const actualDate = row.actual2 || row.actual1;
    
    // Determine status based on planned/actual dates
    let status = 'pending';
    if (plannedDate && actualDate) {
      status = 'completed';
    } else if (plannedDate && !actualDate) {
      status = 'assigned'; // Planned but not completed
    }

    const task = {
      id: index + 1,
      rowNumber: index + 2,

      // Match column names from your screenshot
      taskNo: row.task_no || '',
      givenDate: formatDateTime(row.given_date),
      postedBy: row.posted_by || '',
      typeOfWork: row.type_of_work || '',
      takenFrom: row.taken_from || '',
      partyName: row.party_name || '',
      systemName: row.system_name || '',
      descriptionOfWork: row.description_of_work || '',
      linkOfSystem: row.link_of_system || '',
      attachmentFile: row.attachment_file || '',
      priorityInCustomer: row.priority_in_customer || 'Medium',
      notes: row.notes || '',
      expectedDateToClose: formatDateTime(row.expected_date_to_close),

      // Assignment tracking - using column names from screenshot
      planned1: formatDateTime(row.planned1),
      actual1: formatDateTime(row.actual1),
      delay1: row.delay1 || '',
      teamMemberName: row.team_member_name || '',
      howManyTimeTabs: row.how_many_time_take || '',
      remarks: row.remarks || '',
      
      planned2: formatDateTime(row.planned2),
      actual2: formatDateTime(row.actual2),
      delay2: row.delay2 || '',
      assignedMember1: row.employee_name_1 || '',
      assignedMember2: row.employee_name_2 || '',
      timeRequired: row.how_many_time_take_2 || '',
      remarks2: row.remarks_2 || '',
      
      planned3: formatDateTime(row.planned3),
      actual3: formatDateTime(row.actual3),
      delay3: row.delay3 || '',
      
      status: row.status || status,
      systemList: row.system_list || '',

      // Status for UI filtering
      uiStatus: status,
      priority: row.priority_in_customer || 'Medium',
      isReassigned: false,
      originalAssignee: row.employee_name_1 || ''
    };

    // Add team members to sets
    if (task.assignedMember1) membersX.add(task.assignedMember1);
    if (task.assignedMember2) membersY.add(task.assignedMember2);

    return task;
  }).filter(task => task !== null && task.taskNo);

  const teamMembers1 = Array.from(membersX).filter(Boolean);
  const teamMembers2 = Array.from(membersY).filter(Boolean);

  // Sort tasks - show assigned but not completed first
  const sortedTasks = tasks.sort((a, b) => {
    const aIsAssignedPending = a.planned2 && !a.actual2;
    const bIsAssignedPending = b.planned2 && !b.actual2;

    if (aIsAssignedPending && !bIsAssignedPending) return -1;
    if (!aIsAssignedPending && bIsAssignedPending) return 1;
    return b.id - a.id;
  });

  console.log("Transformed tasks:", sortedTasks);
  console.log("Team members 1:", teamMembers1);
  console.log("Team members 2:", teamMembers2);

  return { tasks: sortedTasks, teamMembers1, teamMembers2 };
};

// Replace the fetchTasks function with this corrected version
// Replace the fetchTasks function with this corrected version
const fetchTasks = async (pageNum = 1, search = "", isLoadMore = false) => {
  if (isLoadMore) {
    setIsLoadingMore(true);
  } else {
    setLoading(true);
  }
  
  setError(null);

  try {
    // STEP 1: Load Master Sheet data FIRST if company user
    let currentMasterData = masterSheetData;
    if (isCompanyUser && !currentMasterData) {
      currentMasterData = await loadMasterSheetData();
      if (!currentMasterData) {
        throw new Error("Failed to load company mapping data");
      }
    }

    // STEP 2: Fetch FMS tasks from Supabase with pagination
    let query = supabase
      .from("FMS")
      .select("*", { count: 'exact' }) // This returns the count
      .order('task_no', { ascending: false })
      .range((pageNum - 1) * 50, pageNum * 50 - 1);

    // Add search filter if provided
    if (search) {
      query = query.or(`task_no.ilike.%${search}%,party_name.ilike.%${search}%,system_name.ilike.%${search}%,description_of_work.ilike.%${search}%`);
    }

    const { data: tasksData, error: tasksError, count } = await query;

    if (tasksError) throw tasksError;
    if (!Array.isArray(tasksData)) {
      throw new Error("Invalid tasks data from Supabase");
    }

    console.log("Raw data from Supabase:", tasksData, "Total count:", count);

    // STEP 3: Transform data using the new function
    const { tasks: transformedTasks, teamMembers1: tm1, teamMembers2: tm2 } = transformSupabaseData(tasksData);
    
    if (isLoadMore) {
      // Append to existing tasks
      setAllTasks(prev => [...prev, ...transformedTasks]);
    } else {
      // Replace existing tasks
      setAllTasks(transformedTasks);
    }
    
    setTeamMembers1(tm1);
    setTeamMembers2(tm2);

    // STEP 4: Filter data for pending and completed
    const pending = transformedTasks.filter(item => item.planned3 && !item.actual3);
    const history = transformedTasks.filter(item => item.planned3 && item.actual3);

    if (isLoadMore) {
      setPendingData(prev => [...prev, ...pending]);
      setHistoryData(prev => [...prev, ...history]);
    } else {
      setPendingData(pending);
      setHistoryData(history);
    }

    // FIXED: Use the actual count to determine if there are more pages
    const totalFetchedSoFar = pageNum * 50;
    setHasMore(totalFetchedSoFar < count);
    
    setPage(pageNum);

    // Collect unique parties
    if (!isLoadMore) {
      setUniqueParties([
        ...new Set(transformedTasks.map(item => item.partyName).filter(Boolean)),
      ]);
    }

    console.log(`Final data set - Pending: ${pending.length}, Completed: ${history.length}, Has more: ${totalFetchedSoFar < count}`);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    setError(err.message);
  } finally {
    setLoading(false);
    setIsLoadingMore(false);
    setIsSearching(false);
  }
};


const handleSearch = (query) => {
  setSearchTerm(query);
  setIsSearching(true);
  setPage(1);
  setHasMore(true);
  fetchTasks(1, query);
};

// Add this useEffect for infinite scroll
// Add this useEffect for infinite scroll - UPDATED
useEffect(() => {
  if (!hasMore || loading || isLoadingMore) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchTasks(page + 1, searchTerm, true);
      }
    },
    { threshold: 0.5 } // Reduced threshold to trigger earlier
  );
  
  // Observe the loading indicator or last element
  const sentinel = document.getElementById('scroll-sentinel');
  if (sentinel && hasMore) {
    observer.observe(sentinel);
  }
  
  return () => {
    if (sentinel) {
      observer.unobserve(sentinel);
    }
  };
}, [page, hasMore, loading, isLoadingMore, searchTerm]);

const SearchBar = ({ value, onChange, onSearch, loading }) => (
  <div className="relative mb-4">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && onSearch()}
      placeholder="Search by task no, party, system, or description..."
      className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
      {loading && (
        <RefreshCw className="h-4 w-4 text-gray-400 animate-spin" />
      )}
    </div>
  </div>
);


  // FIXED: useEffect to properly handle dependencies
useEffect(() => {
  if (userFilterData) {
    setCurrentUser(userFilterData.username || '');
    setUserRole(userFilterData.isAdmin ? 'admin' : 'user');
  }
  
  fetchTasks();
  const interval = setInterval(fetchTasks, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, [userFilterData, companyData?.companyName]);
 // Added companyName as dependency



// Filter tasks based on type and search criteria
const getFilteredTasks = () => {
  let tasksToFilter = [];

  if (type === "pending") {
    tasksToFilter = pendingData;
  } else if (type === "completed") {
    tasksToFilter = historyData;
  } else {
    tasksToFilter = [...pendingData, ...historyData];
  }

  console.log(`Total tasks before filtering: ${tasksToFilter.length}`);
  
  // For company users, filter by party_name matching company name
  if (isCompanyUser && companyData?.companyName) {
    const companyNameLower = companyData.companyName.toLowerCase().trim();
    console.log(`Filtering for company: "${companyData.companyName}"`);
    
    tasksToFilter = tasksToFilter.filter(task => {
      const taskPartyName = task.partyName ? task.partyName.toLowerCase().trim() : '';
      return taskPartyName === companyNameLower;
    });
  }

  // For non-company users, apply user-based filtering
  if (!isCompanyUser && userFilterData) {
    const beforeCount = tasksToFilter.length;
    
    // If user is admin or has showAllData permission, show all tasks
    if (userFilterData.isAdmin || userFilterData.showAllData) {
      console.log(`Showing all tasks for admin/user with showAllData permission`);
    } 
    // For regular users, filter tasks assigned to them
    else if (userFilterData.username) {
      const username = userFilterData.username.toLowerCase();
      console.log(`Filtering for user: ${username}`);
      
      tasksToFilter = tasksToFilter.filter(task => {
        const assignedMember1 = task.assignedMember1 ? task.assignedMember1.toString().toLowerCase() : '';
        const assignedMember2 = task.assignedMember2 ? task.assignedMember2.toString().toLowerCase() : '';
        
        return assignedMember1 === username || assignedMember2 === username;
      });
    }
    
    console.log(`User filter: ${beforeCount} -> ${tasksToFilter.length} tasks`);
  }

  const finalTasks = tasksToFilter.filter((task) => {
    const matchesSearch =
      task.systemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.descriptionOfWork?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedMember1?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedMember2?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = !filterPriority || task.priority === filterPriority;
    const matchesStatus = !filterStatus || task.status === filterStatus;
    const matchesParty = filterParty === 'all' || task.partyName === filterParty;

    return matchesSearch && matchesPriority && matchesStatus && matchesParty;
  });

  console.log(`Final filtered tasks: ${finalTasks.length}`);
  return finalTasks;
};



  const filteredTasks = getFilteredTasks()
  console.log("hii",filteredTasks);
  

  const handleTaskSelection = (taskId) => {
    const task = filteredTasks.find(t => t.id === taskId)

    if (!task) {
      console.log(`Task not found: ${taskId}`)
      return
    }

    console.log(`Attempting to select task: ${task.taskNo}`)

    // Check if user can submit this task
    if (!canUserSubmitTask(task)) {
      console.log(`Cannot select task ${task.taskNo} - User cannot submit`)
      alert("You cannot select this task as it is not assigned to you for submission or it is already completed.")
      return
    }

    const newSelected = new Set(selectedTasks)
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId)
      console.log(`Removed task ${task.taskNo} from selection`)
    } else {
      newSelected.add(taskId)
      console.log(`Added task ${task.taskNo} to selection`)
    }
    setSelectedTasks(newSelected)
  }

  const handleSelectAll = () => {
    const selectableTasks = filteredTasks.filter(task => canUserSubmitTask(task))

    if (selectedTasks.size === selectableTasks.length) {
      setSelectedTasks(new Set())
    } else {
      setSelectedTasks(new Set(selectableTasks.map((task) => task.id)))
    }
  }

  // Task completion handler
 const handleSubmitTasks = async () => {
  if (selectedTasks.size === 0) {
    alert("Please select at least one task to submit.");
    return;
  }

  // Double-check all selected tasks before submission
  const invalidTasks = [];
  for (const taskId of selectedTasks) {
    const task = filteredTasks.find(t => t.id === taskId);
    if (!task || !canUserSubmitTask(task)) {
      invalidTasks.push(task?.taskNo || `ID:${taskId}`);
    }
  }

  if (invalidTasks.length > 0) {
    alert(`Cannot submit these tasks: ${invalidTasks.join(', ')}. They are either completed or not assigned to you.`);
    // Remove invalid tasks from selection
    const validTaskIds = [];
    for (const taskId of selectedTasks) {
      const task = filteredTasks.find(t => t.id === taskId);
      if (task && canUserSubmitTask(task)) {
        validTaskIds.push(taskId);
      }
    }
    setSelectedTasks(new Set(validTaskIds));
    return;
  }

  setSubmitting(true);

  try {
    const currentDate = new Date().toISOString();
    const submittingUser = getCurrentUser();

    console.log(`Starting submission for ${selectedTasks.size} tasks by user: ${submittingUser}`);

    const results = [];
    
    for (const taskId of selectedTasks) {
      const task = filteredTasks.find(t => t.id === taskId);
      if (!task) continue;

      console.log(`Processing task: ${task.taskNo}`);

      // Final validation before API call
      if (!canUserSubmitTask(task)) {
        console.log(`Final validation failed for task: ${task.taskNo}`);
        results.push({
          taskNo: task.taskNo,
          success: false,
          error: "You are not authorized to submit this task"
        });
        continue;
      }

      try {
        // Determine which submission field to update based on task status
        // const statusAE = task.status1 ? task.status1.toString().toLowerCase() : '';
        let updateData = {
          status: `Completed `,
          actual3: currentDate
        };

       
        

        // Update task in Supabase
        const { error } = await supabase
          .from('FMS')
          .update(updateData)
          .eq('task_no', task.taskNo);

        if (error) {
          console.log(`Supabase error for task ${task.taskNo}:`, error);
          throw new Error(error.message || "Supabase update failed");
        }

        results.push({
          taskNo: task.taskNo,
          success: true,
          message: "Completed"
        });

        console.log(`Successfully submitted task ${task.taskNo}`);

      } catch (error) {
        console.log(`Error for task ${task.taskNo}:`, error.message);
        results.push({
          taskNo: task.taskNo,
          success: false,
          error: error.message
        });
      }
    }

    const failedTasks = results.filter(r => !r.success);
    if (failedTasks.length > 0) {
      throw new Error(
        `${failedTasks.length} tasks failed:\n` +
        failedTasks.map(t => `${t.taskNo}: ${t.error}`).join('\n')
      );
    }

    // Update local state for immediate UI feedback
    const completedTasks = pendingData.filter(t => selectedTasks.has(t.id));
    const remainingPending = pendingData.filter(t => !selectedTasks.has(t.id));

    const updatedCompletedTasks = completedTasks.map(t => ({
      ...t,
      status1: `completed by ${submittingUser}`,
      status: 'completed',
      submissionDate2: currentDate,
      actual2: "Completed"
    }));

    setPendingData(remainingPending);
    setHistoryData(prev => [...prev, ...updatedCompletedTasks]);

    setAllTasks(prev =>
      prev.map(t =>
        selectedTasks.has(t.id)
          ? {
            ...t,
            status1: `completed by ${submittingUser}`,
            status: 'completed',
            submissionDate2: currentDate
          }
          : t
      )
    );

    alert(`Successfully completed ${results.length} tasks`);
    setSelectedTasks(new Set());

  } catch (error) {
    console.error("Submission error:", error);
    alert(`Error: ${error.message}`);
  } finally {
    setSubmitting(false);
    // Refresh data from Supabase to ensure consistency
    fetchTasks();
  }
};

  // const handleEditClick = (task) => {
  //   if (isCompanyUser) {
  //     alert("Company users have read-only access and cannot edit tasks.")
  //     return
  //   }

  //   setSelectedTaskForAssign(task)
  //   setShowAssignPopup(true)
  // }

  // Get available members for forwarding based on current assignment
  const getAvailableMembersForForwarding = (task) => {
    const statusAE = task.status1 ? task.status1.toString().toLowerCase() : ''

    // If task is currently forwarded to member2, show only member1
    if (statusAE.includes('forward2')) {
      return task.assignedMember1 ? [task.assignedMember1] : []
    } else {
      // For normal tasks assigned to member1, show only member2
      return task.assignedMember2 ? [task.assignedMember2] : []
    }
  }

  const completeTaskDirectly = async (task) => {
    const currentDate = new Date().toISOString().split('T')[0]
    const submittingUser = getCurrentUser()

    const formData = new URLSearchParams()
    formData.append('action', 'Complete_task_assignment')
    formData.append('sheetName', 'FMS')
    formData.append('taskNo', task.taskNo)
    formData.append('rowNumber', task.rowNumber)

    // FOR COMPLETION: Set completion status and dates
    formData.append('status1', `completed by ${submittingUser}`)
    formData.append('submissionDate2', currentDate)
    formData.append('completedBy', submittingUser)

    const response = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    })

    return await response.json()
  }

  // Task forwarding handler - Only forward, never complete
  const handleAssignTask = async (selectedMember) => {
    if (!selectedMember) {
      alert("Please select a member to forward the project.")
      return
    }

    try {
      setForwardingInProgress(true)

      const statusAE = selectedTaskForAssign.status1 ? selectedTaskForAssign.status1.toString().toLowerCase() : ''

      // Determine new status - simple alternating logic
      let newStatus
      if (statusAE.includes('forward2')) {
        newStatus = 'forward1'  // Back to member1
      } else {
        newStatus = 'forward2'  // To member2
      }

      // CRITICAL: Only send status1 for forwarding, NO other parameters
      const formData = new URLSearchParams()
      formData.append('action', 'Complete_task_assignment')
      formData.append('sheetName', 'FMS')
      formData.append('taskNo', selectedTaskForAssign.taskNo)
      formData.append('rowNumber', selectedTaskForAssign.rowNumber)
      formData.append('status1', newStatus)
      // DO NOT send: assignedMember2, submissionDate2, completedBy

      console.log(`Forwarding task ${selectedTaskForAssign.taskNo}: ${statusAE} -> ${newStatus}`)

      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.message || "Failed to forward task")
      }

      console.log(`Task ${selectedTaskForAssign.taskNo} successfully forwarded with status: ${newStatus}`)

      // Update local state - keep in pending with new forward status
      const updateTask = (task) => ({
        ...task,
        status1: newStatus,
        status: 'pending',  // Force pending
        // Clear any completion fields
        submissionDate2: null,
        completedBy: null
      })

      setPendingData(prev =>
        prev.map(task =>
          task.id === selectedTaskForAssign.id ? updateTask(task) : task
        )
      )

      setAllTasks(prev =>
        prev.map(task =>
          task.id === selectedTaskForAssign.id ? updateTask(task) : task
        )
      )

      // Show appropriate message
      const targetMember = newStatus === 'forward1' ? selectedTaskForAssign.assignedMember1 : selectedTaskForAssign.assignedMember2
      alert(`Task has been forwarded to ${targetMember}`)

    } catch (error) {
      console.error('Forwarding error:', error)
      alert(`Error forwarding task: ${error.message}`)
    } finally {
      setForwardingInProgress(false)
      setShowAssignPopup(false)
      setSelectedTaskForAssign(null)
      // Refresh after delay to confirm backend changes
      setTimeout(() => {
        fetchTasks()
      }, 1000)
    }
  }

  // In your refresh button handler
const handleRefresh = () => {
  setSearchTerm("");
  setPage(1);
  setHasMore(true);
  fetchTasks(1);
};

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

  const isTaskSelectable = (task) => {
    return canUserSubmitTask(task)
  }

  // Show loading when Master Sheet is loading for company users
  // Loading state को improve करने के लिए
  if (loading || (isCompanyUser && masterSheetLoading)) {
    return (
      <div className="text-center py-8"> {/* कम padding */}
        <div className="flex flex-col items-center justify-center space-y-3"> {/* कम space */}
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center"> {/* छोटा spinner */}
            <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-medium text-gray-900"> {/* छोटा text */}
              {masterSheetLoading ? 'Loading...' : 'Loading Tasks...'}
            </h3>
            <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-red-800">Error: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={() => handleSearch(searchTerm)}
          loading={isSearching}
        />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
         <button
  onClick={handleRefresh} // Changed from fetchTasks to handleRefresh
  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 whitespace-nowrap"
>
  <RefreshCw className="w-4 h-4" />
  <span className="hidden sm:inline">Refresh</span>
</button>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select
            value={filterParty}
            onChange={(e) => setFilterParty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="all">All Parties</option>
            {uniqueParties.map(party => (
              <option key={party} value={party}>{party}</option>
            ))}
          </select>
          {type === "all" && (
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>
      </div>

      {/* Submit Button for Pending Tasks - Hide for company users */}
      {type === "pending" && !isCompanyUser && !isAdminUser && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTasks.size === filteredTasks.filter(isTaskSelectable).length && filteredTasks.filter(isTaskSelectable).length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  <span className="hidden sm:inline">Select All </span>
                  ({selectedTasks.size} of {filteredTasks.filter(isTaskSelectable).length}<span className="hidden sm:inline"> selected</span>)
                </span>
              </label>
            </div>
            <Button
              onClick={handleSubmitTasks}
              disabled={selectedTasks.size === 0 || submitting}
              className={`w-full sm:w-auto ${selectedTasks.size === 0 || submitting
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                } text-white`}
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">Submitting...</span>
                  <span className="sm:hidden">Wait...</span>
                </span>
              ) : (
                <>
                  <span className="hidden sm:inline">Submit Selected Tasks ({selectedTasks.size})</span>
                  <span className="sm:hidden">Submit ({selectedTasks.size})</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Tasks Table with Fixed Header and Scrollable Body */}
       <div className="bg-white rounded-lg border border-gray-200">
      <div className="max-h-[70vh] overflow-auto">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  {/* Select column - Only for non-admin, non-company users */}
                  {!isCompanyUser && !isAdminUser && type === "pending" &&  (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Select</th>
                  )}

                  {/* Admin assignment columns */}
                  {!isCompanyUser && isAdminUser && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Assigned By</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Assigned Member1</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Assigned Member2</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Time Required</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Remarks</th>
                    </>
                  )}

                  {/* Non-admin, non-company assignment columns */}
                  {!isCompanyUser && !isAdminUser && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Assigned By</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Assigned Member1</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Assigned Member2</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Time Required</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Remarks</th>
                    </>
                  )}

                  {/* Common columns for all users */}
                  {visibleColumns.map(column => (
                    <th key={column.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">
                      {column.label}
                    </th>
                  ))}

                  {/* Status column - For all non-company users but placed at the end */}
                  {!isCompanyUser && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Status</th>
                  )}

                  {/* Actions column - Only for non-admin, non-company users */}
                  {/* {!isCompanyUser && !isAdminUser && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-gray-50">Actions</th>
                  )} */}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    {/* Select cell - Only for non-admin, non-company users */}
                    {!isCompanyUser && !isAdminUser && type === "pending" &&  (
                      <td className="px-4 py-3">
                        {type === "pending" && (
                          <input
                            type="checkbox"
                            checked={selectedTasks.has(task.id)}
                            onChange={() => handleTaskSelection(task.id)}
                            disabled={!isTaskSelectable(task)}
                            className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${!isTaskSelectable(task) ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                          />
                        )}
                      </td>
                    )}

                    {/* Admin assignment cells */}
                    {!isCompanyUser && isAdminUser && (
                      <>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900 font-medium">
                            {task.teamMemberName || '-'}
                          </span>
                        </td>
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

                    {/* Non-admin, non-company assignment cells */}
                    {!isCompanyUser && !isAdminUser && (
                      <>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900 font-medium">
                            {task.teamMemberName || '-'}
                          </span>
                        </td>
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

                    {/* Common cells for all users */}
                    {visibleColumns.map(column => (
                      <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                        {column.key === 'linkOfSystem' && task[column.key] ? (
                          <a
                            href={task[column.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline inline-flex items-center space-x-1"
                          >
                            <span>Link</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ) : column.key === 'attachmentFile' && task[column.key] ? (
                          <a
                            href={task[column.key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Attachment</span>
                          </a>
                        ) : column.key === 'expectedDateToClose' || column.key === 'givenDate' ? (
                          formatDateToDDMMYY(task[column.key])
                        ) : column.key === 'expectedDateToClose' || column.key === 'givenDate' || column.key === 'actualDate' ? (
                          formatDateToDDMMYY(task[column.key])
                        ) : column.key === 'descriptionOfWork' || column.key === 'notes' ? (
                          <span className="max-w-xs truncate block">{task[column.key]}</span>
                        ) : (
                          task[column.key]
                        )}
                      </td>
                    ))}
                    {/* Status cell - For all non-company users but placed at the end */}
                    {!isCompanyUser && (
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.status1?.includes('completed by') ? 'bg-green-100 text-green-800' :
                          task.status1?.includes('forward2') ? 'bg-purple-100 text-purple-800' :
                            task.status1?.includes('forward1') ? 'bg-blue-100 text-blue-800' :
                              task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {task.status1 || task.status || 'Not Started'}
                        </span>
                      </td>
                    )}

                    {/* Actions cell - Only for non-admin, non-company users */}
                    {/* {!isCompanyUser && !isAdminUser && (
                      <td className="px-2 sm:px-4 py-3">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <button className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleEditClick(task)}
                            className="p-1 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    )} */}
                  </tr>
                ))}
              </tbody>
            </table>
           {hasMore && !loading && (
  <div id="scroll-sentinel" className="py-4 flex justify-center">
    <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
  </div>
)}
{!hasMore && allTasks.length > 0 && (
  <div className="py-4 text-center text-gray-500 text-sm">
    No more tasks to load
  </div>
)}
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="space-y-4 p-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {/* Select checkbox for non-admin, non-company users */}
                  {!isCompanyUser && !isAdminUser && type === "pending" && (
                    <div className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={selectedTasks.has(task.id)}
                        onChange={() => handleTaskSelection(task.id)}
                        disabled={!isTaskSelectable(task)}
                        className={`w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3 ${!isTaskSelectable(task) ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                      />
                      <span className="text-sm font-medium text-gray-900">Select Task</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  {!isCompanyUser && (
                    <div className="mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.status1?.includes('completed by') ? 'bg-green-100 text-green-800' :
                        task.status1?.includes('forward2') ? 'bg-purple-100 text-purple-800' :
                          task.status1?.includes('forward1') ? 'bg-blue-100 text-blue-800' :
                            task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {task.status1 || task.status || 'Not Started'}
                      </span>
                    </div>
                  )}

                  {/* Assignment Info for non-company users */}
                  {!isCompanyUser && (
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          {isAdminUser ? "Assigned By" : "Assigned By"}
                        </div>
                        <div className="text-gray-900 font-medium">{task.teamMembers || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">Time Required</div>
                        <div className="text-gray-900">{task.timeRequired || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          {isAdminUser ? "Assigned Member1" : "Assigned Member1"}
                        </div>
                        <div className="text-gray-900 font-medium">{task.assignedMember1 || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">
                          {isAdminUser ? "Assigned Member2" : "Assigned Member2"}
                        </div>
                        <div className="text-gray-900 font-medium">{task.assignedMember2 || '-'}</div>
                      </div>
                    </div>
                  )}

                  {/* Remarks for non-company users */}
                  {!isCompanyUser && task.remarks && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wider">Remarks</div>
                      <div className="text-sm text-gray-900 break-words">{task.remarks}</div>
                    </div>
                  )}

                  {/* Task Details from visibleColumns */}
                  <div className="space-y-3">
                    {visibleColumns.map(column => (
                      <div key={column.key}>
                        <div className="text-xs text-gray-500 uppercase tracking-wider">{column.label}</div>
                        <div className="text-sm text-gray-900 mt-1">
                          {column.key === 'linkOfSystem' && task[column.key] ? (
                            <a
                              href={task[column.key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline inline-flex items-center space-x-1"
                            >
                              <span>View Link</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : column.key === 'attachmentFile' && task[column.key] ? (
                            <a
                              href={task[column.key]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1 transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                              <span>View Attachment</span>
                            </a>
                          ) : column.key === 'expectedDateToClose' || column.key === 'givenDate' || column.key === 'actualDate' ? (
                            formatDateToDDMMYY(task[column.key]) || '-'
                          ) : column.key === 'descriptionOfWork' || column.key === 'notes' ? (
                            <span className="break-words">{task[column.key] || '-'}</span>
                          ) : (
                            task[column.key] || '-'
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons for non-admin, non-company users */}
                  {/* {!isCompanyUser && !isAdminUser && (
                    <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(task)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )} */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
      {filteredTasks.length === 0 && !loading && !isLoadingMore && (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Clock className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
    <p className="text-gray-500 px-4">
      {isAdminUser
        ? 'No tasks found matching your criteria.'
        : isCompanyUser
          ? `No tasks found for company: ${companyData.companyName}`
          : 'No tasks assigned to you match the criteria.'
      }
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

      {/* Assignment Popup with Clean & Classy UI */}
      {showAssignPopup && !isCompanyUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-200 mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Forward Task</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Reassign task to team member</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAssignPopup(false)}
                  disabled={forwardingInProgress}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Task Details */}
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500 uppercase">Task No</span>
                        <span className="px-2 py-1 bg-white text-blue-700 text-sm font-semibold rounded border border-blue-200">
                          {selectedTaskForAssign?.taskNo}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Assigned by: {selectedTaskForAssign?.teamMemberName}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700">Member 1</div>
                        <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900">
                          {selectedTaskForAssign?.assignedMember1 || 'Not assigned'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700">Member 2</div>
                        <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900">
                          {selectedTaskForAssign?.assignedMember2 || 'Not assigned'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">Current Status:</span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${selectedTaskForAssign?.status1?.includes('forward2') ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        selectedTaskForAssign?.status1?.includes('forward1') ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                        {selectedTaskForAssign?.status1 || 'Normal'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900">
                  Forward to Member
                </label>

                {(() => {
                  const availableMembers = getAvailableMembersForForwarding(selectedTaskForAssign);

                  if (availableMembers.length === 0) {
                    return (
                      <div className="text-sm text-amber-800 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span>No members available for forwarding. This task needs to have both Member1 and Member2 assigned.</span>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value && !forwardingInProgress) {
                            handleAssignTask(e.target.value);
                          }
                        }}
                        disabled={forwardingInProgress}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                      >
                        <option value="" disabled>
                          {forwardingInProgress ? 'Processing...' : 'Choose a member to forward...'}
                        </option>
                        {availableMembers.map((member) => {
                          const isCurrentAssignee = selectedTaskForAssign?.status1?.includes('forward2') ?
                            member === selectedTaskForAssign?.assignedMember1 :
                            member === selectedTaskForAssign?.assignedMember2;

                          return (
                            <option key={member} value={member}>
                              {member} {isCurrentAssignee ? '(Return to)' : '(Forward to)'}
                            </option>
                          );
                        })}
                      </select>

                      {/* Loading State */}
                      {forwardingInProgress && (
                        <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium text-blue-800">Forwarding task...</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Task will be reassigned immediately after selection
                </div>
                <button
                  onClick={() => setShowAssignPopup(false)}
                  disabled={forwardingInProgress}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forwardingInProgress ? 'Processing...' : 'Cancel'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}