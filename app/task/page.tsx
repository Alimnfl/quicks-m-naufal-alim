import React from "react";
import QuickNav from "../(content)/_components/QuickNav";
import TaskContent from "./_content/TaskContent";

function Page() {
  return (
    <div className="relative flex flex-col max-w-2xl mx-auto w-full h-full">
      <TaskContent />
    </div>
  );
}

export default Page;
