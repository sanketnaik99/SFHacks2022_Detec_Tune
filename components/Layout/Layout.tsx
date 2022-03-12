import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout: React.FC = ({ children }) => {
  const [currentTheme, setTheme] = useState("dark");
  const [hasLoaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get stored theme.
    // Initially there is no theme in storage so storedTheme will be null.
    const storedTheme = localStorage.getItem("theme");

    // Check if theme has been stored and if it is the first load.
    // If the theme has been stored in local storage and hasLoaded is false -> Then make the theme from localstorage as the currentTheme.
    if (hasLoaded === false && storedTheme) {
      setLoaded(true);
      setTheme(storedTheme);
    }

    // If currentTheme is updated, update LocalStorage.
    if (currentTheme !== storedTheme && hasLoaded) {
      localStorage.setItem("theme", currentTheme);
    }

    // Set Loaded = true after first run
    setLoaded(true);
  }, [currentTheme]);

  return (
    <>
      <div
        className={[
          currentTheme === "dark" ? "dark" : "",
          "w-full flex flex-col",
        ].join(" ")}
      >
        <Navbar
          handleThemeToggle={() => {
            currentTheme === "dark" ? setTheme("light") : setTheme("dark");
          }}
          hasDarkModeEnabled={currentTheme === "dark"}
        />
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500 ease-out">
          {React.cloneElement(children as React.ReactElement, {
            currentTheme: currentTheme,
          })}
        </div>
        <Footer hasDarkModeEnabled={currentTheme === "dark"} />
      </div>
    </>
  );
};

export default Layout;
