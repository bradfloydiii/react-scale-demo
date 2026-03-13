import React, { createContext, useMemo, useContext } from "react";

const AppConfigContext = createContext();

export function AppProviders({ children }) {
  // imagine this coming from an env/config later

  const config = useMemo(
    () => ({
      apiBaseUrl: "https://jsonplaceholder.typicode.com",
      appName: "React Scale Demo",
    }),
    [],
  );

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
}

export function useAppConfig() {
  const context = useContext(AppConfigContext);
  if (!context)
    throw new Error("useAppConfig must be used within AppProviders");
  return context;
}
