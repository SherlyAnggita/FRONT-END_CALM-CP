import { useEffect, useMemo, useState } from "react";
import * as RDT from "react-data-table-component";
import { getActivityLogs } from "../../../services/Admin/activityLogService";
import { UAParser } from "ua-parser-js";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { FaFileExcel } from "react-icons/fa";

import "./activityTable.css";

const DataTable = RDT.default?.default ?? RDT.default ?? RDT.DataTable;

export default function ActivityPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  function handleExportExcel() {
    if (!processedLogs.length) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    const exportData = processedLogs.map((log, index) => {
      const parsed = parseUserAgent(log.userAgent);

      return {
        No: index + 1,
        "Nama User": log.user?.fullName || "-",
        Username: log.user?.username || "-",
        Role: log.user?.role || "-",
        "Alamat IP": formatIP(log.ipAddress),
        Device: parsed.device,
        OS: parsed.os,
        Browser: parsed.browser,
        Aktivitas: log.action || "-",
        Deskripsi: log.description || "-",
        "Waktu Kejadian": formatDateTime(log.createdAt),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // auto width kolom biar rapi
    const columnWidths = Object.keys(exportData[0]).map((key) => ({
      wch: key.length + 5,
    }));
    worksheet["!cols"] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Logs");

    XLSX.writeFile(workbook, "activity-logs.xlsx");
  }

  function formatDateTime(date) {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  function handleCopy(row) {
    const parsed = parseUserAgent(row.userAgent);

    const text = `
Laporan Aktivitas Pengguna

Nama Pengguna : ${row.user?.fullName || "-"}
Username      : ${row.user?.username || "-"}
Role          : ${row.user?.role || "-"}
Alamat IP     : ${formatIP(row.ipAddress)}
Perangkat     : ${parsed.device}
Sistem Operasi: ${parsed.os}
Browser       : ${parsed.browser}

Aktivitas     : ${row.action}
Deskripsi     : ${row.description || "-"}

Waktu Kejadian: ${formatDateTime(row.createdAt)}
`;

    navigator.clipboard
      .writeText(text.trim())
      .then(() => {
        toast.success("Berhasil disalin ke clipboard");
      })
      .catch(() => {
        toast.error("Gagal menyalin data");
      });
  }
  function formatIP(ip) {
    if (!ip) return "-";
    if (ip === "::1") return "127.0.0.1 (localhost)";
    return ip;
  }
  function parseUserAgent(ua) {
    if (!ua) {
      return {
        os: "Unknown OS",
        browser: "Unknown Browser",
        device: "Desktop/Unknown",
      };
    }

    const parser = new UAParser(ua);
    const result = parser.getResult();

    const os = result.os?.name || "Unknown OS";
    const browser = result.browser?.name || "Unknown Browser";

    let device = "Desktop";
    if (result.device?.type === "mobile") device = "Mobile";
    else if (result.device?.type === "tablet") device = "Tablet";
    else if (result.device?.type) device = result.device.type;

    return { os, browser, device };
  }

  function getDeviceIcon(device) {
    switch (device) {
      case "Mobile":
        return "📱";
      case "Tablet":
        return "📟";
      case "Desktop":
      default:
        return "💻";
    }
  }

  function getOSIcon(os) {
    if (os.includes("Windows")) return "🪟";
    if (os.includes("Mac")) return "🍎";
    if (os.includes("Android")) return "🤖";
    if (os.includes("iOS") || os.includes("iPhone")) return "📱";
    if (os.includes("Linux")) return "🐧";
    return "🖥️";
  }

  function getBrowserIcon(browser) {
    if (browser.includes("Chrome")) return "🌐";
    if (browser.includes("Edge")) return "🟦";
    if (browser.includes("Firefox")) return "🦊";
    if (browser.includes("Safari")) return "🧭";
    if (browser.includes("Opera")) return "🅾️";
    return "🌍";
  }

  const getIsDarkMode = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDark, setIsDark] = useState(getIsDarkMode());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = (event) => {
      setIsDark(event.matches);
    };

    setIsDark(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    async function fetchActivityLogs() {
      try {
        setLoading(true);
        setError("");

        const response = await getActivityLogs(page, limit);
        setLogs(response.data || []);
        setPagination(response.pagination || null);
      } catch (err) {
        setError(err.message || "Gagal mengambil activity logs");
      } finally {
        setLoading(false);
      }
    }

    fetchActivityLogs();
  }, [page, limit]);

  const processedLogs = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const filtered = logs.filter((log) => {
      if (!keyword) return true;

      return (
        log.user?.fullName?.toLowerCase().includes(keyword) ||
        log.user?.username?.toLowerCase().includes(keyword) ||
        log.user?.role?.toLowerCase().includes(keyword) ||
        log.action?.toLowerCase().includes(keyword) ||
        log.description?.toLowerCase().includes(keyword)
      );
    });

    return [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }, [logs, search]);

  const columns = [
    {
      id: "no",
      name: "No",
      width: "70px",
      cell: (row, index) => <span>{(page - 1) * limit + index + 1}</span>,
    },
    {
      id: "fullName",
      name: "Nama User",
      selector: (row) => row.user?.fullName || "-",
      sortable: true,
      wrap: true,
    },
    {
      id: "username",
      name: "Username",
      selector: (row) => row.user?.username || "-",
      sortable: true,
      wrap: true,
    },
    {
      id: "role",
      name: "Role",
      selector: (row) => row.user?.role || "-",
      sortable: true,
      wrap: true,
    },
    {
      id: "action",
      name: "Action",
      selector: (row) => row.action || "-",
      sortable: true,
      wrap: true,
    },
    {
      id: "ipAddress",
      name: "IP Address",
      selector: (row) => formatIP(row.ipAddress),
      sortable: true,
      wrap: true,
      // hide: "md",
    },
    {
      id: "userAgent",
      name: "User Agent",
      cell: (row) => {
        const { os, device, browser } = parseUserAgent(row.userAgent);

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              fontSize: "13px",
            }}
          >
            <span>
              {getOSIcon(os)} {os}
            </span>
            <span>
              {getDeviceIcon(device)} {device}
            </span>
            <span>
              {getBrowserIcon(browser)} {browser}
            </span>
          </div>
        );
      },
      sortable: true,
      wrap: true,
      // hide: "md",
    },
    {
      id: "description",
      name: "Description",
      cell: (row) => (
        <div
          style={{
            maxWidth: "280px",
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: "1.4",
          }}
        >
          {row.description || "-"}
        </div>
      ),
      wrap: true,
    },
    {
      id: "createdAt",
      name: "Created At",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).getTime() : 0,
      cell: (row) =>
        row.createdAt
          ? new Intl.DateTimeFormat("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(row.createdAt))
          : "-",
      sortable: true,
      wrap: true,
    },
    {
      id: "aksi",
      name: "Aksi",
      cell: (row) => (
        <button
          onClick={() => handleCopy(row)}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
        >
          Copy
        </button>
      ),
    },
  ];

  const customStyles = {
    table: {
      style: {
        backgroundColor: isDark ? "#111827" : "#ffffff",
      },
    },
    headRow: {
      style: {
        backgroundColor: isDark ? "#111827" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
        borderBottom: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
        fontSize: "14px",
        fontWeight: 700,
      },
    },
    headCells: {
      style: {
        color: isDark ? "#ffffff" : "#111827",
        fontSize: "14px",
        fontWeight: 700,
      },
    },
    rows: {
      style: {
        backgroundColor: isDark ? "#111827" : "#ffffff",
        color: isDark ? "#e5e7eb" : "#111827",
        borderBottom: `1px solid ${isDark ? "#1f2937" : "#e5e7eb"}`,
        minHeight: "70px",
      },
      highlightOnHoverStyle: {
        backgroundColor: isDark ? "#1f2937" : "#f9fafb",
        color: isDark ? "#ffffff" : "#111827",
        outline: "none",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: isDark ? "#e5e7eb" : "#111827",
      },
    },
    pagination: {
      style: {
        backgroundColor: isDark ? "#111827" : "#ffffff",
        color: isDark ? "#e5e7eb" : "#111827",
        borderTop: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
        minHeight: "56px",
      },
      pageButtonsStyle: {
        borderRadius: "6px",
        height: "32px",
        width: "32px",
        padding: "6px",
        margin: "0 4px",
        cursor: "pointer",
        color: isDark ? "#e5e7eb" : "#111827",
        fill: isDark ? "#e5e7eb" : "#111827",
        backgroundColor: "transparent",
      },
    },
  };

  const paginationComponentOptions = {
    rowsPerPageText: "",
    rangeSeparatorText: "dari",
    noRowsPerPage: true,
    selectAllRowsItem: false,
  };

  if (error) {
    return (
      <div className="p-6">
        <h1
          className="mb-4 text-2xl font-bold"
          style={{ color: isDark ? "#ffffff" : "#111827" }}
        >
          Activity Logs
        </h1>
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!DataTable) {
    return <div className="p-6 text-red-400">DataTable gagal dimuat.</div>;
  }

  return (
    <div className="p-6">
      <h1
        className="mb-4 text-2xl font-bold"
        style={{ color: isDark ? "#ffffff" : "#111827" }}
      >
        Activity Logs
      </h1>

      <div
        className="activity-table w-full max-w-full overflow-hidden rounded-xl border"
        style={{
          borderColor: isDark ? "#374151" : "#d1d5db",
          backgroundColor: isDark ? "#111827" : "#ffffff",
        }}
      >
        <div
          className="flex w-full flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between"
          style={{
            borderColor: isDark ? "#374151" : "#e5e7eb",
            backgroundColor: isDark ? "#111827" : "#ffffff",
          }}
        >
          <input
            type="text"
            placeholder="Cari user, action, atau deskripsi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none md:max-w-xs"
            style={{
              border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
              backgroundColor: isDark ? "#111827" : "#ffffff",
              color: isDark ? "#ffffff" : "#111827",
            }}
          />

          <div className="flex items-center gap-2 md:ml-auto">
            <button
              onClick={handleExportExcel}
              className="flex items-center justify-center rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
              title="Export Excel"
            >
              <FaFileExcel size={16} />
            </button>

            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: isDark ? "#d1d5db" : "#374151" }}
            >
              <span>Baris per halaman</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="activity-limit-select rounded-lg px-3 py-2 outline-none"
                style={{
                  border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
                  backgroundColor: isDark ? "#111827" : "#ffffff",
                  color: isDark ? "#ffffff" : "#111827",
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-[1100px]">
            <DataTable
              columns={columns}
              data={processedLogs}
              progressPending={loading}
              pagination
              paginationServer
              paginationTotalRows={
                search ? processedLogs.length : pagination?.totalItems || 0
              }
              paginationPerPage={limit}
              paginationDefaultPage={page}
              paginationComponentOptions={paginationComponentOptions}
              onChangePage={(newPage) => setPage(newPage)}
              highlightOnHover
              persistTableHead
              defaultSortFieldId="createdAt"
              defaultSortAsc={false}
              customStyles={customStyles}
              noDataComponent={
                <div
                  className="py-6 text-sm"
                  style={{ color: isDark ? "#d1d5db" : "#6b7280" }}
                >
                  Belum ada activity logs
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
