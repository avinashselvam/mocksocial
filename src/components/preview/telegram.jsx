import useStore from "@/store";
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
} from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Top() {
  const receiver = useStore.getState().receiver;
  return (
    <div className="flex h-1/12 justify-between w-full items-end px-4 py-2 border-b-1 border-gray-50">
      <div className="flex flex-1 text-sm items-center">
        <ChevronLeftIcon /> Chats
      </div>
      <div className="flex-1 text-center ">
        <div className="text-sm font-semibold">{receiver.name}</div>
        <div className="text-xs">online</div>
      </div>
      <div className="flex flex-1 justify-end">
        <img
          className="h-8 w-8 rounded-full object-cover"
          src={receiver.imgUrl}
        />
      </div>
    </div>
  );
}
export function Middle() {
  const { sender, receiver, messages, messageOrder } = useStore();

  function Message({ message }) {
    const isSent = message.by == 0;
    const color = "black";
    const bgColor = isSent ? "#e6fdca" : "#e9e8eb";
    const side1 = isSent ? "items-end" : "items-start";
    const side2 = isSent ? "justify-end" : "justify-start";

    return (
      <div className={`flex ${side2}`}>
        <div className={`flex flex-col gap-1 max-w-3/4  ${side1}`}>
          {message.imgUrl && (
            <img
              src={message.imgUrl}
              className={`object-contain rounded-2xl max-w-1/2`}
            />
          )}
          <div
            className={`flex rounded-sm p-3 py-1`}
            style={{ color: color, backgroundColor: bgColor }}
          >
            <div className="text-sm">{message.text}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-11/12 bg-[linear-gradient(150deg,#a0be87,#bec896)]">
      <div className="flex flex-col  w-full gap-1 p-4 ">
        <div className="text-[10px] font-thin text-gray-600 text-center">
          {messages[messageOrder[0]].at}
        </div>
        {messageOrder.map((id, idx) => (
          <Message key={id} message={messages[id]} />
        ))}
      </div>
    </ScrollArea>
  );
}
export function Bottom() {
  return (
    <div className="flex h-12 items-center gap-1 px-2 absolute bottom-0 left-0 right-0 bg-[#ffffff66]">
      <CameraIcon />
      <div className="flex flex-1 justify-between items-center bg-white p-1 border-gray-50 border-1 rounded-full">
        <p className="text-sm w-2/5 ml-2">Message</p>
      </div>
      <MicIcon />
    </div>
  );
}
