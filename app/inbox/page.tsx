import React from "react";
import QuickNav from "../(content)/_components/QuickNav";
import InboxContent from "./_content/InboxContent";

function Page() {
  return (
    <div className="relative flex flex-col max-w-2xl mx-auto w-full h-full">
      <InboxContent />
      <QuickNav />
    </div>
  );
}

export default Page;
