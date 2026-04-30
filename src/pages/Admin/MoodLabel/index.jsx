import { useEffect, useMemo, useState, useCallback } from "react";
import * as RDT from "react-data-table-component";
import { useMoodLabels } from "../../../hooks/admin/MoodLabels";
import { getMoodLabelColumns } from "../../../constants/admin/moodLabelColumns";
import { getMoodLabelTableStyles } from "../../../styles/admin/moodLabelTableStyles";
import {
  toggleMoodLabelActive,
} from "../../../services/Admin/moodLabel";
import toast from "react-hot-toast";
import TambahMoodLabel from "./tambah";
import UpdateMoodLabel from "./Update";
import DeleteMoodLabel from "./delete";

const DataTable = RDT.default?.default ?? RDT.default ?? RDT.DataTable;

export default function MoodLabelPage() {
  const {
    moodLabels,
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
  } = useMoodLabels();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openActionRowId, setOpenActionRowId] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedMoodLabel, setSelectedMoodLabel] = useState(null);

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
      pageBg: isDark ? "#111827" : "#f8fafc",
      cardBg: isDark ? "#0f172a" : "#ffffff",
      toolbarBg: isDark ? "#111827" : "#ffffff",
      tableBg: isDark ? "#0f172a" : "#ffffff",
      textPrimary: isDark ? "#f8fafc" : "#0f172a",
      textSecondary: isDark ? "#94a3b8" : "#64748b",
      border: isDark ? "#334155" : "#e2e8f0",
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

  const handleEdit = useCallback((row) => {
    setSelectedMoodLabel(row);
    setIsUpdateModalOpen(true);
    setOpenActionRowId(null);
  }, []);
  const handleCloseUpdateModal = useCallback(() => {
    setIsUpdateModalOpen(false);
    setSelectedMoodLabel(null);
  }, []);

  const handleDelete = useCallback((row) => {
    setSelectedMoodLabel(row);
    setIsDeleteModalOpen(true);
    setOpenActionRowId(null);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedMoodLabel(null);
  }, []);

  const handleToggleActive = useCallback(
    async (row) => {
      try {
        const response = await toggleMoodLabelActive(row.id);

        toast.success(
          response?.message ||
            `Mood label berhasil ${row.isActive ? "dinonaktifkan" : "diaktifkan"}`,
        );

        setOpenActionRowId(null);
        await refetch();
      } catch (err) {
        toast.error(err?.message || "Gagal mengubah status mood label");
      }
    },
    [refetch],
  );

  const columns = useMemo(
    () =>
      getMoodLabelColumns({
        page,
        limit,
        isDark,
        openActionRowId,
        onToggleActionMenu: handleToggleActionMenu,
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
      handleEdit,
      handleDelete,
      handleToggleActive,
    ],
  );

  const customStyles = useMemo(
    () => getMoodLabelTableStyles({ colors, isDark }),
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
          Mood Labels
        </h2>
        <p
          style={{
            margin: "8px 0 0",
            color: colors.textSecondary,
            fontSize: "16px",
          }}
        >
          Kelola daftar mood labels
        </p>
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
          borderRadius: "18px",
          overflow: "hidden",
          border: `1px solid ${colors.border}`,
          boxShadow: isDark
            ? "0 10px 30px rgba(0,0,0,0.25)"
            : "0 8px 24px rgba(15,23,42,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            padding: "18px 20px",
            borderBottom: `1px solid ${colors.border}`,
            backgroundColor: colors.toolbarBg,
          }}
        >
          <div style={{ flex: "1 1 280px" }}>
            <input
              type="text"
              placeholder="Cari nama / deskripsi..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "360px",
                padding: "12px 14px",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.inputBg,
                color: colors.textPrimary,
                outline: "none",
                fontSize: "14px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.inputBg,
                color: colors.textPrimary,
                fontSize: "14px",
                minWidth: "88px",
                outline: "none",
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
                padding: "12px 18px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(37,99,235,0.28)",
              }}
            >
              + Tambah
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={moodLabels}
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
              Data mood label tidak ada
            </div>
          }
        />
      </div>

      <TambahMoodLabel
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        isDark={isDark}
        colors={colors}
        refetch={refetch}
      />
      <UpdateMoodLabel
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        isDark={isDark}
        colors={colors}
        refetch={refetch}
        initialData={selectedMoodLabel}
      />
      <DeleteMoodLabel
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        selectedMoodLabel={selectedMoodLabel}
        refetch={refetch}
      />
    </div>
  );
}
