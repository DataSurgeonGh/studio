"use client";

import type { ReactNode } from 'react';

// This can be expanded with other client-side providers like React Query, ThemeProvider, etc.
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
