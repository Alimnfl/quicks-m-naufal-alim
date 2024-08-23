import React from "react";
import InboxContent from "./_content/InboxContent";
import QuickContent from "../_content/QuickContent";

function Page() {
  return (
    <div className="relative flex flex-col max-w-2xl mx-auto w-full h-full">
      <InboxContent />
      <QuickContent />
    </div>
  );
}

export default Page;
