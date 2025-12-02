import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useStore = create(
  immer((set) => ({
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
        at: "01/12/2025 09:02:00",
      },
      1: {
        messageId: 1,
        by: 1,
        text: "hi there",
        imgUrl: null,
        at: "01/12/2025 09:04:00",
      },
    },
    messageOrder: [0, 1],
    exportRef: null,
    inc: () => set((s) => ({ count: s.count + 1 })),
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
        const newMessageId = Math.max(...s.messageOrder) + 1;
        s.messages[newMessageId] = {
          messageId: newMessageId,
          by: 0,
          text: "new",
          imgUrl: null,
          at: "01/12/2025 09:02:00",
        };
        s.messageOrder.push(newMessageId);
      }),
    deleteMessage: (messageId) =>
      set((s) => {
        delete s.messages[messageId];
        s.messageOrder = s.messageOrder.filter((x) => x !== messageId);
      }),
  })),
);

export default useStore;
