import React from "react";
import TaskContent from "./_content/TaskContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task | Quicks",
  description: "Faster and no hassle app.",
};

function Page() {
  return (
    <div className="relative flex flex-col max-w-2xl mx-auto w-full h-full">
      <TaskContent />
    </div>
  );
}

export default Page;
