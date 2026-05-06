import { useEffect, useMemo, useState, useCallback } from "react";
import * as RDT from "react-data-table-component";
import { useStatusBattery } from "../../../hooks/admin/StatusBattery";
import { getStatusBatteryColumns } from "../../../constants/admin/statusBatteryColumns";
import { getStatusBatteryTableStyles } from "../../../styles/admin/statusBatteryTableStyles";
import { toggleStatusBatteryActive } from "../../../services/Admin/statusBattery";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TambahStatusBattery from "./tambah";
import UpdateStatusBattery from "./update";
import DeleteStatusBattery from "./delete";

const DataTable = RDT.default?.default ?? RDT.default ?? RDT.DataTable;

export default function StatusBatteryPage() {
  const {
    statusBatteries,
    loading,
    error,
    page,
    limit,
    pagination,
    searchInput,
    setSearchInput,
    setPage,
    setLimit,
    refetch,
  } = useStatusBattery();

  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedStatusBattery, setSelectedStatusBattery] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getIsDarkMode = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDark, setIsDark] = useState(getIsDarkMode());

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDark(e.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const colors = useMemo(
    () => ({
      pageBg: isDark ? "#111827" : "#EEF2FF",
      cardBg: isDark ? "#0f172a" : "#ffffff",
      toolbarBg: isDark ? "#111827" : "#ffffff",
      tableBg: isDark ? "#0f172a" : "#ffffff",
      textPrimary: isDark ? "#f8fafc" : "#2b2b2b",
      textSecondary: isDark ? "#94a3b8" : "#64748b",
      border: isDark ? "#334155" : "#d9d9d9",
      inputBg: isDark ? "#0b1220" : "#ffffff",
      hover: isDark ? "#172033" : "#f8fafc",
      paginationBg: isDark ? "#0f172a" : "#ffffff",
    }),
    [isDark],
  );

  const handleToggleActionMenu = useCallback((rowId) => {
    setOpenActionRowId((prev) => (prev === rowId ? null : rowId));
  }, []);

  const handleAdd = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleDetail = useCallback(
    (row) => {
      setOpenActionRowId(null);
      navigate(`/admin/status-battery/${row.id}`);
    },
    [navigate],
  );

  const handleEdit = useCallback((row) => {
    setSelectedStatusBattery(row);
    setIsUpdateModalOpen(true);
    setOpenActionRowId(null);
  }, []);

  const handleCloseUpdateModal = useCallback(() => {
    setIsUpdateModalOpen(false);
    setSelectedStatusBattery(null);
  }, []);

  const handleDelete = useCallback((row) => {
    setSelectedStatusBattery(row);
    setIsDeleteModalOpen(true);
    setOpenActionRowId(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedStatusBattery(null);
  }, []);

  const handleToggleActive = useCallback(
    async (row) => {
      try {
        const response = await toggleStatusBatteryActive(row.id);

        toast.success(
          response?.message ||
            `Status battery berhasil ${
              row.isActive ? "dinonaktifkan" : "diaktifkan"
            }`,
        );

        setOpenActionRowId(null);
        await refetch();
      } catch (err) {
        toast.error(err?.message || "Gagal mengubah status battery");
      }
    },
    [refetch],
  );

  const columns = useMemo(
    () =>
      getStatusBatteryColumns({
        page,
        limit,
        isDark,
        openActionRowId,
        onToggleActionMenu: handleToggleActionMenu,
        onDetail: handleDetail,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleActive: handleToggleActive,
      }),
    [
      page,
      limit,
      isDark,
      openActionRowId,
      handleToggleActionMenu,
      handleDetail,
      handleEdit,
      handleDelete,
      handleToggleActive,
    ],
  );

  const customStyles = useMemo(
    () => getStatusBatteryTableStyles({ colors, isDark }),
    [colors, isDark],
  );

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: colors.pageBg,
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: "18px" }}>
        <h2
          style={{
            margin: 0,
            color: colors.textPrimary,
            fontSize: "32px",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Status Battery
        </h2>
      </div>

      {error ? (
        <div
          style={{
            marginBottom: "16px",
            padding: "12px 16px",
            borderRadius: "12px",
            backgroundColor: isDark ? "#3b1212" : "#fee2e2",
            color: isDark ? "#fecaca" : "#991b1b",
            border: `1px solid ${isDark ? "#7f1d1d" : "#fecaca"}`,
          }}
        >
          {error}
        </div>
      ) : null}

      <div
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "12px",
          overflow: "hidden",
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            padding: "16px 20px",
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: colors.toolbarBg,
          }}
        >
          <input
            type="text"
            placeholder="Cari nama atau deskripsi....."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "320px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.inputBg,
              color: colors.textPrimary,
              outline: "none",
              fontSize: "14px",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: colors.textPrimary, fontSize: "14px" }}>
              baris pertama halaman
            </span>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: "10px 12px",
                borderRadius: "8px",
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.inputBg,
                color: colors.textPrimary,
                fontSize: "14px",
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <button
              type="button"
              onClick={handleAdd}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              + Tambah
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={statusBatteries}
          progressPending={loading}
          pagination
          paginationServer
          paginationTotalRows={pagination?.total || 0}
          paginationPerPage={limit}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          paginationComponentOptions={{
            noRowsPerPage: true,
            rangeSeparatorText: "dari",
          }}
          onChangePage={(newPage) => setPage(newPage)}
          onChangeRowsPerPage={(newLimit, newPage) => {
            setLimit(newLimit);
            setPage(newPage);
          }}
          highlightOnHover
          responsive
          customStyles={customStyles}
          persistTableHead
          noDataComponent={
            <div
              style={{
                padding: "28px",
                color: colors.textSecondary,
                backgroundColor: colors.tableBg,
              }}
            >
              Data status battery tidak ada
            </div>
          }
        />
      </div>

      <TambahStatusBattery
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        isDark={isDark}
        colors={colors}
        refetch={refetch}
      />

      <UpdateStatusBattery
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        isDark={isDark}
        colors={colors}
        refetch={refetch}
        initialData={selectedStatusBattery}
      />

      <DeleteStatusBattery
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        selectedStatusBattery={selectedStatusBattery}
        refetch={refetch}
      />
    </div>
  );
}