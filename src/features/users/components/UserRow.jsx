import React from "react";

// Memo is useful here if the list grows and rows become heavier.
// It only helps if props are stable (id, name, isSelected, onSelect).
export const UserRow = React.memo(function UserRow({
  id,
  name,
  email,
  isSelected,
  onSelect,
}) {
  return (
    <li
      style={{
        padding: 8,
        borderRadius: 8,
        background: isSelected ? "rgba(0,0,0,0.06)" : "transparent",
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <button
        onClick={() => onSelect(id)}
        style={{
          textAlign: "left",
          flex: 1,
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 12, opacity: 0.75 }}>{email}</div>
      </button>

      {isSelected ? <span aria-label="selected">✅</span> : null}
    </li>
  );
});
