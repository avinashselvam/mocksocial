import { useState, useRef, use } from "react";
import {
  ChevronLeftIcon,
  VideoIcon,
  ImageIcon,
  TrashIcon,
  PlusCircle,
  MicIcon,
  DownloadIcon,
  PenIcon,
  PlusIcon,
  MoreVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  XIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toPng } from "html-to-image";

import useStore from "./store";

import {
  Top as IMessageTop,
  Middle as IMessageMiddle,
  Bottom as IMessageBottom,
} from "@/components/preview/imessage";

import {
  Top as InstagramTop,
  Middle as InstagramMiddle,
  Bottom as InstagramBottom,
} from "@/components/preview/instagram";

import {
  Top as TelegramTop,
  Middle as TelegramMiddle,
  Bottom as TelegramBottom,
} from "@/components/preview/telegram";

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
  const { sender, receiver, messages, messageOrder, addMessage } = useStore();
  return (
    <div className="flex flex-col lg:flex-row lg:h-screen">
      <ScrollArea>
        <div className="flex w-sm flex-col gap-4 text-left m-4">
          <div>
            <div className="text-xl font-bold">Mock Social</div>
            <div className="flex text-xs text-gray-500 gap-1">
              <p>by</p>
              <a href="https://x.com/naaavinash" className="underline">
                @naaavinash
              </a>
              <p>ping if you require an API</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {/* <div className="text-md font-semibold">App</div>*/}
            <SelectApp />
          </div>
          <Separator />
          <Tabs defaultValue="people">
            <TabsList>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="people">
              <div className="flex flex-col gap-2">
                {/* <div className="text-md font-semibold">People</div>*/}
                <p className="text-sm">Receiver</p>
                <Person person={receiver} />
                <p className="text-sm">Sender</p>
                <Person person={sender} />
              </div>
            </TabsContent>
            <TabsContent value="messages">
              <div className="flex flex-col gap-4">
                {/* <div className="text-md font-semibold">Messages</div>*/}
                {messageOrder.map((id) => (
                  <Message
                    key={id}
                    message={messages[id]}
                    person={messages[id].by === 0 ? sender : receiver}
                  />
                ))}
                <Button variant="secondary" onClick={addMessage}>
                  <PlusIcon /> Message
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
      <Separator orientation="vertical" />
      <div className="flex flex-col items-center justify-between flex-3 bg-gray-200 p-4 gap-4">
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
  const { setSelectedApp } = useStore();
  const options = ["Instagram", "Whatsapp", "iMessage"]; //, "Whatsapp", "X"];
  const icons = ["instagram.svg", "whatsapp.svg", "imessage.svg"];
  return (
    <Select defaultValue="iMessage" onValueChange={(v) => setSelectedApp(v)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select app" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option, idx) => (
            <SelectItem key={idx} value={option}>
              <div className="flex items-center gap-2">
                <img alt="social app icon" src={icons[idx]} className="h-4" />
                {option}
              </div>
            </SelectItem>
          ))}
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
  // const people = useStore.getState().people;
  const { updateMessage, deleteMessage, swapOrder } = useStore();

  const inputRef = useRef();
  const pick = () => inputRef.current.click();

  const dateRef = useRef();
  const timeRef = useRef();

  function getPositionInOrder(messageId) {
    const messageOrder = useStore.getState().messageOrder;
    return messageOrder.findIndex((id) => messageId === id);
  }

  function moveUpOrder(messageId) {
    const i = getPositionInOrder(messageId);
    swapOrder(i, i - 1);
  }

  function moveDownOrder(messageId) {
    const i = getPositionInOrder(messageId);
    swapOrder(i, i + 1);
  }

  function changeText(newText) {
    const newMessage = { ...message, text: newText };
    updateMessage(newMessage);
  }

  function changePerson(newUserId) {
    const newMessage = { ...message, by: newUserId };
    updateMessage(newMessage);
  }

  function changeTime() {
    const dateValue = dateRef.current.value;
    const timeValue = timeRef.current.value;
    const newDate = new Date(`${dateValue}T${timeValue}`);
    console.log(newDate);
    const newMessage = { ...message, at: newDate };
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

  function SelectPerson({ message }) {
    const { sender, receiver } = useStore();

    return (
      <Select
        defaultValue={`${message.by}`}
        onValueChange={(v) => changePerson(v)}
      >
        <SelectTrigger className="w-1/4 !h-6 py-3 shadow-none">
          <SelectValue placeholder="by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={`${sender.userId}`}>
              <div className="flex text-xs items-center gap-1">
                <img
                  alt="profile picture"
                  src={sender.imgUrl}
                  className="h-4"
                ></img>
                <div>{sender.name}</div>
              </div>
            </SelectItem>
            <SelectItem value={`${receiver.userId}`}>
              <div className="flex text-xs items-center gap-1">
                <img
                  alt="profile picture"
                  src={receiver.imgUrl}
                  className="h-4"
                ></img>
                <div>{receiver.name}</div>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  function MessageOptions() {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex w-fit" align="end">
          <div>
            <Button
              variant="ghost"
              onClick={() => moveUpOrder(message.messageId)}
            >
              <ChevronUpIcon />
            </Button>
            <Button
              variant="ghost"
              onClick={() => moveDownOrder(message.messageId)}
            >
              <ChevronDownIcon />
            </Button>
            <Button variant="ghost" onClick={pick}>
              <ImageIcon />
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  console.log(e);
                  addImage(e.target.files[0]);
                }}
              />
            </Button>

            <Button
              variant="ghost"
              onClick={() => deleteMessage(message.messageId)}
            >
              <TrashIcon />
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function dateToDateString(d) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function dateToTimeString(d) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  return (
    <div className="group flex flex-row gap-4 items-center">
      <div className="flex flex-1 flex-col gap-1 border px-2 border-gray-100 rounded-sm">
        <div className="flex justify-between gap-2 items-center">
          <SelectPerson message={message} />
          <div className="flex items-center">
            <div className="flex text-xs text-gray-400">
              <Input
                type="date"
                ref={dateRef}
                value={dateToDateString(message.at)}
                onChange={changeTime}
                className="!text-xs !h-6 shadow-none border-0 p-0 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              ></Input>
              <Input
                type="time"
                ref={timeRef}
                value={dateToTimeString(message.at)}
                onChange={changeTime}
                className="!text-xs !h-6 shadow-none border-0 p-0 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              ></Input>
            </div>
            <MessageOptions />
          </div>
        </div>
        <Input
          value={message.text}
          onChange={(e) => changeText(e.target.value)}
          className="shadow-none border-0 p-0"
        ></Input>
        {message.imgUrl && (
          <div className="relative">
            <Button
              variant="outline"
              className="absolute left-1 top-1 w-6 h-6"
              onClick={removeImage}
            >
              <XIcon />
            </Button>
            <img
              alt="attached image"
              className="w-1/2 h-1/2"
              src={message.imgUrl}
            />
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
      <DownloadIcon /> Download
    </Button>
  );
}

function Preview() {
  return (
    <div className="shadow">
      <div id="preview" className="w-[360px] items-center  bg-white">
        <AspectRatio ratio={9 / 16} className="flex flex-col">
          <Sections />
        </AspectRatio>
      </div>
    </div>
  );
}

function Sections() {
  const { selectedApp } = useStore();
  switch (selectedApp) {
    case "Whatsapp":
      return (
        <>
          <TelegramTop />
          <TelegramMiddle />
          <TelegramBottom />
        </>
      );
    case "Instagram":
      return (
        <>
          <InstagramTop />
          <InstagramMiddle />
          <InstagramBottom />
        </>
      );
    case "iMessage":
      return (
        <>
          <IMessageTop />
          <IMessageMiddle />
          <IMessageBottom />
        </>
      );
  }
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
    <div className="cursor-pointer h-12 w-12 relative" onClick={pick}>
      <img alt="profile picture" src={person.imgUrl} />
      <div className="rounded-full absolute bottom-2 right-0 outline p-1 bg-white">
        <PenIcon size={8} />
      </div>
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
