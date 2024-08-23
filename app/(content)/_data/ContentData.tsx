import {
  InboxActive,
  InboxTrigger,
  TaskActive,
  TaskTrigger,
} from "@/public/img";

const DataIcon = [
  {
    id: 1,
    name: "Task",
    icon: InboxTrigger,
    link: "/task",
  },
  {
    id: 2,
    name: "Inbox",
    icon: TaskTrigger,
    link: "/inbox",
  },
];

const DataIconInbox = [
  {
    id: 1,
    name: "",
    icon: TaskTrigger,
    link: "/task",
  },
  {
    id: 2,
    name: "",
    icon: InboxActive,
    link: "/",
  },
];

const DataIconTask = [
  {
    id: 1,
    name: "",
    icon: InboxTrigger,
    link: "/inbox",
  },
  {
    id: 2,
    name: "",
    icon: TaskActive,
    link: "/",
  },
];

export { DataIcon, DataIconInbox, DataIconTask };
