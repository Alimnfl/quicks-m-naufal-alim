"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { DataTask } from "../_data/DataTask";
import {
  containerVariant,
  containerVariantDropdown,
} from "@/app/(content)/_data/VariantMotion";
import { PencilBlueIcon, PencilIcon, TimerIcon } from "@/public/img";
import Image from "next/image";
import { SlOptions } from "react-icons/sl";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { v4 as uuidv4 } from "uuid";

interface TaskDataProps {
  id: string;
  date: string;
  description: string;
  title: string;
  urgent: string;
  status: boolean;
}

function TaskContent() {
  const [taskTrigger, setTaskTrigger] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<string>("My Task");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isHidden, setIsHidden] = useState<{ [key: string]: boolean }>({});
  const [isAction, setIsAction] = useState<{ [key: string]: boolean }>({});
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

  //Deleted Item by id.
  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "task-data", id));
  };

  // Save Task
  const addTaskToFirestore = async () => {
    const now = new Date();
    const formattedNewDate = `${now.getFullYear()}-${String(now.getMonth() + 1)}-${String(now.getDate()).padStart(2, "0")}`;

    const newTask: TaskDataProps = {
      id: uuidv4(),
      date: selectedDate || formattedNewDate,
      description: "",
      title: selectedTask || "Default Task",
      urgent: "urgent",
      status: false,
    };

    try {
      await addDoc(collection(db, "task-data"), newTask);
      setSelectedTask("My Task");
      setSelectedDate("");
    } catch (error) {
      console.error("Error saving task: ", error);
    }
  };

  // Updated task title in Database
  const updateTask = async (
    taskId: string,
    updates: Partial<TaskDataProps>
  ) => {
    try {
      const taskDocRef = doc(db, "task-data", taskId);
      await updateDoc(taskDocRef, updates);
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const convertDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const convertDateForFirestore = (dateString: string): string => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (
    taskId: string,
    field: keyof TaskDataProps,
    value: any
  ) => {
    const updates: Partial<TaskDataProps> = {
      [field]: field === "status" ? value : value,
    };
    updateTask(taskId, updates);
  };

  const toggleTriggerTask = () => {
    setTaskTrigger((prev) => !prev);
  };

  const toggleHiddenTask = (id: string) => {
    setIsHidden((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleHiddenAction = (id: string) => {
    setIsAction((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const selectTask = (task: string) => {
    setSelectedTask(task);
    setTaskTrigger(false);
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
                className="absolute top-full z-20 mt-2 ml-[84px] w-full text-primary-3 bg-white border border-gray-300 rounded-md shadow-lg"
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
            onClick={addTaskToFirestore}
            className="flex flex-row items-center text-white bg-primary-1 border-black w-fit rounded-md gap-2 p-2"
          >
            New Task
          </button>
        </div>

        <div className="overflow-y-auto w-full flex flex-col gap-2 h-full px-4">
          {dataTask.map((data) => (
            <div key={data.id} className="flex gap-2 justify-between flex-row">
              <div className="flex flex-row gap-3 items-center">
                <div className="flex flex-col h-full w-fit pt-1">
                  <input
                    className="w-[18px] h-[18px]"
                    type="checkbox"
                    checked={data.status}
                    onChange={(e) =>
                      handleInputChange(data.id, "status", e.target.checked)
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 text-primary-2">
                  <input
                    value={data.title}
                    onChange={(e) =>
                      handleInputChange(data.id, "title", e.target.value)
                    }
                    onBlur={(e) =>
                      handleInputChange(data.id, "title", e.target.value)
                    }
                    className={`font-bold w-[335px] outline-none text-justify h-fit ${
                      data.status === true ? "line-through text-primary-3" : ""
                    }`}
                    spellCheck={false}
                  />
                  <AnimatePresence>
                    {!isHidden[data.id] && (
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
                              onChange={(e) =>
                                handleInputChange(
                                  data.id,
                                  "date",
                                  e.target.value
                                )
                              }
                              onBlur={(e) =>
                                handleInputChange(
                                  data.id,
                                  "date",
                                  e.target.value
                                )
                              }
                              value={data.date}
                              type="date"
                              className="border border-primary-3 rounded-md py-1 px-2"
                            />
                          </motion.div>
                        </div>
                        <div className="w-full relative pt-1 flex flex-row gap-4 items-start">
                          {data.description === "" ? (
                            <Image src={PencilIcon} alt="" className="pt-1" />
                          ) : (
                            <Image
                              src={PencilBlueIcon}
                              alt=""
                              className="pt-1"
                              width={16}
                            />
                          )}
                          <textarea
                            value={data.description}
                            onChange={(e) =>
                              handleInputChange(
                                data.id,
                                "description",
                                e.target.value
                              )
                            }
                            onBlur={(e) =>
                              handleInputChange(
                                data.id,
                                "description",
                                e.target.value
                              )
                            }
                            spellCheck="false"
                            name="message"
                            className="outline-none w-[310px] resize-none overflow-hidden h-auto"
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
                  <div className="text-primary-2 ">
                    {convertDate(data.date)}
                  </div>
                  <button onClick={() => toggleHiddenTask(data.id)}>
                    {isHidden[data.id] ? <IoIosArrowDown /> : <IoIosArrowUp />}
                  </button>

                  <div className="relative flex flex-col">
                    <button onClick={() => toggleHiddenAction(data.id)}>
                      <SlOptions size={12} />
                    </button>
                    {isAction[data.id] && (
                      <motion.div
                        variants={containerVariantDropdown}
                        initial="hidden"
                        animate="show"
                        className="absolute z-20 top-3 right-1 mt-2 w-[] text-primary-3 bg-white border border-gray-300 rounded-md shadow-lg"
                      >
                        <button
                          onClick={() => deleteItem(data.id)}
                          className="px-2 py-2 cursor-pointer  hover:bg-gray-200"
                        >
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default TaskContent;
