import useStore from "@/store";
import { ChevronLeftIcon, VideoIcon, PlusCircle, MicIcon } from "lucide-react";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Top() {
  const receiver = useStore.getState().receiver;
  return (
    <div
      className="flex h-2/12 justify-between w-full items-center px-4"
      style={{ backgroundColor: "#f7f7f7" }}
    >
      <ChevronLeftIcon stroke="#007aff" />
      <div className="flex flex-col text-center">
        <img
          className="h-12 w-12 rounded-full object-cover"
          src={receiver.imgUrl}
        />
        <div className="text-xs">{receiver.name}</div>
      </div>
      <VideoIcon stroke="#007aff" />
    </div>
  );
}
export function Middle() {
  const { sender, receiver, messages, messageOrder } = useStore();

  function Message({ message }) {
    const isSent = message.by == 0;
    const color = isSent ? "white" : "black";
    const bgColor = isSent ? "#007aff" : "#e9e8eb";
    const side = isSent ? "justify-end" : "justify-start";
    const widthClass = message.imgUrl ? "w-3/4" : "max-w-3/4";
    return (
      <div className={`flex ${side}`}>
        <div
          className={`rounded-2xl p-3 py-1 ${widthClass}`}
          style={{ color: color, backgroundColor: bgColor }}
        >
          {message.imgUrl && (
            <AspectRatio ratio={1} className="overflow-hidden py-2">
              <img src={message.imgUrl} className="object-cover rounded-2xl" />
            </AspectRatio>
          )}
          <div className="text-sm">{message.text}</div>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-9/12">
      <div className="flex flex-col  w-full gap-1 p-4">
        <div className="text-xs font-semibold text-gray-400 text-center">
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
    <div className="flex h-1/12 items-center gap-4 p-4">
      <PlusCircle stroke="gray" />
      <div className="flex flex-1 justify-between items-center outline outline-gray-100 p-2 rounded-full">
        <p className="text-xs ml-2 text-gray-400">iMessage</p>
        <MicIcon size={16} stroke="gray" />
      </div>
    </div>
  );
}
