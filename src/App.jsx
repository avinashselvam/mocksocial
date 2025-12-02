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
      <ScrollArea>
        <div className="flex w-sm flex-col gap-4 text-left m-4">
          <div className="text-xl font-bold">Mock Social</div>
          <div className="flex flex-col gap-2">
            <div className="text-md font-semibold">App</div>
            <SelectApp />
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <div className="text-md font-semibold">People</div>
            <p>Receiver</p>
            <Person person={receiver} />
            <p>Sender</p>
            <Person person={sender} />
          </div>
          <Separator />
          <div className="flex flex-col gap-4">
            <div className="text-md font-semibold">Messages</div>
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
      </ScrollArea>
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
  const options = ["Instagram", "Telegram", "Whatsapp", "iMessage", "X"];
  return (
    <Select defaultValue="iMessage">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select app" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option, idx) => (
            <SelectItem key={idx} value={option}>
              {option}
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
    const newMessage = { ...message, by: newUserId };
    updateMessage(newMessage);
  }

  function changeTime(newTime) {
    const newMessage = { ...message, at: newTime };
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
          <SelectPerson message={message} />
          <div className="text-xs text-gray-400">
            <Input
              placeholder="dd/mm/yyyy hh:mm:ss"
              value={message.at}
              onChange={(e) => changeTime(e.target.value)}
            ></Input>
          </div>
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
      <DownloadIcon /> Download
    </Button>
  );
}

function Preview() {
  return (
    <div id="preview" className="w-[360px]  bg-white">
      <AspectRatio ratio={9 / 16} className="flex flex-col">
        <InstagramTop />
        <InstagramMiddle />
        <InstagramBottom />
      </AspectRatio>
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
    <div className="cursor-pointer h-12 w-12" onClick={pick}>
      <img src={person.imgUrl} />
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
