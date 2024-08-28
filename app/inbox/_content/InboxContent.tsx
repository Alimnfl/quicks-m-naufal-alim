"use client";

import { GroupDiscussion, InboxActive } from "@/public/img";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { motion } from "framer-motion";
import { containerVariant } from "@/app/(content)/_data/VariantMotion";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { useUser } from "@clerk/clerk-react";
import { Spinner } from "@/app/task/_component/spinner";
import { useConvexAuth } from "convex/react";

function InboxContent() {
  const [dataInbox, setDataInbox] = useState<InboxDataProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useConvexAuth();

  // Read items from database
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "inbox-data"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr: InboxDataProps[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Partial<InboxDataProps>;
        itemsArr.push({ ...(data as InboxDataProps), id: doc.id });
      });

      itemsArr.sort((a, b) => {
        const dateA = new Date(`${a.date} ${b.clock}`).getTime();
        const dateB = new Date(`${b.date} ${b.clock}`).getTime();
        return dateB - dateA;
      });

      setDataInbox(itemsArr);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter to only include unique group names
  const uniqueDataInbox = dataInbox.reduce((acc, curr) => {
    const x = acc.find((item) => item.groupName === curr.groupName);
    if (!x) {
      acc.push(curr);
    }
    return acc;
  }, [] as InboxDataProps[]);

  return (
    <div className="flex flex-col items-end">
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2 w-[634px] h-[634px] bg-white mt-10 px-10 rounded-md"
      >
        {isAuthenticated && (
          <label className="w-full h-[40px] my-8 rounded-md items-center px-4 border border-gray-400 text-black flex flex-row">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border-black"
            />
            <BsSearch />
          </label>
        )}
        {isLoading && (
          <div className="text-center justify-center text-primary-3 pb-10 w-full h-full flex flex-col items-center gap-8">
            <Spinner size={"icon"} />
            Loading Inbox List
          </div>
        )}
        {isAuthenticated &&
          uniqueDataInbox
            .filter(
              (d) =>
                d.message !== "" && d.message !== null && d.groupName !== null
            )
            .map((d) => (
              <Link
                href={`/inbox/${d.groupName}`}
                key={d.id}
                className="flex flex-row items-start gap-4 text-black justify-start"
              >
                <Image alt="" src={GroupDiscussion} width={50} height={50} />
                <div className="flex flex-col">
                  <h2 className="font-bold text-primary-1">{d.groupName}</h2>
                  <p className="text-sm font-medium">{d.userName} :</p>
                  <p className="text-primary-3 text-sm">{d.message}</p>
                </div>
                <div className="text-primary-3">{d.date}</div>
              </Link>
            ))}
      </motion.div>
    </div>
  );
}

export default InboxContent;
