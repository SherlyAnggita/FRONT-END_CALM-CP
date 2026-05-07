// pages/admin/DashboardPage.jsx

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import socket from "../../../lib/socket";

import { getDashboard } from "../../../services/Admin/DashboardService";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await getDashboard();
        setDashboard(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
    socket.emit("join_admin_dashboard");
    socket.on("dashboard_updated", (payload) => {
      console.log("Dashboard Updated:", payload);
      fetchDashboard();
    });
    return () => {
      socket.off("dashboard_updated");
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <div className="alert alert-error">Dashboard data tidak ditemukan.</div>
      </div>
    );
  }

  const { summary, charts, recentActivities } = dashboard;

  const summaryCards = [
    {
      title: "Total Users",
      value: summary.totalUsers,
      desc: "Registered users",
    },
    {
      title: "Mood Entries",
      value: summary.totalMoodEntries,
      desc: "Total mood records",
    },
    {
      title: "Support Messages",
      value: summary.totalSupportMessages,
      desc: "Generated encouragements",
    },
    {
      title: "Analysis Problems",
      value: summary.analysisProblems.total,
      desc: `${summary.analysisProblems.failed} failed • ${summary.analysisProblems.pending} pending`,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm opacity-70">
          Overview data MyCalmSpace admin panel
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="card bg-base-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="card-body">
              <p className="text-sm opacity-70">{card.title}</p>
              <h2 className="text-3xl font-bold">{card.value}</h2>
              <p className="text-xs opacity-60">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* USER GROWTH */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">User Growth</h2>
            <div className="h-72 min-h-[288px] w-full min-w-0">
              <ResponsiveContainer width="100%" height={288}>
                <BarChart data={charts.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <defs>
                    <linearGradient
                      id="userGrowthGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                      <stop
                        offset="100%"
                        stopColor="#c4b5fd"
                        stopOpacity={0.65}
                      />
                    </linearGradient>
                  </defs>
                  <Bar
                    dataKey="total"
                    name="Total Users"
                    fill="url(#userGrowthGradient)"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* MOOD DISTRIBUTION */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Mood Distribution</h2>
            <div className="h-72 min-h-[288px] w-full min-w-0">
              <ResponsiveContainer width="100%" height={288}>
                <PieChart>
                  <Pie
                    data={charts.moodDistribution}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    cornerRadius={8}
                    label={(entry) => `${entry.emoji || ""} ${entry.name}`}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {charts.moodDistribution.map((entry) => (
                      <Cell
                        key={entry.moodLabelId}
                        fill={entry.color || "#8884d8"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* MOOD TREND */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Mood Trend</h2>
            <div className="h-72 min-h-[288px] w-full min-w-0">
              <ResponsiveContainer width="100%" height={288}>
                <LineChart data={charts.moodTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="averageMoodScore"
                    name="Avg Mood Score"
                    stroke="#22c55e"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    dot={false}
                    activeDot={{ r: 7 }}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={3000}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SOCIAL BATTERY TREND */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Social Battery Trend</h2>
            <div className="h-72 min-h-[288px] w-full min-w-0">
              <ResponsiveContainer width="100%" height={288}>
                <AreaChart data={charts.socialBatteryTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <defs>
                    <linearGradient
                      id="batteryGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient
                      id="intensityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#f97316"
                        stopOpacity={0.35}
                      />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <Area
                    type="monotone"
                    dataKey="averageBatteryScore"
                    name="Battery Score"
                    stroke="#3b82f6"
                    fill="url(#batteryGradient)"
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                    animationDuration={2500}
                    animationEasing="ease-in-out"
                  />

                  <Area
                    type="monotone"
                    dataKey="averageSocialIntensityScore"
                    name="Social Intensity"
                    stroke="#f97316"
                    fill="url(#intensityGradient)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    activeDot={{ r: 6 }}
                    isAnimationActive={true}
                    animationDuration={2500}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        {/* SOCIAL BATTERY STATUS DISTRIBUTION */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="card-title">Social Battery Status</h2>

            <div className="h-72 min-h-[288px] w-full min-w-0">
              <ResponsiveContainer width="100%" height={288}>
                <PieChart>
                  <Pie
                    data={charts.socialBatteryStatusDistribution || []}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    cornerRadius={8}
                    label={(entry) => `${entry.name}`}
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  >
                    {(charts.socialBatteryStatusDistribution || []).map(
                      (entry) => (
                        <Cell
                          key={entry.batteryStatusId}
                          fill={entry.color || "#8884d8"}
                        />
                      ),
                    )}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITIES */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Recent Activities</h2>
            <span className="badge badge-neutral">
              {recentActivities.length} latest
            </span>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 rounded-xl border border-base-200 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      {activity.user?.fullName || "Unknown User"}
                    </p>

                    <span className="badge badge-outline badge-sm">
                      {activity.action}
                    </span>
                  </div>

                  <p className="mt-1 text-sm opacity-80">
                    {activity.description || "-"}
                  </p>

                  <p className="mt-2 text-xs opacity-50">
                    {new Date(activity.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
