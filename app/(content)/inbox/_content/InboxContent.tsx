import { GroupDiscussion, InboxActive } from "@/public/img";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsSearch } from "react-icons/bs";

function InboxContent() {
  return (
    <div className="flex flex-col items-end">
      <div className="flex flex-col gap-2 w-[634px] h-[634px] bg-white mt-10 px-10 rounded-md">
        <label className="w-full h-[40px] my-8 rounded-md items-center px-4 border border-gray-400 text-black flex flex-row">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border-black"
          />
          <BsSearch />
        </label>
        <Link
          href={""}
          className="flex flex-row items-start gap-4 text-black justify-start"
        >
          <Image alt="" src={GroupDiscussion} width={50} height={50} />
          <div className="flex flex-col">
            <h3 className="text-base text-primary-1">109220-Naturalization</h3>
            <p className="text-sm font-medium">Camero :</p>
            <p className="text-primary-3 text-sm">Please check this out</p>
          </div>
          <div className="text-primary-3">January 1, 2021 19:10</div>
        </Link>
        <div className="w-full text-primary-3 border mt-4"></div>
      </div>
    </div>
  );
}

export default InboxContent;
