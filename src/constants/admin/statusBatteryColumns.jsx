import StatusBatteryActionMenu from "../../components/Admin/StatusBattery/StatusBatteryActionMenu";

export function getStatusBatteryColumns({
  page,
  limit,
  isDark,
  openActionRowId,
  onToggleActionMenu,
  onDetail,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  return [
    {
      name: "No",
      width: "80px",
      cell: (_, index) => (page - 1) * limit + index + 1,
    },

    {
      name: "Name",
      selector: (row) => row.name || "-",
      sortable: true,
      grow: 1.2,
    },

    {
      name: "Description",
      selector: (row) => row.description || "-",
      grow: 2,
      wrap: true,
    },

    {
      name: "Min Score",
      selector: (row) => `${row.minScore || 0}%`,
      center: true,
      width: "120px",
    },

    {
      name: "Max Score",
      selector: (row) => `${row.maxScore || 0}%`,
      center: true,
      width: "120px",
    },

    {
      name: "Color",
      width: "140px",
      cell: (row) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              backgroundColor: row.color || "#000000",
              border: `1px solid ${isDark ? "#334155" : "#d1d5db"}`,
            }}
          />

          <span>{row.color || "-"}</span>
        </div>
      ),
    },

    {
      name: "Status",
      width: "130px",
      center: true,
      cell: (row) => (
        <div
          style={{
            padding: "6px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 700,
            backgroundColor: row.isActive ? "#dcfce7" : "#fee2e2",
            color: row.isActive ? "#166534" : "#991b1b",
          }}
        >
          {row.isActive ? "Active" : "Inactive"}
        </div>
      ),
    },

    {
      name: "Created At",
      selector: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleString("id-ID")
          : "-",
      sortable: true,
      width: "190px",
    },

    {
      name: "Aksi",
      width: "170px",
      center: true,
      cell: (row) => (
        <StatusBatteryActionMenu
          row={row}
          isOpen={openActionRowId === row.id}
          isDark={isDark}
          onToggle={onToggleActionMenu}
          onDetail={onDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ),
    },
  ];
}