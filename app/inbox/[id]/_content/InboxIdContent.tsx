"use client";

import Link from "next/link";
import React from "react";
import { BsX } from "react-icons/bs";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { DiVim } from "react-icons/di";
import { SlOptions } from "react-icons/sl";

function InboxIdContent() {
  const { id } = useParams();

  const containerVariant = {
    hidden: {
      opacity: 0,
      x: 20,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.2,
        delaychildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.8,
        staggerChildren: 0.4,
        delayChildren: 1.4,
      },
    },
  };

  const childVariant = {
    hidden: {
      opacity: 0,
      x: 20,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.7,
      },
    },
  };

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
                109220-Naturalization
              </h2>
              <p className="text-primary-3">3 Participant</p>
            </div>
          </div>
          <Link href={"/"} className="">
            <BsX size={36} className="font-bold" />
          </Link>
        </div>
        <div className="border border-primary-4 w-full my-2"></div>

        <ConversationalContent />

        <div className="flex flex-row gap-2 w-full h-fit py-4 px-4">
          <label className="w-full">
            <input
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
        </div>
      </motion.div>
    </div>
  );
}

function ConversationalContent() {
  return (
    <div className="flex flex-col w-full overflow-auto h-full px-5 gap-4">
      <div className="flex flex-col gap-1 items-end">
        <h3 className="text-chat-2">You</h3>
        <div className="flex flex-row gap-3">
          <SlOptions size={12} />
          <div className="flex flex-col bg-chat-2.1 text-primary-2 p-2 max-w-[540px] rounded-md">
            <p>
              No worries. It will be completed ASAP. I’ve asked him yesterday.
            </p>
            <p>19.12</p>
          </div>
        </div>
      </div>

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
