'use client';
import { useTheme } from '../context/theme-context';

export default function ClientThemeWrapper({ children }: any) {
  const { theme } = useTheme();
  return <div data-theme={theme}>{children}</div>;
}
