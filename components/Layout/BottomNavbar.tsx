import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface Props {
  hasDarkModeEnabled: boolean;
}

const BottomNavbar: React.FC<Props> = ({ hasDarkModeEnabled }) => {
  const router = useRouter();
  const currentRoute = router.asPath;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 h-14 shadow-lg bg-white dark:bg-gray-800 visible md:hidden flex flex-row justify-evenly"
      style={{
        boxShadow: "2px 1px 5px 2px rgba(0,0,0,0.19)",
        WebkitBoxShadow: "2px 1px 5px 2px rgba(0,0,0,0.19)",
        MozBoxShadow: "2px 1px 5px 2px rgba(0,0,0,0.19)",
      }}
    >
      <Link href="/">
        <div
          className={[
            "bottom-nav-button",
            currentRoute == "/"
              ? "text-blue-500 dark:text-white"
              : "text-gray-700 dark:text-gray-400",
          ].join(" ")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-7"
            aria-label="Home"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <h2 className="text-sm font-heading my-0 py-0 font-medium">Home</h2>
        </div>
      </Link>
      <Link href="/upload">
        <div
          className={[
            "bottom-nav-button",
            currentRoute == "/upload"
              ? "text-blue-500 dark:text-white"
              : "text-gray-700 dark:text-gray-400",
          ].join(" ")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-label="Home"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <h2 className="text-sm font-heading my-0 py-0 font-medium">Upload</h2>
        </div>
      </Link>
    </div>
  );
};

export default BottomNavbar;
