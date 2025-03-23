import React from "react";
// import GridShape from "../../components/common/GridShape";
// import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className=" block flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {/* <div className="items-center hidden w-full h-full lg:w-1/2  dark:bg-white/5 lg:grid"> */}
          {/* <div className=" flex items-center justify-center z-1"> */}
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            {/* <GridShape /> */}
          {/* </div> */}
        {/* </div> */}
        {children}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
