import React, { ReactNode } from "react";
import Navbar from "./_components/Navbar";
import QuickNav from "./_components/QuickNav";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
      <QuickNav />
    </div>
  );
}

export default Layout;
