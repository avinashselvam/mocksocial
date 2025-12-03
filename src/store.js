import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useStore = create(
  immer((set) => ({
    selectedApp: "iMessage",
    sender: {
      userId: 0,
      name: "you",
      imgUrl: "default_pfp.svg",
    },
    receiver: {
      userId: 1,
      name: "friend",
      imgUrl: "default_pfp.svg",
    },
    messages: {
      0: {
        messageId: 0,
        by: 0,
        text: "hi",
        imgUrl: null,
        at: new Date(),
      },
      1: {
        messageId: 1,
        by: 1,
        text: "hi there",
        imgUrl: null,
        at: new Date(Date.now() + 60 * 1000),
      },
    },
    messageOrder: [0, 1],
    exportRef: null,
    inc: () => set((s) => ({ count: s.count + 1 })),
    setSelectedApp: (app) =>
      set((s) => {
        s.selectedApp = app;
      }),
    updatePerson: (person) =>
      set((s) => {
        person.userId === 0 ? (s.sender = person) : (s.receiver = person);
      }),
    updateMessage: (message) =>
      set((s) => {
        s.messages[message.messageId] = message;
      }),
    addMessage: () =>
      set((s) => {
        const lastMessageId = s.messageOrder[s.messageOrder.length - 1];
        const newMessageId = Math.max(...s.messageOrder) + 1;
        const lastMessageTimestamp = s.messages[lastMessageId].at;
        const newMessageTimestamp = new Date(
          lastMessageTimestamp.getTime() + 60 * 1000,
        );
        s.messages[newMessageId] = {
          messageId: newMessageId,
          by: s.messages[lastMessageId].by,
          text: "new",
          imgUrl: null,
          at: newMessageTimestamp,
        };
        s.messageOrder.push(newMessageId);
      }),
    deleteMessage: (messageId) =>
      set((s) => {
        delete s.messages[messageId];
        s.messageOrder = s.messageOrder.filter((x) => x !== messageId);
      }),
    swapOrder: (i, j) =>
      set((s) => {
        if (j < 0 || j > s.messageOrder.length - 1) return;
        [s.messageOrder[i], s.messageOrder[j]] = [
          s.messageOrder[j],
          s.messageOrder[i],
        ];
      }),
  })),
);

export default useStore;
