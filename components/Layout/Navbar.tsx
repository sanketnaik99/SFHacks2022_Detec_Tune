import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import DarkLogo from "../../public/images/dtec-logo-dark.png";
import LightLogo from "../../public/images/dtec-logo-light.png";

interface Props {
  handleThemeToggle: () => void;
  hasDarkModeEnabled: boolean;
}

const Navbar: React.FC<Props> = ({ hasDarkModeEnabled, handleThemeToggle }) => {
  const router = useRouter();
  const currentRoute = router.asPath;

  return (
    <nav className="py-2 px-4 sm:px-2 md:px-3 lg:px-8 w-full bg-white dark:bg-gray-800 transition-colors duration-500 ease-out border-b border-gray-200 dark:border-gray-800 h-16 z-50">
      <div className="flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center">
            {hasDarkModeEnabled ? (
              <Image src={DarkLogo} alt="Dark Logo" width={160} height={40} />
            ) : (
              <Image src={LightLogo} alt="Dark Logo" width={160} height={40} />
            )}
          </a>
        </Link>
        <div className="flex flex-row">
          <Link href="/">
            <button
              className={[
                "desktop-nav-button",
                currentRoute === "/"
                  ? "desktop-nav-button-active"
                  : "desktop-nav-button-inactive",
              ].join(" ")}
            >
              Home
            </button>
          </Link>
          <Link href="/upload">
            <button
              className={[
                "desktop-nav-button mr-2",
                currentRoute === "/"
                  ? "desktop-nav-button-active"
                  : "desktop-nav-button-inactive",
              ].join(" ")}
            >
              Upload
            </button>
          </Link>
          <div
            className="p-2 bg-gray-200 dark:bg-gray-600 transition-colors duration-500 ease-out rounded-full cursor-pointer text-center text-gray-800 dark:text-white font-bold"
            onClick={handleThemeToggle}
          >
            <span>
              {hasDarkModeEnabled ? (
                // SUN ICON
                <svg
                  className="w-7 transition-all ease-out duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Switch to Light Mode"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                // MOON ICON
                <svg
                  className="w-7 transition-all ease-out duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-label="Switch to Dark Mode"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
