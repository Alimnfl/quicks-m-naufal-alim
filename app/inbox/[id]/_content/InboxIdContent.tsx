"use client";

import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";
import { useUser } from "@clerk/clerk-react";
import { containerVariant } from "@/app/(content)/_data/VariantMotion";
import { db } from "@/app/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

function InboxIdContent() {
  const [dataInbox, setDataInbox] = useState<InboxDataProps[]>([]);
  const [message, setMessage] = useState<string>("");

  const { id } = useParams();
  const groupName = typeof id === "string" ? id : id[0];
  const { user } = useUser();

  const userId = user ? user.id : "";
  const userName = user ? user.firstName : "";

  // Read data inbox
  useEffect(() => {
    const q = query(
      collection(db, "inbox-data"),
      where("groupName", "==", decodeURIComponent(groupName))
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const inboxData: InboxDataProps[] = [];
      QuerySnapshot.forEach((doc) => {
        inboxData.push(doc.data() as InboxDataProps);
      });
      setDataInbox(inboxData);
    });
    return () => unsubscribe();
  }, [id]);

  // Add message data inbox
  const addItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim() === "") return;
    try {
      const newMessage: InboxDataProps = {
        id: uuidv4(),
        clock: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        groupName: decodeURIComponent(groupName),
        message: message,
        userId: userId,
        userName: userName,
      };

      await addDoc(collection(db, "inbox-data"), newMessage);
      setMessage("");
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  console.log(dataInbox);

  return (
    <div className="flex flex-col items-end">
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2 w-[634px] h-[634px] text-black bg-white mt-10 rounded-md"
      >
        <div className="flex flex-row justify-between pt-6 items-center px-4">
          <div className="flex flex-row gap-6 items-center">
            <Link href={"/inbox"}>
              <AiOutlineArrowLeft size={24} />
            </Link>
            <div className="">
              <h2 className="font-bold text-primary-1">
                {dataInbox.map((d) => d.groupName)}
              </h2>
              <p className="text-primary-3">3 Participant</p>
            </div>
          </div>
          <Link href={"/"} className="">
            <BsX size={36} className="font-bold" />
          </Link>
        </div>
        <div className="border border-primary-4 w-full my-2"></div>

        <ConversationalContent dataInbox={dataInbox} userId={userId} />

        <form
          onSubmit={addItem}
          className="flex flex-row gap-2 w-full h-fit py-4 px-4"
        >
          <label className="w-full">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              className="border w-full py-2 px-2 rounded-md"
              placeholder="Type to text"
            />
          </label>
          <button
            type="button"
            className="py-2 px-2 w-[100px] h-[40px] bg-primary-1 rounded-md font-semibold text-white"
          >
            Send
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function ConversationalContent({
  dataInbox,
  userId,
}: {
  userId: string;
  dataInbox: InboxDataProps[];
}) {
  return (
    <div className="flex flex-col w-full overflow-auto h-full px-5 gap-4">
      {dataInbox.map((d) => d.userId === userId) &&
        dataInbox.map((d) => (
          <div key={d.userName} className="flex flex-col gap-1 items-end">
            <h3 className="text-chat-2">You</h3>
            <div className="flex flex-row gap-3">
              <SlOptions size={12} />
              <div className="flex flex-col bg-chat-2.1 text-primary-2 p-2 max-w-[540px] rounded-md">
                <p>{d.message}</p>
                <p>{d.clock}</p>
              </div>
            </div>
          </div>
        ))}

      <div className="items-center justify-center flex flex-row w-full">
        <div className="border border-primary-3 h-fit w-full"></div>
        <div className="flex w-full items-center justify-center h-fit">
          <p>Today June 09, 2021</p>
        </div>
        <div className="border border-primary-3 h-fit w-full"></div>
      </div>

      <div className="flex flex-col gap-1 items-start">
        <h3 className="text-chat-1">Daddy</h3>
        <div className="flex flex-row gap-3">
          <div className="flex flex-col bg-chat-1.1 text-primary-2 p-2 max-w-[540px] rounded-md">
            <p>
              Hello Obaidullah, I will be your case advisor for case #029290. I
              have assigned some homework for you to fill. Please keep up with
              the due dates. Should you have any questions, you can message me
              anytime. Thanks.
            </p>
            <p>19.12</p>
          </div>
          <SlOptions size={12} />
        </div>
      </div>
    </div>
  );
}

export default InboxIdContent;
