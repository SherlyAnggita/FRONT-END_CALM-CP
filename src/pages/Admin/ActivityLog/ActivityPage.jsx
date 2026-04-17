import { useEffect, useState } from "react";
import * as RDT from "react-data-table-component";
import {
  getActivityLogs,
  exportActivityLogsExcel,
  exportActivityLogsPdf,
} from "../../../services/Admin/activityLogService";
import { UAParser } from "ua-parser-js";
import toast from "react-hot-toast";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

import "./activityTable.css";

const DataTable = RDT.default?.default ?? RDT.default ?? RDT.DataTable;

export default function ActivityPage() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [pdfLoadingUserId, setPdfLoadingUserId] = useState(null);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

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

  function handleDownloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  }

  async function handleExportExcel() {
    try {
      setExportLoading(true);

      const blob = await exportActivityLogsExcel({
        search,
        sortBy,
        order,
      });

      handleDownloadFile(blob, "activity-logs.xlsx");
      toast.success("Export Excel berhasil");
    } catch (err) {
      toast.error(err.message || "Gagal export Excel");
    } finally {
      setExportLoading(false);
    }
  }

  async function handleExportPdf(row) {
    try {
      const selectedUserId = row?.user?.id;

      if (!selectedUserId) {
        toast.error("User ID tidak ditemukan");
        return;
      }

      setPdfLoadingUserId(selectedUserId);

      const blob = await exportActivityLogsPdf(selectedUserId);

      const safeUsername =
        row?.user?.username ||
        row?.user?.fullName?.replace(/\s+/g, "-").toLowerCase() ||
        selectedUserId;

      handleDownloadFile(blob, `activity-log-${safeUsername}.pdf`);
      toast.success("Export PDF berhasil");
    } catch (err) {
      toast.error(err.message || "Gagal export PDF");
    } finally {
      setPdfLoadingUserId(null);
    }
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

Aktivitas     : ${row.action || "-"}
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
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    async function fetchActivityLogs() {
      try {
        setLoading(true);
        setError("");

        const response = await getActivityLogs({
          page,
          limit,
          search,
          sortBy,
          order,
        });

        setLogs(response?.data || []);
        setPagination(response?.pagination || null);
      } catch (err) {
        setError(err.message || "Gagal mengambil activity logs");
      } finally {
        setLoading(false);
      }
    }

    fetchActivityLogs();
  }, [page, limit, search, sortBy, order]);

  const columns = [
    {
      id: "no",
      name: "No",
      width: "70px",
      cell: (row, index) => <span>{(page - 1) * limit + index + 1}</span>,
      sortable: false,
    },
    {
      id: "fullName",
      name: "Nama User",
      selector: (row) => row.user?.fullName || "-",
      sortable: false,
      wrap: true,
    },
    {
      id: "username",
      name: "Username",
      selector: (row) => row.user?.username || "-",
      sortable: false,
      wrap: true,
    },
    {
      id: "role",
      name: "Role",
      selector: (row) => row.user?.role || "-",
      sortable: false,
      wrap: true,
    },
    {
      id: "action",
      name: "Action",
      selector: (row) => row.action || "-",
      sortable: true,
      sortField: "action",
      wrap: true,
    },
    {
      id: "ipAddress",
      name: "IP Address",
      selector: (row) => formatIP(row.ipAddress),
      sortable: false,
      wrap: true,
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
      sortable: false,
      wrap: true,
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
      sortable: false,
    },
    {
      id: "createdAt",
      name: "Created At",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).getTime() : 0,
      cell: (row) => (row.createdAt ? formatDateTime(row.createdAt) : "-"),
      sortable: true,
      sortField: "createdAt",
      wrap: true,
    },
    {
      id: "aksi",
      name: "Aksi",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCopy(row)}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          >
            Copy
          </button>

          <button
            onClick={() => handleExportPdf(row)}
            disabled={pdfLoadingUserId === row.user?.id}
            className="flex items-center gap-1 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FaFilePdf size={14} />
            {pdfLoadingUserId === row.user?.id ? "Loading..." : "PDF"}
          </button>
        </div>
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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
              disabled={exportLoading}
              className="flex items-center justify-center rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
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
          <div className="min-w-275">
            <DataTable
              columns={columns}
              data={logs}
              progressPending={loading}
              pagination
              paginationServer
              sortServer
              paginationTotalRows={pagination?.totalItems || 0}
              paginationPerPage={limit}
              paginationDefaultPage={page}
              paginationComponentOptions={paginationComponentOptions}
              onChangePage={(newPage) => setPage(newPage)}
              onSort={(column, sortDirection) => {
                const nextSortBy = column.sortField || column.id;

                if (!nextSortBy) return;

                setSortBy(nextSortBy);
                setOrder(sortDirection === "asc" ? "asc" : "desc");
                setPage(1);
              }}
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
