// src/pages/User/DashboardUserPage.jsx
import React, { useEffect, useState } from "react";
import { getDashboardData } from "../../services/User/dashboardUserService";
import {
  FiActivity,
  FiCalendar,
  FiZap,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import awanKecil from "../../assets/awan_kecil.png";
import moodJar from "../../assets/mood-jar.png";
import duck from "../../assets/duck.png";

export default function DashboardUserPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMobileRecovery, setOpenMobileRecovery] = useState(false);
  const today = new Date();

  useEffect(() => {
    getDashboardData()
      .then((res) => setDashboard(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-2xl border border-[#B9D0EB]/50 bg-white/50 px-8 py-6 text-center shadow-sm dark:border-slate-700/50 dark:bg-white/5">
          <p className="text-slate-700 dark:text-slate-300">
            Loading Home...
          </p>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  const { greeting, socialBattery } = dashboard;

  return (
    <div className="relative z-10 flex min-h-full flex-col max-lg:px-4 max-lg:pb-[130px]">
      <div className="relative z-10 flex items-start justify-between max-lg:items-start max-lg:gap-2">
        <div className="max-lg:mt-2 max-lg:min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-4xl font-extrabold text-white max-lg:text-[22px] max-lg:leading-tight max-lg:break-words">
              {greeting.title.replace("!", "").trimEnd()}
              <span className="whitespace-nowrap">!</span>
            </h2>

            <img
              src={awanKecil}
              alt="cloud"
              className="h-14 w-14 object-contain max-lg:hidden"
            />
          </div>

          <p className="mt-1 text-lg text-white max-lg:w-[340px] max-lg:text-sm max-lg:leading-[1.2]">
            {greeting.subtitle}
          </p>
        </div>

       <div className="rounded-[9px] bg-[#426E96]/70 px-4 py-2 text-center shadow-[0_4px_0_rgba(40,75,105,0.35)] max-lg:min-w-[120px] max-lg:px-3 max-lg:py-2">
          <p className="text-[15px] font-extrabold capitalize text-white max-lg:text-[9px] max-lg:leading-tight">
            {formattedDate}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-1 gap-5 lg:grid-cols-5 max-lg:mt-5 max-lg:gap-4">
        <div className="space-y-5 lg:col-span-2">
          <div className="relative overflow-hidden rounded-[24px] border-2 border-[#8bb9e8] bg-[#dff0ff] p-4 shadow-sm dark:border-slate-600 dark:bg-slate-800/80 max-lg:rounded-[20px] max-lg:p-3">
            <div className="mb-3">
             <h3 className="text-base font-bold text-[#34445c] dark:text-white max-lg:text-sm">
                social battery status
              </h3>
            </div>

           <div className="relative rounded-[18px] border-4 border-[#91b9e8] bg-white p-2 max-lg:hidden max-lg:rounded-[12px] max-lg:border-[2px] max-lg:p-1">
             <div className="relative h-18 overflow-hidden rounded-[14px] border-4 border-[#8edbe4] bg-[#fffaf2] max-lg:h-[42px] max-lg:rounded-[8px] max-lg:border-[2px]">
                <div
                  className="h-full rounded-lg transition-all duration-500"
                  style={{
                    width: `${socialBattery.score?.toFixed(2)}%`,
                    background:
                      socialBattery.score < 50
                        ? "repeating-linear-gradient(135deg,#fecaca 0px,#fecaca 8px,#ffffff 8px,#ffffff 16px)"
                        : socialBattery.score <= 70
                          ? "repeating-linear-gradient(135deg,#fde68a 0px,#fde68a 8px,#ffffff 8px,#ffffff 16px)"
                          : "repeating-linear-gradient(135deg,#bbf7d0 0px,#bbf7d0 8px,#ffffff 8px,#ffffff 16px)",
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-[#5e7ee8] max-lg:text-sm">
                  {socialBattery.score?.toFixed(2)}%
                </div>
              </div>
            </div>

           <div className="mt-3 grid grid-cols-4 gap-2 text-xs max-lg:gap-1.5 max-lg:text-[10px] lg:grid-cols-3">
            <div className="rounded-md bg-white/70 p-1.5 text-gray-600 dark:bg-slate-700/80 dark:text-slate-200 lg:hidden">
                <div className="relative mx-auto h-[34px] w-full overflow-hidden rounded-[8px] border-2 border-[#8edbe4] bg-[#fffaf2]">
                  <div
                    className="h-full"
                    style={{
                      width: `${socialBattery.score?.toFixed(2)}%`,
                      background:
                        socialBattery.score < 50
                          ? "repeating-linear-gradient(135deg,#fecaca 0px,#fecaca 6px,#ffffff 6px,#ffffff 12px)"
                          : socialBattery.score <= 70
                          ? "repeating-linear-gradient(135deg,#fde68a 0px,#fde68a 6px,#ffffff 6px,#ffffff 12px)"
                          : "repeating-linear-gradient(135deg,#bbf7d0 0px,#bbf7d0 6px,#ffffff 6px,#ffffff 12px)",
                    }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-[#5e7ee8]">
                    {socialBattery.score?.toFixed(2)}%
                  </div>
                </div>
              </div>
             
             <div className="rounded-md bg-white/70 p-2 text-gray-600 dark:bg-slate-700/80 dark:text-slate-200 max-lg:p-1.5">
               <div className="flex items-center justify-center gap-1 font-semibold text-[#49769f] dark:text-blue-200 max-lg:text-[9px]">
                  <FiActivity className="text-[16px] max-lg:text-[12px]" />
                  <span>status</span>
                </div>
                <div className="mt-1 text-center">{socialBattery.status}</div>
              </div>

              <div className="rounded-md bg-white/70 p-2 text-gray-600 dark:bg-slate-700/80 dark:text-slate-200 max-lg:p-1.5">
                <div className="flex items-center justify-center gap-1 font-semibold text-[#49769f] dark:text-blue-200 max-lg:text-[9px]">
                  <FiCalendar className="text-[16px] max-lg:text-[12px]" />
                  <span>agenda</span>
                </div>
                <div className="mt-1 text-center">
                  {socialBattery.totalEvents}
                </div>
              </div>

              <div className="rounded-md bg-white/70 p-2 text-gray-600 dark:bg-slate-700/80 dark:text-slate-200 max-lg:p-1.5">
                <div className="flex items-center justify-center gap-1 font-semibold text-[#49769f] dark:text-blue-200 max-lg:text-[9px]">
                  <FiZap className="text-[16px] max-lg:text-[12px]" />
                  <span>intensitas</span>
                </div>
                <div className="mt-1 text-center">
                  {socialBattery.socialIntensityScore}
                </div>
              </div>
            </div>

            {/* Mobile Recovery Dropdown */}
            <div className="mt-3 lg:hidden">
              <button
                type="button"
                onClick={() => setOpenMobileRecovery(!openMobileRecovery)}
               className="flex w-full items-center justify-between rounded-[10px] bg-[#365E82] px-4 py-2 text-left text-[11px] font-bold text-white shadow-sm dark:bg-slate-700 dark:text-white"
              >
                <span>Saran Pemulihan</span>

                {openMobileRecovery ? (
                  <FiChevronDown className="text-base" />
                ) : (
                  <FiChevronRight className="text-base" />
                )}
              </button>

              {openMobileRecovery && (
                <div className="mt-2 rounded-[10px] bg-[#D8E5F2]/90 p-3 shadow-inner dark:bg-slate-800/90">
                  <p className="text-[11px] font-bold leading-relaxed text-[#34445C] dark:text-slate-200">
                    {socialBattery.recoverySuggestion ||
                      "Klik ‘Pesan Hari Ini’ di halaman social battery dan dapatkan tips pemulihan yang pas buatmu!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:col-span-3">
          {/* Desktop Recovery Suggestion */}
         <div className="relative hidden min-h-[250px] overflow-hidden rounded-[22px] border border-[#7FA6C7] bg-[#B7C8DA] pt-4 shadow-[0_4px_0_rgba(74,98,122,0.55)] dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-[0_4px_0_rgba(0,0,0,0.35)] lg:block">
            <h3 className="px-4 text-sm font-extrabold text-[#34445C] dark:text-white">
              Saran Pemulihan
            </h3>

            <div className="mt-3 w-full rounded-t-[14px] bg-[#D8E5F2]/90 p-3 shadow-inner dark:bg-slate-700/80">
              <p className="text-[10px] font-bold leading-relaxed text-[#34445C] dark:text-slate-200">
                {socialBattery.recoverySuggestion ||
                  "Klik ‘Pesan Hari Ini’ di halaman social battery dan dapatkan tips pemulihan yang pas buatmu!"}
              </p>
            </div>
          </div>

        <div className="relative min-h-[250px] overflow-visible rounded-[22px] border border-[#B7C8DA] bg-[#F3EEEE]/45 p-4 shadow-[0_4px_0_rgba(74,98,122,0.55)] dark:border-slate-600 dark:bg-slate-800/70 dark:shadow-[0_4px_0_rgba(0,0,0,0.35)] max-lg:min-h-[155px] max-lg:rounded-[18px] max-lg:p-3">
            <h3 className="text-sm font-extrabold text-[#34445C] dark:text-white">
              Pesan Dukungan
            </h3>

           <div className="relative z-10 mt-3 rounded-[14px] bg-[#365E82]/90 p-6 pr-20 shadow-inner dark:bg-slate-700/90">
              <p className="text-[10px] font-bold leading-relaxed text-white">
                {socialBattery.supportMessage ||
                  socialBattery.aiInsight ||
                  "Ceritakan perasaanmu di Mood Jar dan dapatkan pesan dukungan khusus buatmu!"}
              </p>
            </div>

            <img
              src={moodJar}
              alt="jar"
              className="pointer-events-none absolute z-20 h-50 w-80 object-contain lg:bottom-[-90px] lg:right-[-135px] max-lg:bottom-[-50px] max-lg:right-[-30px] max-lg:h-32 max-lg:w-32"
            />
          </div>
        </div>
      </div>

      <img
        src={duck}
        alt="duck"
        className="
          pointer-events-none
          absolute
          z-0
          object-contain
          opacity-95

          bottom-[-30px]
          right-[-20px]
          w-[470px]
          md:w-[570px]

          max-lg:bottom-[-30px]
          max-lg:right-[-12px]
          max-lg:w-[320px]
        "
      />
    </div>
  );
}