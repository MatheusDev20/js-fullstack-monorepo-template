'use client';
import { clsx } from 'clsx';
import { GithubIcon } from './svg/github';

type HeaderProps = {
  theme: 'cupkake' | 'dark' | string,
  toogleTheme: () => void,
  homeLink: React.ReactNode,
  navigation: React.ReactNode,
  toggleNav: () => void,
  isToggled: boolean,
};

export const Header = ({
  theme,
  homeLink,
  navigation,
  toggleNav,
  isToggled,
}: HeaderProps) => {
  return (
    <header
      className="flex flex-wrap p-4 md:flex py-3 px-3 pl-6 pr-4 border border-b-[1px] border-l-0 border-r-0 border-t-0 items-center w-full min-h-[50px] justify-between"
      // { flex: !isToggled, 'flex-col': isToggled },

      // className="flex py-3 px-3 pl-6 pr-4 md:p border border-b-[1px] border-l-0 border-r-0 border-t-0 items-center w-full min-h-[50px] justify-between"
    >
      <div>{homeLink}</div>
      <div>{navigation}</div>
      <aside className="flex items-center gap-5 md:gap-3">
        <GithubIcon theme={theme} />
        {/* <ThemeSwitch currentTheme={theme} toggle={toogleTheme} /> */}
        <div className="flex md:hidden">
          <button
            onClick={toggleNav}
            type="button"
            className="cursor-pointer navbar-burger flex items-center text-blue-600 p-3"
          >
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
      </aside>
    </header>
  );
};
