import React, { ReactNode } from "react";
import Navbar from "../(content)/_components/Navbar";
import QuickNav from "../(content)/_components/QuickNav";

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
