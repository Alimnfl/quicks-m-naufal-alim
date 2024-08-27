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

function InboxContent() {
  const [dataInbox, setDataInbox] = useState<InboxDataProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setDataInbox(itemsArr);
      setIsLoading(false);
    });
  }, []);

  //Deleted Item by id.
  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "task-data", id));
  };

  return (
    <div className="flex flex-col items-end">
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2 w-[634px] h-[634px] bg-white mt-10 px-10 rounded-md"
      >
        <label className="w-full h-[40px] my-8 rounded-md items-center px-4 border border-gray-400 text-black flex flex-row">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border-black"
          />
          <BsSearch />
        </label>
        <Link
          href={`/inbox/qweqw`}
          className="flex flex-row items-start gap-4 text-black justify-start"
        >
          <Image alt="" src={GroupDiscussion} width={50} height={50} />
          <div className="flex flex-col">
            <h2 className="font-bold text-primary-1">109220-Naturalization</h2>
            <p className="text-sm font-medium">Camero :</p>
            <p className="text-primary-3 text-sm">Please check this out</p>
          </div>
          <div className="text-primary-3">January 1, 2021 19:10</div>
        </Link>
        <div className="w-full text-primary-3 border my-4"></div>
        {dataInbox.map((d) => (
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
