"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { DataAction, DataTask } from "../_data/DataTask";
import {
  containerVariant,
  containerVariantDropdown,
} from "@/app/(content)/_data/VariantMotion";
import { PencilIcon, TimerIcon } from "@/public/img";
import Image from "next/image";
import { SlOptions } from "react-icons/sl";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/app/firebase";
// import { v4 as uuidv4 } from "uuid";

interface TaskDataProps {
  id: string;
  date: number;
  description: string;
  title: string;
  urgent: string;
}

function TaskContent() {
  const [taskTrigger, setTaskTrigger] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<string>("My Task");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isAction, setIsAction] = useState<boolean>(false);
  const [dataTask, setDataTask] = useState<TaskDataProps[]>([]);

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, "task-data"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr: TaskDataProps[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Partial<TaskDataProps>;
        itemsArr.push({ ...(data as TaskDataProps), id: doc.id });
      });
      setDataTask(itemsArr);
    });
  }, []);

  const toggleTriggerTask = () => {
    setTaskTrigger((prev) => !prev);
  };

  const toggleHiddenTask = () => {
    setIsHidden((prev) => !prev);
  };

  const toggleHiddenAction = () => {
    setIsAction((prev) => !prev);
  };

  const selectTask = (task: string) => {
    setSelectedTask(task);
    setTaskTrigger(false);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked((prev) => !prev);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="flex flex-col items-end">
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="show"
        className="flex flex-col text-black gap-2 w-[634px] h-[634px] bg-white mt-10 rounded-md"
      >
        <div className="py-6 flex flex-row w-full h-fit justify-between px-4">
          <div className="relative">
            <button
              onClick={toggleTriggerTask}
              className="text-primary-3 flex flex-row mx-[85px] items-center border border-primary-3 w-fit rounded-md gap-2 p-2"
            >
              <div>{selectedTask}</div>
              {taskTrigger ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>
            {taskTrigger && (
              <motion.div
                variants={containerVariantDropdown}
                initial="hidden"
                animate="show"
                className="absolute top-full mt-2 ml-[84px] w-full text-primary-3 bg-white border border-gray-300 rounded-md shadow-lg"
              >
                {DataTask.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => selectTask(`${d.name}`)}
                    className="px-4 py-2 cursor-pointer  hover:bg-gray-200"
                  >
                    {d.name}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <button
            type="button"
            className="flex flex-row items-center text-white bg-primary-1 border-black w-fit rounded-md gap-2 p-2"
          >
            New Task
          </button>
        </div>

        <div className="overflow-y-auto w-full flex flex-col gap-2 h-full px-4">
          <div className="flex flex-row gap-4 justify-between">
            <div className="flex flex-row gap-4 items-center">
              <div className="flex flex-col h-full w-fit pt-1">
                <input
                  className="w-[18px] h-[18px]"
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div className="flex flex-col gap-2 text-primary-2">
                <h3
                  className={`font-bold w-[335px] text-justify h-fit ${
                    isChecked ? "line-through text-primary-3" : ""
                  }`}
                >
                  Cross-reference with Jeanne for Case #192813
                </h3>
                <AnimatePresence>
                  {isHidden === false && (
                    <motion.div
                      variants={containerVariantDropdown}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="flex flex-col gap-2 overflow-hidden "
                    >
                      <div className="flex flex-row gap-4">
                        <Image src={TimerIcon} alt="" />
                        <motion.div className="">
                          <input
                            value={selectedDate}
                            onChange={handleDateChange}
                            type="date"
                            className="border border-primary-3 rounded-md py-1 px-2"
                          />
                        </motion.div>
                      </div>
                      <div className="w-full flex flex-row gap-4 items-center">
                        <Image src={PencilIcon} alt="" />
                        <input
                          spellCheck="false"
                          name="message"
                          className="outline-none w-full border-none resize-none px-2"
                          placeholder="No Description"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="items-start justify-start h-full w-fit ">
              <div className="flex flex-row items-center gap-2">
                <div className="font-base text-indicator-3">2 Days Left</div>
                <div className="text-primary-2 ">12/06/2021</div>
                <button onClick={toggleHiddenTask}>
                  {isHidden ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>

                <div className="relative">
                  <button onClick={toggleHiddenAction}>
                    <SlOptions size={12} />
                  </button>
                  {isAction && (
                    <motion.div
                      variants={containerVariantDropdown}
                      initial="hidden"
                      animate="show"
                      className="absolute top-0 mt-2 ml-[84px] w-full text-primary-3 bg-white border border-gray-300 rounded-md shadow-lg"
                    >
                      {DataAction.map((d) => (
                        <div
                          key={d.id}
                          onClick={() => selectTask(`${d.name}`)}
                          className="px-4 py-2 cursor-pointer  hover:bg-gray-200"
                        >
                          {d.name}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default TaskContent;
