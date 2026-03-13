import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppConfig } from "../../app/providers.jsx";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValues.js";
import { Modal } from "../../shared/components/Modal.jsx";
import { fetchUsers } from "./api/fetchUsers.js";
import { UserRow } from "./components/UserRow.jsx";
import { UserDetails } from "./components/UserDetails.jsx";

export function UsersPage() {
  const { apiBaseUrl } = useAppConfig();

  // --- Server state (fetched data + request status)
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  // --- UI state (local, client-only)
  const [rawQuery, setRawQuery] = useState("");
  const query = useDebouncedValue(rawQuery, 250);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent “set state after unmount” with abort; also avoids race conditions.
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setStatus("loading");
        setError(null);

        const data = await fetchUsers({ apiBaseUrl, signal: controller.signal });
        setUsers(data);
        setStatus("success");
      } catch (e) {
        if (e?.name === "AbortError") return;
        setError(e);
        setStatus("error");
      }
    })();

    return () => controller.abort();
  }, [apiBaseUrl]);

  // Derived state: DON'T store filtered list in state.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  const selectedUser = useMemo(() => {
    return users.find((u) => u.id === selectedUserId) ?? null;
  }, [users, selectedUserId]);

  // Stable callback helps UserRow memoization.
  const onSelect = useCallback((id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  }, []);

  // Example of functional update (pattern interviewers like)
  const removeSelectedUser = useCallback(() => {
    if (!selectedUserId) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
    setSelectedUserId(null);
    setIsModalOpen(false);
  }, [selectedUserId]);

  // Debugging render frequency quickly
  const renders = useRef(0);
  renders.current += 1;

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <input
          value={rawQuery}
          onChange={(e) => setRawQuery(e.target.value)}
          placeholder="Search by name or email…"
          style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", flex: 1 }}
        />
        <button onClick={() => setRawQuery("")}>Clear</button>
      </div>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        Status: <strong>{status}</strong> • Users:{" "}
        <strong>{filtered.length}</strong> • Renders:{" "}
        <strong>{renders.current}</strong>
      </div>

      {status === "loading" && <div>Loading users…</div>}

      {status === "error" && (
        <div style={{ padding: 12, border: "1px solid #f99", borderRadius: 8 }}>
          <div style={{ fontWeight: 700 }}>Error</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            {String(error?.message ?? error)}
          </div>
          <button
            style={{ marginTop: 8 }}
            onClick={() => window.location.reload()}
          >
            Retry (demo)
          </button>
        </div>
      )}

      {status === "success" && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
          {filtered.map((u) => (
            <UserRow
              key={u.id} // stable key (NOT index)
              id={u.id}
              name={u.name}
              email={u.email}
              isSelected={u.id === selectedUserId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}

      <Modal
        title={selectedUser ? `User: ${selectedUser.name}` : "User"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {!selectedUser ? (
          <div>No user selected.</div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            <UserDetails user={selectedUser} />

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setIsModalOpen(false)}>Done</button>
              <button onClick={removeSelectedUser}>Remove user (demo)</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}