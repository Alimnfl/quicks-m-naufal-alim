"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { Spinner } from "../_component/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";

function TaskContent() {
  const [taskTrigger, setTaskTrigger] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<string>("My Task");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isHidden, setIsHidden] = useState<{ [key: string]: boolean }>({});
  const [isAction, setIsAction] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useConvexAuth();

  const [isTriggerActionTask, setIsTriggerActionTask] = useState<{
    [key: string]: boolean;
  }>({});
  const [dataTask, setDataTask] = useState<TaskDataProps[]>([]);

  const triggerRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  const handleDocumentClick = (event: MouseEvent) => {
    if (
      triggerRef.current &&
      actionRef.current &&
      !triggerRef.current.contains(event.target as Node) &&
      !actionRef.current.contains(event.target as Node)
    ) {
      setIsTriggerActionTask((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => (updated[key] = false));
        return updated;
      });
      setIsAction((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((key) => (updated[key] = false));
        return updated;
      });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  // Read items from database
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "task-data"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr: TaskDataProps[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Partial<TaskDataProps>;
        itemsArr.push({ ...(data as TaskDataProps), id: doc.id });
      });
      setDataTask(itemsArr);
      setIsLoading(false);
    });
  }, []);

  //Deleted Item by id.
  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, "task-data", id));
  };

  // Save Task
  const addTaskToFirestore = async () => {
    let taskUrgency: TaskDataProps["urgency"] = "common";
    if (selectedTask === "Personal Errand") {
      taskUrgency = "personal";
    } else if (selectedTask === "Urgent To-Do") {
      taskUrgency = "urgent";
    }

    const now = new Date();
    const formattedNewDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const newTask: TaskDataProps = {
      id: uuidv4(),
      date: selectedDate || formattedNewDate,
      description: "",
      title: selectedTask,
      urgency: taskUrgency,
      status: false,
    };

    try {
      await addDoc(collection(db, "task-data"), newTask);
      setSelectedTask("My Task");
      setSelectedDate(formattedNewDate);
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

  const calculateDaysLeft = (dueDate: string): string => {
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft < 0) {
      return "Overdue";
    } else if (daysLeft === 0) {
      return "For Today";
    } else if (daysLeft === 1) {
      return "1 Day Left";
    } else {
      return `${daysLeft} Days Left`;
    }
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

  const filterTasksByUrgency = (urgency: string) => {
    return dataTask.filter((task) => {
      if (task.urgency === "common" && selectedTask === "My Task")
        return selectedTask === "My Task";
      if (task.urgency === "personal" && selectedTask === "Personal Errand")
        return selectedTask === "Personal Errand";
      if (task.urgency === "urgent" && selectedTask === "Urgent To-Do")
        return selectedTask === "Urgent To-Do";

      return false;
    });
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

  const toggleHiddenAction = async (id: string) => {
    await setIsAction((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTriggerActionTask = async (id: string) => {
    setIsTriggerActionTask((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleActionTask = async (
    id: string,
    urgentValue: "common" | "personal" | "urgent"
  ) => {
    await updateTask(id, { urgency: urgentValue });
    setIsTriggerActionTask((prev) => ({ ...prev, [id]: false }));
  };

  const selectTask = (task: string) => {
    setSelectedTask(task);
    setTaskTrigger(false);
  };

  return (
    <div className="flex flex-col items-end">
      <motion.div
        ref={actionRef}
        variants={containerVariant}
        initial="hidden"
        animate="show"
        className="flex flex-col text-black gap-2 w-[634px] h-[634px] bg-white mt-10 rounded-md"
      >
        {isAuthenticated && (
          <div className="py-6 flex flex-row w-full h-fit justify-between px-4">
            <div className="relative" ref={triggerRef}>
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
        )}

        {isLoading && (
          <div className="text-center justify-center text-primary-3 pb-10 w-full h-full flex flex-col items-center gap-8">
            <Spinner size={"icon"} />
            Loading Task List
          </div>
        )}

        {isAuthenticated && (
          <div className="overflow-y-auto w-full flex flex-col gap-2 h-full px-4">
            {filterTasksByUrgency(selectedTask).map((data) => {
              return (
                <div
                  key={data.id}
                  className="flex gap-2 justify-between flex-row"
                >
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
                          data.status === true
                            ? "line-through text-primary-3"
                            : ""
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
                                <Image
                                  src={PencilIcon}
                                  alt=""
                                  className="pt-1"
                                />
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
                                className="outline-none mb-1 w-[310px] resize-none overflow-hidden h-auto"
                                placeholder="No Description"
                              />
                            </div>
                            {/* {data.description === "" ? (
                            <div></div>
                          ) : (
                            <div className="absolute translate-y-[84px] w-[540px] border border-primary-3 mb-6"></div>
                          )} */}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="items-start justify-start h-full w-fit ">
                    <div className="flex flex-row items-center gap-2">
                      {data.status === false && (
                        <div className="font-base text-indicator-3">
                          {calculateDaysLeft(data.date)}
                        </div>
                      )}
                      <div className="text-primary-2 ">
                        {convertDate(data.date)}
                      </div>
                      <button onClick={() => toggleHiddenTask(data.id)}>
                        {isHidden[data.id] ? (
                          <IoIosArrowDown />
                        ) : (
                          <IoIosArrowUp />
                        )}
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
                            className="absolute z-20 top-3 right-1 mt-2 w-[120px] flex flex-col text-primary-3 bg-white border border-gray-300 rounded-md shadow-lg"
                          >
                            <button
                              onClick={() => deleteItem(data.id)}
                              className="px-2 py-2 cursor-pointer text-indicator-3 hover:bg-gray-200"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => toggleTriggerActionTask(data.id)}
                              className="px-2 py-2 cursor-pointer  hover:bg-gray-200"
                            >
                              Priority Task
                            </button>
                          </motion.div>
                        )}
                        {isTriggerActionTask[data.id] && (
                          <motion.div
                            variants={containerVariantDropdown}
                            initial="hidden"
                            animate="show"
                            className="absolute z-20 top-3 right-1 mt-2 w-[140px] flex flex-col text-primary-3 bg-white border border-gray-300 rounded-md shadow-lg"
                          >
                            <button
                              onClick={() =>
                                toggleActionTask(data.id, "common")
                              }
                              className="px-2 py-2 cursor-pointer  hover:bg-gray-200"
                            >
                              My Task
                            </button>
                            <button
                              onClick={() =>
                                toggleActionTask(data.id, "personal")
                              }
                              className="px-2 py-2 cursor-pointer  hover:bg-gray-200"
                            >
                              Personal Errand
                            </button>
                            <button
                              onClick={() =>
                                toggleActionTask(data.id, "urgent")
                              }
                              className="px-2 py-2 cursor-pointer  hover:bg-gray-200"
                            >
                              Urgent To Do
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default TaskContent;
