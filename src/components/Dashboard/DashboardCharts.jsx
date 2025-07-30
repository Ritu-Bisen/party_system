"use client"
import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Users, Clock, CheckCircle, Calendar } from "lucide-react"

const taskCompletionData = [
  { month: "Jan", completed: 45, pending: 12, total: 57 },
  { month: "Feb", completed: 52, pending: 8, total: 60 },
  { month: "Mar", completed: 48, pending: 15, total: 63 },
  { month: "Apr", completed: 61, pending: 9, total: 70 },
  { month: "May", completed: 55, pending: 11, total: 66 },
  { month: "Jun", completed: 67, pending: 7, total: 74 },
]

const teamPerformanceData = [
  { name: "Satyendra", tasks: 28, efficiency: 85 },
  { name: "Chetan", tasks: 22, efficiency: 92 },
  { name: "Digendra", tasks: 31, efficiency: 88 },
  { name: "Vikas", tasks: 26, efficiency: 79 },
  { name: "Pratap", tasks: 19, efficiency: 83 },
  { name: "Tuleshwar", tasks: 24, efficiency: 90 },
]

const projectStatusData = [
  { name: "Completed", value: 45, color: "#10B981 " },
  { name: "In Progress", value: 23, color: "#3B82F6" },
  { name: "Pending", value: 12, color: "#F59E0B" },
  { name: "On Hold", value: 5, color: "#EF4444" },
]

const weeklyActivityData = [
  { day: "Mon", tasks: 12, hours: 8.5 },
  { day: "Tue", tasks: 15, hours: 9.2 },
  { day: "Wed", tasks: 8, hours: 7.8 },
  { day: "Thu", tasks: 18, hours: 10.1 },
  { day: "Fri", tasks: 14, hours: 8.9 },
  { day: "Sat", tasks: 6, hours: 4.2 },
  { day: "Sun", tasks: 3, hours: 2.1 },
]

export default function DashboardCharts() {
  const [activeChart, setActiveChart] = useState("completion")

  const chartTabs = [
    { id: "completion", label: "Task Completion", icon: CheckCircle },
    { id: "performance", label: "Team Performance", icon: Users },
    { id: "status", label: "Project Status", icon: TrendingUp },
    { id: "activity", label: "Weekly Activity", icon: Calendar },
  ]

  const renderChart = () => {
    switch (activeChart) {
      case "completion":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={taskCompletionData}>
              <defs>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="#10B981"
                fill="url(#completedGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="#F59E0B"
                fill="url(#pendingGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )

      case "performance":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="efficiency" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )

      case "status":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )

      case "activity":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
            <div className="flex items-center space-x-2">
              {chartTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeChart === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">{renderChart()}</div>
      </div>

      {/* Stats Cards */}
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">Tasks Completed</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">342</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm text-gray-600">Pending Tasks</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">23</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">Active Users</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">6</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">Efficiency</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">87%</span>
            </div>
          </div>
        </div>

        {/* Project Status Legend */}
        {activeChart === "status" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
            <div className="space-y-3">
              {projectStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Productivity Up</span>
              </div>
              <p className="text-xs text-green-700">Task completion rate increased by 15% this month</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Team Efficiency</span>
              </div>
              <p className="text-xs text-blue-700">Average team efficiency is 87%, above target of 85%</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-800">Pending Review</span>
              </div>
              <p className="text-xs text-orange-700">4 tasks pending review for more than 2 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
