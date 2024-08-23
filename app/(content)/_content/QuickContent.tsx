"use client";

import { QuicksTrigger } from "@/public/img";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { DataIcon } from "../_data/ContentData";
import { AnimatePresence, motion } from "framer-motion";

function QuickContent() {
  const [activeRoute, setActiveRoute] = useState("");
  const [triggerQuick, setTriggerQuick] = useState<boolean>(false);

  const toggleTrigger = () => {
    setTriggerQuick((prev) => !prev);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveRoute(window.location.pathname);
    }
  }, []);

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
        duration: 0.3,
        staggerChildren: 0.2,
        delayChildren: 0.2,
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
        duration: 0.3,
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-row justify-end">
      {activeRoute === "/" && (
        <>
          <AnimatePresence>
            {triggerQuick && (
              <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex gap-2 flex-row"
              >
                {DataIcon.map((d) => (
                  <motion.a
                    href={d.link}
                    key={d.id}
                    variants={childVariant}
                    className="flex items-center flex-col w-fit h-full"
                  >
                    <p>{d.name}</p>
                    <Image src={d.icon} width={68} height={68} alt="Quick" />
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={toggleTrigger}
            className="w-fit h-fit ml-2 flex-col pt-6"
          >
            <Image src={QuicksTrigger} width={68} height={68} alt="Quick" />
          </button>
        </>
      )}

      {activeRoute === "/inbox" && (
        <>
          <AnimatePresence>
            {triggerQuick && (
              <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex gap-2 flex-row"
              >
                {DataIcon.map((d) => (
                  <motion.a
                    href={d.link}
                    key={d.id}
                    variants={childVariant}
                    className="flex items-center flex-col w-fit h-full"
                  >
                    <p>{d.name}</p>
                    <Image src={d.icon} width={68} height={68} alt="Quick" />
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={toggleTrigger}
            className="w-fit h-fit ml-2 flex-col pt-6"
          >
            <Image src={QuicksTrigger} width={68} height={68} alt="Quick" />
          </button>
        </>
      )}
    </div>
  );
}

export default QuickContent;
