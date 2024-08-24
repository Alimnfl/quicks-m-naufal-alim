"use client";

import { QuicksTrigger } from "@/public/img";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { DataIcon, DataIconInbox, DataIconTask } from "../_data/ContentData";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

function QuickNav() {
  const [triggerQuick, setTriggerQuick] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleTrigger = () => {
    setTriggerQuick((prev) => !prev);
  };

  const isLanding = pathname === "/";
  const isInbox = pathname.startsWith("/inbox");
  const isTask = pathname.startsWith("/task");

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
    <div className="relative w-full h-auto ">
      <div className="fixed right-[300px] bottom-0 flex flex-row">
        {isLanding && (
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
            <button
              onClick={toggleTrigger}
              className="w-fit h-fit ml-2 flex-col pt-6"
            >
              <Image src={QuicksTrigger} width={68} height={68} alt="Quick" />
            </button>
          </AnimatePresence>
        )}

        {isInbox && (
          <>
            <AnimatePresence>
              <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex gap-2 py-4 flex-row"
              >
                {DataIconInbox.map((d) => (
                  <motion.a
                    href={d.link}
                    key={d.id}
                    variants={childVariant}
                    className="flex items-center flex-col w-full h-full"
                  >
                    <p>{d.name}</p>
                    <Image
                      src={d.icon}
                      width={68}
                      height={68}
                      alt="Quick"
                      className="object-cover"
                    />
                  </motion.a>
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {isTask && (
          <>
            <AnimatePresence>
              <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex gap-2 py-4 flex-row"
              >
                {DataIconTask.map((d) => (
                  <motion.a
                    href={d.link}
                    key={d.id}
                    variants={childVariant}
                    className="flex items-center flex-col w-full h-full"
                  >
                    <p>{d.name}</p>
                    <Image
                      src={d.icon}
                      width={68}
                      height={68}
                      alt="Quick"
                      className="object-cover"
                    />
                  </motion.a>
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

export default QuickNav;
