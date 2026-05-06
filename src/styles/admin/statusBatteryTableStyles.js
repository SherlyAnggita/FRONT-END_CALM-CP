export function getStatusBatteryTableStyles({ colors, isDark }) {
  return {
    table: {
      style: {
        backgroundColor: colors.tableBg,
      },
    },

    headRow: {
      style: {
        backgroundColor: colors.tableBg,
        color: colors.textPrimary,
        borderBottom: `1px solid ${colors.border}`,
        minHeight: "56px",
      },
    },

    headCells: {
      style: {
        backgroundColor: colors.tableBg,
        color: colors.textPrimary,
        fontWeight: 700,
        fontSize: "14px",
        paddingLeft: "20px",
        paddingRight: "20px",
      },
    },

    rows: {
      style: {
        backgroundColor: colors.tableBg,
        color: colors.textPrimary,
        borderBottom: `1px solid ${isDark ? "#172033" : "#eef2f7"}`,
        minHeight: "92px",
        fontSize: "14px",
      },

      highlightOnHoverStyle: {
        backgroundColor: colors.hover,
        color: colors.textPrimary,
        transition: "all 0.15s ease",
        cursor: "default",
      },
    },

    cells: {
      style: {
        paddingLeft: "20px",
        paddingRight: "20px",
        color: colors.textPrimary,
        fontSize: "14px",
      },
    },

    pagination: {
      style: {
        backgroundColor: colors.paginationBg,
        color: colors.textPrimary,
        borderTop: `1px solid ${colors.border}`,
        minHeight: "60px",
        paddingLeft: "12px",
        paddingRight: "12px",
      },

      pageButtonsStyle: {
        borderRadius: "8px",
        height: "34px",
        width: "34px",
        padding: "6px",
        margin: "0 2px",
        cursor: "pointer",
        color: colors.textPrimary,
        fill: colors.textPrimary,
        backgroundColor: "transparent",
      },
    },

    noData: {
      style: {
        backgroundColor: colors.tableBg,
        color: colors.textSecondary,
      },
    },
  };
}