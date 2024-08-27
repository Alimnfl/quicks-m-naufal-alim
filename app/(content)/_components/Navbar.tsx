"use client";

import React from "react";
import { BiSearch } from "react-icons/bi";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/app/task/_component/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/clerk-react";

function Navbar() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="bg-primary-2 relative text-white w-full h-full">
      <div className="flex flex-row w-full h-full py-4 items-center mx-auto max-w-2xl justify-between">
        <BiSearch />
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </SignInButton>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <UserButton afterSwitchSessionUrl="/" />
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
