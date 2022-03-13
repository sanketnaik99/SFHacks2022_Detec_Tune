import React from "react";

interface Props {
  hasDarkModeEnabled: boolean;
}

const Footer: React.FC<Props> = ({ hasDarkModeEnabled }) => {
  return (
    <footer className="text-gray-600 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 body-font transition-all duration-500 ease-out pb-10">
      <div className="container px-5 pt-4 pb-4 mx-auto flex items-center justify-end sm:flex-row flex-col">
        <div className="container mx-auto pt-4 pb-8 sm:pb-2 flex flex-col items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center pb-3">
            © Triggered Devs
          </p>
          <div className="w-56 h-0.5 bg-gray-400 dark:bg-gray-600"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center pt-3">
            SF Hacks 2022
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
