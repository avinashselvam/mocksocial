import { useState, useRef, use } from "react";
import {
  ChevronLeftIcon,
  VideoIcon,
  ImageIcon,
  TrashIcon,
  PlusCircle,
  MicIcon,
  DownloadIcon,
  Plus,
  PlusIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toPng } from "html-to-image";

import useStore from "./store";

import "./App.css";

const exampleUser = {
  userId: 0,
  name: "sender",
  imgUrl: "react.svg",
};

const exampleMessage = {
  messageId: 0,
  by: 0,
  text: "hi",
  imgUrl: null,
  at: "01/12/2025 09:02:00",
};

function App() {
  const { sender, receiver, messages, addMessage } = useStore();
  return (
    <div className="flex flex-col lg:flex-row" style={{ height: "100vh" }}>
      <div className="flex lg:flex-1 min-w-sm flex-col gap-4 text-left m-4">
        <div className="flex">
          <SelectApp />
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="text-lg font-semibold">People</div>
          <p>Receiver</p>
          <Person person={receiver} />
          <p>Sender</p>
          <Person person={sender} />
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <h3>Messages</h3>
          {Object.values(messages).map((message) => (
            <Message
              key={message.messageId}
              message={message}
              person={message.by === 0 ? sender : receiver}
            />
          ))}
          <Button variant="secondary" onClick={addMessage}>
            <PlusIcon /> Message
          </Button>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-col items-center justify-between flex-3 bg-gray-50 p-4">
        <Preview />
        <div>
          <Download />
        </div>
      </div>
    </div>
  );
}
export default App;

export function SelectApp() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select app" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="apple">Instagram</SelectItem>
          <SelectItem value="banana">Telegram</SelectItem>
          <SelectItem value="blueberry">Whatsapp</SelectItem>
          <SelectItem value="grapes">iMessage</SelectItem>
          <SelectItem value="pineapple">X</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function Person({ person }) {
  const { updatePerson } = useStore();

  function changeName(newName) {
    const newPerson = { ...person, name: newName };
    updatePerson(newPerson);
  }

  return (
    <div className="flex gap-2">
      <ProfilePicture person={person} />
      <Input
        onChange={(e) => changeName(e.target.value)}
        value={person.name}
      ></Input>
    </div>
  );
}

function Message({ message, person }) {
  // const messages = useStore.getState().messages;
  // const people = useStore.getState().people;
  const { updateMessage, deleteMessage } = useStore();

  const inputRef = useRef();
  const pick = () => inputRef.current.click();

  function changeOrder() {}

  function changeText(newText) {
    const newMessage = { ...message, text: newText };
    updateMessage(newMessage);
  }

  function changePerson(newUserId) {
    const newMessage = { ...message, userId: newUserId };
    updateMessage(newMessage);
  }

  function addImage(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newMessage = { ...message, imgUrl: url };
    updateMessage(newMessage);
  }

  function removeImage() {
    const url = message.imgUrl;
    if (url) URL.revokeObjectURL(url);
    const newMessage = { ...message, imgUrl: null };
    updateMessage(newMessage);
  }

  function SelectPerson({ person }) {
    const { sender, receiver } = useStore();

    return (
      <Select
        defaultValue={`${person.userId}`}
        onValueChange={(v) => changePerson(v)}
      >
        <SelectTrigger className="w-1/4">
          <SelectValue placeholder="by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={`${sender.userId}`}>{sender.name}</SelectItem>
            <SelectItem value={`${receiver.userId}`}>
              {receiver.name}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="group flex flex-row gap-4 items-center">
      <img className="h-12 w-12" src={person.imgUrl}></img>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex justify-between">
          <SelectPerson person={person} />
          <div className="text-xs text-gray-400">{message.at}</div>
          <div className="flex opacity-0 group-hover:opacity-100 transition">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Submit"
              onClick={pick}
            >
              <ImageIcon />
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => addImage(e.target.files[0])}
              />
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Submit"
              onClick={() => deleteMessage(message.messageId)}
            >
              <TrashIcon />
            </Button>
          </div>
        </div>
        <Input
          value={message.text}
          onChange={(e) => changeText(e.target.value)}
        ></Input>
        {message.imgUrl && (
          <div className="relative">
            <Button
              variant="outline"
              className="absolute left-1 top-1 opacity-0 group-hover:opacity-100"
              onClick={removeImage}
            >
              <TrashIcon />
            </Button>
            <img className="w-1/2 h-1/2" src={message.imgUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

function Download() {
  async function downloadPreview() {
    const url = await toPng(document.getElementById("preview"), {
      pixelRatio: 2,
    });
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.png";
    a.click();
  }
  return (
    <Button onClick={downloadPreview}>
      Download <DownloadIcon />
    </Button>
  );
}

function Preview() {
  return (
    <div id="preview" className="w-[360px]  bg-white">
      <AspectRatio ratio={9 / 16} className="flex flex-col">
        <Top />
        <Middle />
        <Bottom />
      </AspectRatio>
    </div>
  );
}

function Top() {
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
function Middle() {
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
    <ScrollArea className="flex flex-col h-9/12 w-full gap-2 p-4">
      <div className="text-xs font-semibold text-gray-400 text-center">
        Tue, 2 Dec
      </div>
      {messageOrder.map((id, idx) => (
        <Message key={id} message={messages[id]} />
      ))}
    </ScrollArea>
  );
}
function Bottom() {
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

function ProfilePicture({ person }) {
  const { updatePerson } = useStore();
  const inputRef = useRef();

  const pick = () => inputRef.current.click();

  function addImage(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newPerson = { ...person, imgUrl: url };
    updatePerson(newPerson);
  }

  function removeImage() {
    const url = person.imgUrl;
    if (url) URL.revokeObjectURL(url);
    const newPerson = { ...person, imgUrl: null };
    updatePerson(newPerson);
  }

  return (
    <div className="cursor-pointer" onClick={pick}>
      <img src={person.imgUrl} className="h-12 w-12" />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => addImage(e.target.files[0])}
      />
    </div>
  );
}
