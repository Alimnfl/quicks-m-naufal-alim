import React from "react";
import InboxContent from "./_content/InboxContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox | Quicks",
  description: "Faster and no hassle app.",
};

function Page() {
  return (
    <div className="relative flex flex-col max-w-2xl mx-auto w-full h-full">
      <InboxContent />
    </div>
  );
}

export default Page;
