// src/pages/User/DashboardUserPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardData } from "../../services/User/dashboardUserService";
import { FiActivity, FiCalendar, FiZap } from "react-icons/fi"; 
import sun from "../../assets/sun.png";
import awanKecil from "../../assets/awan_kecil.png";
import cloudMain from "../../assets/cloud.png";
import star1 from "../../assets/star1.png";
import star2 from "../../assets/star2.png";
import star3 from "../../assets/star3.png";

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
     <div className="space-y-5 p-4 md:p-6">
      {/* Greeting Card */}
      <div
        className="relative h-[120px] overflow-visible rounded-[26px] border-2 border-[#efdac0] bg-[#fffaf2] px-6 py-5 shadow-sm"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10px 10px, #f4dcc1 2px, transparent 2px)",
          backgroundSize: "22px 22px",
        }}
      >
        <div className="relative z-10 max-w-[230px] md:max-w-none">
          <h2 className="text-2xl font-extrabold text-[#3b2a3d] md:text-3xl">
            {greeting.title}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{greeting.subtitle}</p>
        </div>

        <img
          src={sun}
          alt="sun"
          className="absolute -top-8 right-6 h-36 w-36 object-contain md:-top-12 md:right-1 md:h-44 md:w-44"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* LEFT COLUMN */}
        <div className="space-y-5 lg:col-span-2">
          {/* Social Battery Card */}
          <div className="relative overflow-hidden rounded-[24px] border-2 border-[#8bb9e8] bg-[#dff0ff] p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-base font-bold text-[#34445c]">
                social battery status
              </h3>
                <div>
                  <img
                    src={awanKecil}
                    alt="awan"
                    className="h-7 w-7 object-contain"
                  />
              </div>
            </div>

            <div className="relative rounded-[18px] border-4 border-[#91b9e8] bg-white p-2">
              <div className="relative h-18 overflow-hidden rounded-[14px] border-4 border-[#8edbe4] bg-[#fffaf2]">
                <div
                  className="h-full rounded-lg transition-all duration-500"
                  style={{
                    width: `${socialBattery.score}%`,
                    background:
                      socialBattery.score < 50
                        ? "repeating-linear-gradient(135deg,#fecaca 0px,#fecaca 8px,#ffffff 8px,#ffffff 16px)"
                        : socialBattery.score <= 70
                        ? "repeating-linear-gradient(135deg,#fde68a 0px,#fde68a 8px,#ffffff 8px,#ffffff 16px)"
                        : "repeating-linear-gradient(135deg,#bbf7d0 0px,#bbf7d0 8px,#ffffff 8px,#ffffff 16px)",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-[#5e7ee8]">
                  {socialBattery.score}%
                </div>
              </div>
            </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-md bg-white/70 p-2 text-gray-600">
              <div className="flex items-center justify-center gap-1 font-semibold text-[#49769f]">
                <FiActivity size={16} />
                <span>status</span>
              </div>

              <div className="mt-1 text-center">
                {socialBattery.status}
              </div>
            </div>

            <div className="rounded-md bg-white/70 p-2 text-gray-600">
              <div className="flex items-center justify-center gap-1 font-semibold text-[#49769f]">
                <FiCalendar size={16} />
                <span>events</span>
              </div>

              <div className="mt-1 text-center">
                {socialBattery.totalEvents}
              </div>
            </div>

            <div className="rounded-md bg-white/70 p-2 text-gray-600">
              <div className="flex items-center justify-center gap-1 font-semibold text-[#49769f]">
                <FiZap size={16} />
                <span>intensity</span>
              </div>

              <div className="mt-1 text-center">
                {socialBattery.socialIntensityScore}
              </div>
            </div>
          </div>
        </div>

           {/* Daily Events Card */}
        <div className="rounded-xl border border-[#a55b4c] bg-[#efe2d7] p-4 shadow-md">
          <h3 className="mb-3 text-xl font-semibold text-slate-800">
            Daily Events
          </h3>

          <div className="space-y-2">
            {dailyEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-slate-700"
              >
                <span className="h-3 w-3 rounded-full border border-[#d98a7c]" />

                <span className="font-medium">
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

                <span>{event.title}</span>
              </div>
            ))}
          </div>

         <div className="mt-2 text-right">
            <Link
              to="/user/calendar"
              className="text-xs font-semibold text-[#2878c7] hover:underline"
            >
              read more...
            </Link>
        </div>
        </div>
      </div>

       {/* Mood Summary Card */}
      <div className="relative overflow-hidden rounded-xl border border-[#eaf6ff] bg-[#49769f] p-5 shadow-md lg:col-span-3">
        
        {/* decorative stars */}
        <img
          src={star1}
          alt="star"
          className="absolute left-[-50px] top-15 z-[1] h-80 w-80 object-contain opacity-90"
        />

        <img
          src={star2}
          alt="star"
          className="absolute right-0 top-0 z-[1] h-100 w-100 object-contain opacity-80"
        />

        <img
          src={star3}
          alt="star"
          className="absolute bottom-[-190px] left-1/4 z-[1] h-100 w-100 object-contain opacity-90"
        />

        {/* cloud background */}
        <img
          src={cloudMain}
          alt="cloud"
          className="
            pointer-events-none
            absolute
            right-[10px]
            top-1/2
            z-0
            h-52
            w-52
            -translate-y-1/2
            object-contain
            opacity-40
          "
        />

        <div className="flex h-full items-center justify-between gap-4">
          
          <div className="relative z-10 flex-1">
            <h3 className="mb-3 text-2xl font-semibold text-white">
              Mood Summary
            </h3>

            <p className="text-sm leading-relaxed text-white/90">
              {moodSummary.summaryText}
            </p>

            {moodSummary.latestSupportMessage && (
              <p className="mt-2 text-sm italic text-white/70">
                {moodSummary.latestSupportMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}