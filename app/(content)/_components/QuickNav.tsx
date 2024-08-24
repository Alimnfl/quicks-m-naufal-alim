"use client";

import { QuicksTrigger } from "@/public/img";
import Image from "next/image";
import React, { useState } from "react";
import { DataIcon, DataIconInbox, DataIconTask } from "../_data/ContentData";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { childVariantNav, containerVariantNav } from "../_data/VariantMotion";

function QuickNav() {
  const [triggerQuick, setTriggerQuick] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleTrigger = () => {
    setTriggerQuick((prev) => !prev);
  };

  const isLanding = pathname === "/";
  const isInbox = pathname.startsWith("/inbox");
  const isTask = pathname.startsWith("/task");

  return (
    <div className="relative w-full h-auto ">
      <div className="fixed right-[300px] bottom-0 flex flex-row">
        {isLanding && (
          <AnimatePresence>
            {triggerQuick && (
              <motion.div
                variants={containerVariantNav}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex gap-2 flex-row"
              >
                {DataIcon.map((d) => (
                  <motion.a
                    href={d.link}
                    key={d.id}
                    variants={childVariantNav}
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
                variants={containerVariantNav}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex gap-2 py-4 flex-row"
              >
                {DataIconInbox.map((d) => (
                  <motion.a
                    href={d.link}
                    key={d.id}
                    variants={childVariantNav}
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
                variants={containerVariantNav}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex gap-2 py-4 flex-row"
              >
                {DataIconTask.map((d) => (
                  <motion.a
                    href={d.link}
                    key={d.id}
                    variants={childVariantNav}
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
