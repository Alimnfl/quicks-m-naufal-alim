"use client";

import React from "react";
import { motion } from "framer-motion";

function TaskContent() {
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
        <div className="flex flex-row"></div>
      </motion.div>
    </div>
  );
}

export default TaskContent;
