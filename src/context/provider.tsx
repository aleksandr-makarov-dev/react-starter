import React from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<p>Loading...</p>}>{children}</React.Suspense>
  );
}
