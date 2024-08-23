import React, { ReactNode } from "react";
import Navbar from "./_components/Navbar";
import QuickContent from "./_content/QuickContent";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col w-full h-full">
      <Navbar />
      {children}
      <QuickContent />
    </div>
  );
}

export default Layout;
