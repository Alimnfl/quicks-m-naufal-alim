import React from "react";
import { BiSearch } from "react-icons/bi";

function Navbar() {
  return (
    <div className="bg-primary-2">
      <div className="flex flex-row w-full h-full py-4 items-center mx-auto max-w-2xl justify-between">
        <BiSearch />
      </div>
    </div>
  );
}

export default Navbar;
