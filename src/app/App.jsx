import React, { Profiler } from "react";
import { UsersPage } from "../features/users/UsersPage.jsx";
import { useAppConfig } from "./providers.jsx";

function onRenderProfiler(id, phase, actualDuration) {
  // Helpful for “before/after” perf checks.
  // In real apps, you might send this to monitoring in production sampling.
  console.log(`[Profiler:${id}] ${phase} took ${actualDuration.toFixed(1)}ms`);
}

export default function App() {
  const { appName } = useAppConfig();

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginTop: 0 }}>{appName}</h1>

      <Profiler id="UsersPage" onRender={onRenderProfiler}>
        <UsersPage />
      </Profiler>
    </div>
  );
}
