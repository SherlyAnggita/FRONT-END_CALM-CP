import MoodLabelActionMenu from "../../components/Admin/MoodLabel/MoodLabelActionMenu";

export function getMoodLabelColumns({
  page,
  limit,
  isDark,
  openActionRowId,
  onToggleActionMenu,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  return [
    {
      id: "no",
      name: "No",
      width: "70px",
      cell: (row, index) => <span>{(page - 1) * limit + index + 1}</span>,
      sortable: false,
    },
    {
      id: "name",
      name: "Name",
      selector: (row) => row.name || "-",
      sortable: true,
      wrap: true,
    },
    {
      id: "description",
      name: "Description",
      selector: (row) => row.description || "-",
      sortable: false,
      wrap: true,
    },
    {
      id: "score",
      name: "Score",
      cell: (row) => <span>{row.score ?? "-"}</span>,
      width: "90px",
      sortable: false,
      wrap: true,
    },
    {
      id: "emoji",
      name: "Emoji",
      cell: (row) => <span>{row.emoji || "-"}</span>,
      width: "90px",
      sortable: false,
      wrap: true,
    },
    {
      id: "paperColor",
      name: "Paper Color",
      cell: (row) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span>{row.paperColor || "-"}</span>
          {row.paperColor ? (
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "999px",
                backgroundColor: row.paperColor,
                border: `1px solid ${isDark ? "#475569" : "#cbd5e1"}`,
                display: "inline-block",
              }}
            />
          ) : null}
        </div>
      ),
      sortable: false,
      wrap: true,
    },
    {
      id: "status",
      name: "Status",
      cell: (row) => (
        <span
          style={{
            padding: "7px 12px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 700,
            backgroundColor: row.isActive
              ? isDark
                ? "#16352a"
                : "#dcfce7"
              : isDark
                ? "#3b1620"
                : "#fee2e2",
            color: row.isActive
              ? isDark
                ? "#86efac"
                : "#166534"
              : isDark
                ? "#fca5a5"
                : "#991b1b",
            display: "inline-block",
          }}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
      width: "130px",
      sortable: false,
      wrap: true,
    },
    {
      id: "createdAt",
      name: "Created At",
      selector: (row) =>
        row.createdAt ? new Date(row.createdAt).getTime() : 0,
      cell: (row) => (
        <span>
          {row.createdAt
            ? new Date(row.createdAt).toLocaleString("id-ID")
            : "-"}
        </span>
      ),
      sortable: true,
      sortField: "createdAt",
      wrap: true,
    },
    {
      id: "aksi",
      name: "Aksi",
      width: "190px",
      cell: (row) => (
        <MoodLabelActionMenu
          row={row}
          isOpen={openActionRowId === row.id}
          isDark={isDark}
          onToggle={onToggleActionMenu}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ),
      sortable: false,
      wrap: true,
    },
  ];
}
