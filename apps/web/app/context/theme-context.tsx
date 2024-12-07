'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  getLocalStorageByKey,
  setLocalStorageByKey,
} from '../utils/local-storage';

type Props = {
  children: React.ReactNode,
};

type ContextProps = {
  theme: string,
  changeTheme: () => void,
};

const ThemeContext = createContext<ContextProps | null>(null);

const { Provider } = ThemeContext;

const ThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState<string>('cupcake');

  useEffect(() => {
    const savedTheme = getLocalStorageByKey({ key: 'theme', parse: false });
    setTheme(savedTheme);
  }, [theme]);

  const changeTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'cupcake' ? 'dark' : 'cupcake'));
    setLocalStorageByKey({
      key: 'theme',
      value: theme === 'cupcake' ? 'dark' : 'cupcake',
      stringify: false,
    });
  };

  return <Provider value={{ theme, changeTheme }}>{children}</Provider>;
};

const useTheme = (): ContextProps => {
  const context = useContext(ThemeContext);

  if (context === null)
    throw new Error('useTheme must be used within a Provider');

  return context;
};

export { ThemeProvider, useTheme };
