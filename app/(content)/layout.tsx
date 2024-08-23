import React, { ReactNode } from "react";
import Navbar from "./_components/Navbar";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
