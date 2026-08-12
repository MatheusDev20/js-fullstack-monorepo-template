'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/theme-context';
import ClientThemeWrapper from './providers/client-theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <ThemeProvider>
      <QueryClientProvider client={client}>
        <ClientThemeWrapper>{children}</ClientThemeWrapper>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
