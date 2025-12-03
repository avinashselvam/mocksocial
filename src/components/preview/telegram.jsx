import useStore from "@/store";
import { getPosition } from "./utils";

import {
  ChevronLeftIcon,
  VideoIcon,
  PlusCircle,
  MicIcon,
  PhoneCall,
  TagIcon,
  ImageIcon,
  StickerIcon,
  CameraIcon,
  Pin,
  ClipboardPaste,
  PlusIcon,
  PhoneCallIcon,
} from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Top() {
  const receiver = useStore.getState().receiver;
  return (
    <div className="flex h-1/12 gap-3 items-center w-full px-4 py-2 border-b-1 border-gray-50">
      <ChevronLeftIcon />
      <div className="flex flex-1 items-center gap-2">
        <img
          className="h-8 w-8 rounded-full object-cover"
          src={receiver.imgUrl}
        />
        <div className="text-sm font-semibold">{receiver.name}</div>
      </div>
      <VideoIcon />
      <PhoneCallIcon />
    </div>
  );
}
export function Middle() {
  const { sender, receiver, messages, messageOrder } = useStore();

  function Message({ message, position }) {
    const isSent = message.by == 0;
    const color = "black";
    const bgColor = isSent ? "#e6fdca" : "white";
    const side = isSent ? "justify-end" : "justify-start";
    const widthClass = message.imgUrl ? "w-3/4" : "max-w-3/4";
    const tailUrl = isSent
      ? "whatsapp_callout_sent.svg"
      : "whatsapp_callout_received.svg";
    const tailPosition = isSent
      ? "right-[-4.5px] bottom-[0px]"
      : "left-[-4.5px] bottom-[0px]";

    return (
      <div className={`flex ${side}`}>
        <div
          className={`rounded-sm p-3 py-1 ${widthClass} relative`}
          style={{ color: color, backgroundColor: bgColor }}
        >
          {message.imgUrl && (
            <AspectRatio ratio={1} className="overflow-hidden py-2">
              <img
                src={message.imgUrl}
                className="w-full h-full object-cover rounded-2xl"
              />
            </AspectRatio>
          )}
          <div className="text-sm">{message.text}</div>
          <div className="flex justify-end">
            <div className="text-[8px]  text-gray-500 justify-end">
              10:20 AM
            </div>
          </div>
          {["single", "last"].includes(position) && (
            <img
              src={tailUrl}
              className={`absolute ${tailPosition}`}
              width="16px"
            />
          )}
        </div>
      </div>
    );
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const weekday = d.toLocaleString("en-US", { weekday: "short" });
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "short" });
    const time = d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const out = `${weekday}, ${day} ${month}`;
    return out;
  }

  return (
    <ScrollArea className="h-11/12 bg-[#ECE5DD]">
      <div className="flex flex-col w-full gap-1 p-4 ">
        <div className="w-full flex justify-center">
          <div className="flex text-[10px] font-semibold text-gray-600 bg-amber-50 w-fit rounded-full px-2 ">
            {formatTime(messages[messageOrder[0]].at)}
          </div>
        </div>
        {messageOrder.map((id, idx) => (
          <Message
            key={id}
            message={messages[id]}
            position={getPosition(id, idx, messageOrder, messages)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
export function Bottom() {
  return (
    <div className="flex h-12 items-center gap-3 px-2 absolute bottom-0 left-0 right-0 bg-[#ffffff66]">
      <PlusIcon />
      <div className="flex flex-1 justify-between items-center bg-white p-1 border-gray-50 border-1 rounded-full">
        <p className="text-sm w-2/5 ml-2">Message</p>
      </div>
      <CameraIcon />
      <MicIcon />
    </div>
  );
}
