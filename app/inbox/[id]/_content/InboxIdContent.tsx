"use client";

import Link from "next/link";
import React, { FormEvent, useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { redirect, useParams } from "next/navigation";
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
import { useConvexAuth } from "convex/react";
import { Inbox } from "lucide-react";

function InboxIdContent() {
  const [dataInbox, setDataInbox] = useState<InboxDataProps[]>([]);
  const [message, setMessage] = useState<string>("");
  const { isAuthenticated } = useConvexAuth();

  const { id } = useParams();
  const groupName = typeof id === "string" ? id : id[0];
  const decodedGroupName = decodeURIComponent(groupName);
  const { user } = useUser();

  const userId = user ? user.id : "";
  const userName = user ? user.firstName : "";

  // Read data inbox
  useEffect(() => {
    const q = query(
      collection(db, "inbox-data"),
      where("groupName", "==", decodedGroupName)
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
        groupName: decodedGroupName,
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

  useEffect(() => {
    const groupNameMatches = dataInbox.some(
      (d) => d.groupName === decodedGroupName
    );

    if (!groupNameMatches) {
      const timer = setTimeout(() => {
        redirect("/");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [dataInbox, decodedGroupName]);

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
                {dataInbox.length > 0 && dataInbox[0].groupName}
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
            type="submit"
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
  function formatTimeForSorting(clock: string): string {
    if (!clock) return "";

    const [time, modifier] = clock.trim().split(" "); // split time and AM/PM
    if (!time) return "";

    let [hours, minutes, seconds] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return "";

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  function formatTimeForDisplay(clock: string): string {
    if (!clock) return "";

    const [time, modifier] = clock.trim().split(" "); //split time and AM/PM
    if (!time) return "";

    let [hours, minutes] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) return "";

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}.${minutes.toString().padStart(2, "0")}`;
  }

  // Normal formattedDate
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  //combine and sort message by time (including seconds)

  const sortedMessages = dataInbox
    .filter(
      (d) => d.message !== "" && d.message !== null && d.groupName !== null
    )
    .map((d) => ({
      ...d,
      formattedTimeForSorting: formatTimeForSorting(d.clock),
      formattedTimeForDisplay: formatTimeForDisplay(d.clock),
      formattedDate: formatDate(d.date),
    }))
    .sort((a, b) =>
      a.formattedTimeForSorting > b.formattedTimeForSorting ? 1 : -1
    );

  let lastDate = "";

  return (
    <div className="flex flex-col w-full overflow-auto h-full px-5 gap-4">
      {sortedMessages.map((d, index) => {
        const showDate = d.formattedDate !== lastDate;
        lastDate = d.formattedDate;

        return (
          <div key={index}>
            {showDate && (
              <div className="items-center justify-center flex flex-row w-full">
                <div className="border border-primary-3 h-fit w-full"></div>
                <div className="flex w-full items-center justify-center h-fit">
                  <p>
                    {d.formattedDate === formatDate(new Date().toISOString())
                      ? "Today"
                      : d.formattedDate}
                  </p>
                </div>
                <div className="border border-primary-3 h-fit w-full"></div>
              </div>
            )}

            <div
              className={`flex flex-col gap-1 ${d.userId === userId ? "items-end" : "items-start"}`}
            >
              <h3
                className={d.userId === userId ? "text-chat-2" : "text-chat-1"}
              >
                {d.userId === userId ? "You" : d.userName}
              </h3>
              <div className="flex flex-row gap-3">
                {d.userId === userId && <SlOptions size={12} />}
                <div
                  className={`flex flex-col ${d.userId !== userId ? "bg-chat-1.1" : "bg-chat-2.1"}  text-primary-2 p-2 max-w-[540px] rounded-md`}
                >
                  <p>{d.message}</p>
                  <p>{d.formattedTimeForDisplay}</p>
                </div>
                {d.userId !== userId && <SlOptions size={12} />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InboxIdContent;
