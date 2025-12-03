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
} from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Top() {
  const receiver = useStore.getState().receiver;
  return (
    <div className="flex h-1/12 justify-between w-full items-center px-4 border-b-1 border-gray-50">
      <ChevronLeftIcon />
      <img
        className="h-8 w-8 rounded-full object-cover"
        src={receiver.imgUrl}
      />
      <div className="text-sm font-semibold w-2/5">{receiver.name}</div>
      <PhoneCall />
      <VideoIcon />
      <TagIcon />
    </div>
  );
}
export function Middle() {
  const { sender, receiver, messages, messageOrder } = useStore();

  function Message({ message, position }) {
    const isSent = message.by == 0;
    const color = isSent ? "white" : "black";
    const bgColor = isSent ? "#5b51d8" : "#e9e8eb";
    const side1 = isSent ? "items-end" : "items-start";
    const side2 = isSent ? "justify-end" : "justify-start";
    const roundSide = isSent ? "r" : "l";
    const map = {
      single: "",
      first: isSent ? "rounded-br-sm" : "rounded-bl-sm",
      middle: isSent
        ? "rounded-br-sm rounded-tr-sm"
        : "rounded-bl-sm rounded-tl-sm",
      last: isSent ? "rounded-tr-sm" : "rounded-tl-sm",
    };
    let rounded = map[position];

    return (
      <div className={`flex ${side2}`}>
        <div className={`flex flex-col gap-1 max-w-3/4  ${side1}`}>
          {message.imgUrl && (
            <img
              src={message.imgUrl}
              className={`w-full h-full object-cover rounded-2xl ${rounded} max-w-1/2`}
            />
          )}
          <div
            className={`flex rounded-2xl ${rounded} p-3 py-1`}
            style={{ color: color, backgroundColor: bgColor }}
          >
            <div className="text-sm">{message.text}</div>
          </div>
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

    const out = `${weekday.toUpperCase()} AT ${time}`;
    return out;
  }

  return (
    <ScrollArea className="h-10/12">
      <div className="flex flex-col  w-full gap-0.5 p-4">
        <div className="text-[10px] font-thin text-gray-600 text-center">
          {formatTime(messages[messageOrder[0]].at)}
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
    <div className="flex h-1/12 items-center gap-4 p-4">
      <div className="flex flex-1 justify-between items-center bg-gray-50  p-1 rounded-full">
        <CameraIcon fill="#5b51d8" stroke="var(--color-gray-50)" />
        <p className="text-sm w-2/5 ml-2">Message...</p>
        <MicIcon />
        <ImageIcon />
        <StickerIcon />
        <PlusCircle />
      </div>
    </div>
  );
}
