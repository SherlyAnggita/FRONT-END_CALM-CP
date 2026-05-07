// src/pages/User/DashboardUserPage.jsx
import React, { useEffect, useState } from "react";
import { getDashboardData } from "../../services/User/dashboardUserService";

export default function DashboardUserPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboardData()
      .then((res) => setDashboard(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  const { greeting, user, socialBattery, dailyEvents, moodSummary } = dashboard;

  return (
    <div className="p-4 md:p-8 space-y-4">
      {/* Greeting Card */}
      <div className="card bg-blue-50 shadow-md flex justify-between items-center p-6 rounded-lg">
        <div>
          <h2 className="text-xl font-bold">{greeting.title}</h2>
          <p className="text-gray-600">{greeting.subtitle}</p>
        </div>
        <img src="/sun-cloud.png" alt="sun cloud" className="w-16 h-16" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Social Battery Card */}
        <div className="card bg-base-100 shadow-md p-4 flex flex-col items-center rounded-lg">
          <h3 className="card-title mb-2">Social Battery Status</h3>
          <div className="text-2xl font-bold mb-1">{socialBattery.score}%</div>
          <div className="text-sm text-gray-500 mb-2">
            {socialBattery.status}
          </div>
          <progress
            className="progress progress-primary w-full mb-2"
            value={socialBattery.score}
            max="100"
          ></progress>
          <div className="text-xs text-gray-400">
            {socialBattery.totalEvents} events |{" "}
            {socialBattery.socialIntensityScore} intensity
          </div>
        </div>

        {/* Daily Events Card */}
        <div className="card bg-base-100 shadow-md p-4 rounded-lg">
          <h3 className="card-title mb-2">Daily Events</h3>
          <ul className="menu menu-compact w-full">
            {dailyEvents.map((event) => (
              <li key={event.id}>
                <a className="flex justify-between">
                  <span className="text-gray-700">{event.title}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(event.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(event.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="text-blue-500 text-sm mt-2 cursor-pointer">
            read more...
          </div>
        </div>

        {/* Mood Summary Card */}
        <div className="card bg-base-100 shadow-md md:col-span-1 p-4 rounded-lg flex items-center">
          <div className="flex-1">
            <h3 className="card-title mb-2">Mood Summary</h3>
            <p className="text-gray-600">{moodSummary.summaryText}</p>
            {moodSummary.latestSupportMessage && (
              <p className="text-gray-400 italic mt-2">
                {moodSummary.latestSupportMessage}
              </p>
            )}
          </div>
          <img
            src="/cloud-mood.png"
            alt="cloud mood"
            className="w-20 h-20 ml-4"
          />
        </div>
      </div>
    </div>
  );
}
