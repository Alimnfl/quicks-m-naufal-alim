"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Navbar from "../(content)/_components/Navbar";
import QuickNav from "../(content)/_components/QuickNav";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

function Layout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useConvexAuth();
  const [delayPassed, setDelayPassed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setDelayPassed(true);
      }, 2200); // 2.2 seconds timer

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (delayPassed && !isAuthenticated) {
      redirect("/");
    }
  }, [delayPassed, isAuthenticated]);

  return (
    <div className="flex flex-col bg-black relative w-full h-full">
      <Navbar />
      {children}
      <QuickNav />
    </div>
  );
}

export default Layout;
