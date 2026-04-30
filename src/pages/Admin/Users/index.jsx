import { getUsers } from "../../../services/Admin/usersService";
import { toggleUserActive } from "../../../services/Admin/usersService";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as RDT from "react-data-table-component";
import toast from "react-hot-toast";
import "./UsersTable.css";
import TambahUsers from "./tambah";
import ConfirmToggleUserModal from "./ConfirmToggleUserModal";
import UsersActionMenu from "../../../components/Admin/Users/UsersActionMenu";

const DataTable = RDT.default?.default ?? RDT.default ?? RDT.DataTable;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [showTambahModal, setShowTambahModal] = useState(false);
  const navigate = useNavigate();
  const [openActionId, setOpenActionId] = useState(null);
  const [toggleLoadingId, setToggleLoadingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  function handleToggleAction(id) {
    setOpenActionId((prev) => (prev === id ? null : id));
  }

  function handleDetail(row) {
    navigate(`/admin/users/${row.id}`);
  }

  async function handleConfirmToggleActive() {
    if (!selectedUser) return;

    try {
      setToggleLoadingId(selectedUser.id);

      await toggleUserActive(selectedUser.id);

      toast.success(
        `User berhasil ${
          selectedUser.isActive ? "dinonaktifkan" : "diaktifkan"
        }`,
      );

      setOpenActionId(null);
      setSelectedUser(null);
      await fetchUsers();
    } catch (error) {
      toast.error(error.message || "Gagal mengubah status user");
      console.error(error);
    } finally {
      setToggleLoadingId(null);
    }
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

  function formatDateTime(date) {
    if (!date) return "-";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  async function fetchUsers() {
    try {
      setLoading(true);

      const res = await getUsers({
        page,
        limit,
        search,
        sortBy,
        order,
      });

      setUsers(res?.data || []);
      setMeta(res?.meta || null);
    } catch (error) {
      toast.error(error.message || "Gagal mengambil data user");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [page, limit, search, sortBy, order]);

  const columns = [
    {
      id: "no",
      name: "No",
      cell: (row, index) => <span>{(page - 1) * limit + index + 1}</span>,
      width: "70px",
      sortable: false,
      center: true,
    },
    {
      id: "fullName",
      name: "Nama",
      selector: (row) => row.fullName || "-",
      sortable: true,
      sortField: "fullName",
      wrap: true,
      center: true,
    },
    {
      id: "email",
      name: "Email",
      selector: (row) => row.email || "-",
      sortable: true,
      sortField: "email",
      wrap: true,
      center: true,
    },
    {
      id: "username",
      name: "Username",
      selector: (row) => row.username || "-",
      sortable: true,
      sortField: "username",
      wrap: true,
      center: true,
    },
    {
      id: "phoneNumber",
      name: "No HP",
      selector: (row) => row.phoneNumber || "-",
      sortable: false,
      wrap: true,
      center: true,
    },
    {
      id: "authProvider",
      name: "Auth",
      selector: (row) => row.authProvider || "-",
      sortable: true,
      sortField: "authProvider",
      wrap: true,
      center: true,
    },
    {
      id: "role",
      name: "Role",
      selector: (row) => row.role || "-",
      sortable: true,
      sortField: "role",
      wrap: true,
      center: true,
    },
    {
      id: "isActive",
      name: "Status",
      cell: (row) => (
        <span
          style={{
            color: row.isActive ? "#16a34a" : "#dc2626",
            fontWeight: "bold",
          }}
        >
          {row.isActive ? "Aktif" : "Nonaktif"}
        </span>
      ),
      sortable: true,
      sortField: "isActive",
      wrap: true,
      center: true,
    },
    {
      id: "isEmailVerified",
      name: "Email Verified",
      cell: (row) => (
        <span
          style={{
            color: row.isEmailVerified ? "#16a34a" : "#dc2626",
            fontWeight: "bold",
          }}
        >
          {row.isEmailVerified ? "Verified" : "Belum"}
        </span>
      ),
      sortable: true,
      sortField: "isEmailVerified",
      wrap: true,
      center: true,
    },
    {
      id: "createdAt",
      name: "Dibuat",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).getTime() : 0,
      cell: (row) => formatDateTime(row.createdAt),
      sortable: true,
      sortField: "createdAt",
      wrap: true,
      center: true,
    },
    {
      id: "aksi",
      name: "Aksi",
      cell: (row) => (
        <UsersActionMenu
          row={row}
          isOpen={openActionId === row.id}
          isDark={isDark}
          onToggle={handleToggleAction}
          onDetail={handleDetail}
          onToggleActive={(selectedRow) => setSelectedUser(selectedRow)}
          loading={toggleLoadingId === row.id}
        />
      ),
      width: "170px",
      sortable: false,
      center: true,
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
        minHeight: "64px",
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

  if (!DataTable) {
    return <div className="p-6 text-red-400">DataTable gagal dimuat.</div>;
  }

  return (
    <div
      className="p-6"
      style={{
        color: isDark ? "#ffffff" : "#111827",
      }}
    >
      <h1
        className="mb-4 text-2xl font-bold"
        style={{ color: isDark ? "#ffffff" : "#111827" }}
      >
        Users
      </h1>

      <div
        className="users-table w-full max-w-full overflow-hidden rounded-xl border"
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
            placeholder="Cari nama, email, username, atau role..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg px-3 py-2 text-sm outline-none md:max-w-xs"
            style={{
              border: `1px solid ${isDark ? "#374151" : "#d1d5db"}`,
              backgroundColor: isDark ? "#111827" : "#ffffff",
              color: isDark ? "#ffffff" : "#111827",
            }}
          />

          <div
            className="flex items-center gap-2 text-sm md:ml-auto"
            style={{ color: isDark ? "#d1d5db" : "#374151" }}
          >
            <button
              type="button"
              onClick={() => setShowTambahModal(true)}
              className="btn btn-outline btn-primary"
            >
              <FaPlus />
              Tambah
            </button>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="users-limit-select rounded-lg px-3 py-2 outline-none"
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
            <span>Baris per halaman</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="min-w-275">
            <DataTable
              columns={columns}
              data={users}
              progressPending={loading}
              pagination
              paginationServer
              sortServer
              paginationTotalRows={meta?.total || 0}
              paginationPerPage={limit}
              paginationDefaultPage={page}
              paginationComponentOptions={paginationComponentOptions}
              onChangePage={(newPage) => setPage(newPage)}
              onSort={(column, sortDirection) => {
                const nextSortBy = column.sortField || column.id;

                if (!nextSortBy || nextSortBy === "no") return;

                setSortBy(nextSortBy);
                setOrder(sortDirection === "asc" ? "asc" : "desc");
                setPage(1);
              }}
              highlightOnHover
              persistTableHead
              responsive
              defaultSortFieldId="createdAt"
              defaultSortAsc={false}
              customStyles={customStyles}
              noDataComponent={
                <div
                  className="py-6 text-sm"
                  style={{ color: isDark ? "#d1d5db" : "#6b7280" }}
                >
                  Belum ada user
                </div>
              }
            />
          </div>
        </div>
      </div>
      <TambahUsers
        isOpen={showTambahModal}
        onClose={() => setShowTambahModal(false)}
        isDark={isDark}
        refetch={fetchUsers}
      />
      <ConfirmToggleUserModal
        isOpen={!!selectedUser}
        user={selectedUser}
        loading={!!toggleLoadingId}
        onClose={() => {
          if (!toggleLoadingId) {
            setSelectedUser(null);
          }
        }}
        onConfirm={handleConfirmToggleActive}
      />
    </div>
  );
}
