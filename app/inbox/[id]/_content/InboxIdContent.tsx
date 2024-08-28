"use client";

import Link from "next/link";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { BsX } from "react-icons/bs";
import { redirect, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { SlOptions } from "react-icons/sl";
import { useUser } from "@clerk/clerk-react";
import {
  containerVariant,
  containerVariantDropdown,
} from "@/app/(content)/_data/VariantMotion";
import { db } from "@/app/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useConvexAuth } from "convex/react";

function InboxIdContent() {
  const [dataInbox, setDataInbox] = useState<InboxDataProps[]>([]);
  const [isAction, setIsAction] = useState<{ [key: string]: boolean }>({});
  const [message, setMessage] = useState<string>("");
  const { isAuthenticated } = useConvexAuth();
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

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
        inboxData.push({ ...doc.data(), id: doc.id } as InboxDataProps);
      });
      setDataInbox(inboxData);
    });

    return () => unsubscribe();
  }, [id]);

  console.log(isAction);

  // Add or edit message data inbox
  const addItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (message.trim() === "") return;
    try {
      if (editingMessageId) {
        // Update existing message
        const messageRef = doc(db, "inbox-data", editingMessageId);
        setMessage("");
        await updateDoc(messageRef, { message: message });
        setEditingMessageId(null);
      } else {
        // Add new message
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
      }
      setMessage("");
    } catch (error) {
      console.error("Error adding/editing message: ", error);
    }
  };

  // Edit message
  const editItem = (id: string) => {
    const messageToEdit = dataInbox.find((d) => d.id === id);
    if (messageToEdit) {
      setMessage(messageToEdit.message);
      setEditingMessageId(id);
      setIsAction((prev) => ({ ...prev, [id]: false }));
    }
  };

  const uniqueParticipants = new Set(dataInbox.map((d) => d.userName));
  const participantCount = uniqueParticipants.size;

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
            <div className="flex flex-col">
              <h2 className="font-bold text-primary-1">
                {dataInbox.length > 0 && dataInbox[0].groupName}
              </h2>
              <p className="text-primary-3">{participantCount} Participant</p>
            </div>
          </div>
          <Link href={"/"} className="">
            <BsX size={36} className="font-bold" />
          </Link>
        </div>
        <div className="border border-primary-4 w-full my-2"></div>

        <ConversationalContent
          editItem={editItem}
          dataInbox={dataInbox}
          userId={userId}
          isAction={isAction}
          setIsAction={setIsAction}
        />
        {isAuthenticated &&
          dataInbox.some((d) => d.groupName === decodedGroupName) && (
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
                {editingMessageId ? "Update" : "Send"}
              </button>
            </form>
          )}
      </motion.div>
    </div>
  );
}

function ConversationalContent({
  dataInbox,
  userId,
  editItem,
  isAction,
  setIsAction,
}: {
  userId: string;
  dataInbox: InboxDataProps[];
  editItem: (id: string) => void;
  isAction: { [key: string]: boolean };
  setIsAction: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}) {
  const getTextColor = (username: string): string => {
    const firstLetter = username[0].toLowerCase();
    const colors = [
      "text-chat-1",
      "text-chat-3",
      "text-chat-4",
      "text-chat-5",
      "text-chat-6",
      "text-chat-7",
      "text-chat-8",
      "text-chat-9",
      "text-chat-10",
    ];

    const index = firstLetter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getBgColor = (username: string): string => {
    const firstLetter = username[0].toLowerCase();
    const colors = [
      "bg-chat-1.1",
      "bg-chat-3.1",
      "bg-chat-4.1",
      "bg-chat-5.1",
      "bg-chat-6.1",
      "bg-chat-7.1",
      "bg-chat-8.1",
      "bg-chat-9.1",
      "bg-chat-10.1",
    ];

    const index = firstLetter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Delete message
  const deleteItem = async (id: string) => {
    try {
      console.log(`Attempting to delete document with ID: ${id}`);
      await deleteDoc(doc(db, "inbox-data", id));
      setIsAction((prev) => {
        const newActionState = { ...prev };
        delete newActionState[id];
        return newActionState;
      });
      console.log("Document deleted successfully");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const toggleHiddenAction = async (id: string) => {
    await setIsAction((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  function formatTimeForSorting(clock: string): string {
    if (!clock) return "";

    const [time, modifier] = clock.trim().split(" ");
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

  function formatDateForSorting(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
    // YYYY-MM-DD format
  }

  function formatTimeForDisplay(clock: string): string {
    if (!clock) return "";

    const [time, modifier] = clock.trim().split(" ");
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

  // Format date and time for sorting
  const sortedMessages = dataInbox
    .filter(
      (d) => d.message !== "" && d.message !== null && d.groupName !== null
    )
    .map((d) => ({
      ...d,
      formattedTimeForSorting: formatTimeForSorting(d.clock),
      formattedTimeForDisplay: formatTimeForDisplay(d.clock),
      formattedDateForSorting: formatDateForSorting(d.date),
      formattedDate: formatDate(d.date),
    }))
    .sort((a, b) => {
      if (a.formattedDateForSorting === b.formattedDateForSorting) {
        return a.formattedTimeForSorting > b.formattedTimeForSorting ? 1 : -1;
      }
      return a.formattedDateForSorting > b.formattedDateForSorting ? 1 : -1;
    });

  let lastDate = "";

  return (
    <div className="flex flex-col w-full overflow-auto h-full px-5 gap-4">
      {sortedMessages.map((d, index) => {
        const showDate = d.formattedDate !== lastDate;
        lastDate = d.formattedDate;

        return (
          <div key={index} className="relative">
            {showDate && (
              <div className="items-center justify-center flex flex-row w-full">
                <div className="border w-full border-primary-3 h-fit "></div>
                <div className="flex w-[700px]  items-center justify-center h-fit">
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
                className={
                  d.userId === userId
                    ? "text-chat-2"
                    : `${getTextColor(d.userName ?? "")}`
                }
              >
                {d.userId === userId ? "You" : d.userName}
              </h3>
              <div className="flex flex-row items-start gap-3">
                {d.userId === userId && (
                  <button onClick={() => toggleHiddenAction(d.id)}>
                    <SlOptions size={12} />
                  </button>
                )}
                {isAction[d.id] && (
                  <motion.div
                    variants={containerVariantDropdown}
                    initial="hidden"
                    animate="show"
                    className="absolute mt-2 z-50 w-[80px] right-[120px] flex flex-col text-primary-3 bg-white border border-gray-300 rounded-lg shadow-xl"
                  >
                    <button
                      onClick={() => deleteItem(d.id)}
                      className="px-4 py-2 cursor-pointer text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-t-lg"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => editItem(d.id)}
                      className="px-4 py-2 cursor-pointer text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-b-lg"
                    >
                      Edit
                    </button>
                  </motion.div>
                )}

                <div
                  className={`flex flex-col ${d.userId !== userId ? `${getBgColor(d.userName ?? "")}` : "bg-chat-2.1"} h-fit text-primary-2 p-2 max-w-[540px] rounded-md`}
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
