import React from "react";
import InboxIdContent from "./_content/InboxIdContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox | Quicks",
  description: "Faster and no hassle app.",
};

function Page() {
  return (
    <div className="relative flex flex-col max-w-2xl mx-auto w-full h-full">
      <InboxIdContent />
    </div>
  );
}

export default Page;
