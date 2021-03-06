import React, { useState, useEffect, useContext } from "react";
import { contextsProviderProps, ChatObj, headerOptions } from "../types/types";
import { useSocket } from "./Socket.context";
import { useUser } from "./User.context";
import serverAPI from "../api/serverApi";

interface ChatContextValue {
  userMessages: ChatObj | undefined;
  sendMessage: (to: string, message: string, currIndex: number) => void;
  resetUnreadCount: () => void;
  resetInnerUnreadCount: (index: number) => void;
  startConversation: (recipentID: string, recipentName: string) => void;
  currIndex: number;
  setCurrIndex: (currIndex: number) => void;
}

const emptyChatContextValue: ChatContextValue = {
  userMessages: undefined,
  sendMessage: function (): void {},
  resetUnreadCount: function (): void {},
  resetInnerUnreadCount: function (): void {},
  startConversation: function (): void {},
  currIndex: 0,
  setCurrIndex: function (): void {},
};

const ChatContext = React.createContext<ChatContextValue>(
  emptyChatContextValue
);

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }: contextsProviderProps) {
  const [userMessages, setUserMessages] = useState<ChatObj>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rerender, setRerender] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const { socket } = useSocket();
  const { currentUser, token } = useUser();

  useEffect(() => {
    if (currentUser) {
      (async function () {
        const options: headerOptions = {
          headers: {
            Authorization: token!,
          },
        };
        try {
          const { data } = await serverAPI(options).get(
            "/chat/getUserMessages"
          );
          setUserMessages(data.userChat);
        } catch (err: any) {
          console.log(err.message);
        }
      })();
    }
  }, [currentUser, token]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", async () => {
        const options: headerOptions = {
          headers: {
            Authorization: token!,
          },
        };
        try {
          const { data } = await serverAPI(options).get(
            "/chat/getUserMessages"
          );
          setUserMessages(data.userChat);
        } catch (err: any) {
          console.log(err.message);
        }
      });
      return () => socket.off("receiveMessage");
    }
  }, [socket, token]);

  const sendMessage = (to: string, message: string, currIndex: number) => {
    socket.emit("sendMessage", { to, message });
    setUserMessages((prev) => {
      prev?.chat[currIndex].messages.push({
        text: message,
        sender: true,
        time: new Date().toLocaleString(),
      });
      return prev;
    });
  };

  const resetUnreadCount = async () => {
    if (!userMessages || userMessages.newMsgUsersIDs.length === 0) return;

    setUserMessages((prev) => {
      prev!.newMsgUsersIDs = [];
      return prev;
    });
    setRerender((prev) => !prev);
    const options: headerOptions = {
      headers: {
        Authorization: token!,
      },
    };
    try {
      await serverAPI(options).put("/chat/resetUnreadCount");
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const resetInnerUnreadCount = async (index: number) => {
    if (!userMessages || userMessages.chat[index].unRead === 0) return;

    setUserMessages((prev) => {
      prev!.chat[index].unRead = 0;
      return prev;
    });

    const options: headerOptions = {
      headers: {
        Authorization: token!,
      },
    };
    try {
      await serverAPI(options).put("/chat/resetInnerUnreadCount", {
        recipentID: userMessages.chat[index].recipentID,
      });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const startConversation = (recipentID: string, recipentName: string) => {
    const found = userMessages?.chat.find((chatObj) => {
      return chatObj.recipentID === recipentID;
    });
    if (!found) {
      setUserMessages((prev) => {
        prev?.chat.unshift({
          recipentID,
          recipentName,
          messages: [],
          unRead: 0,
        });
        return prev;
      });
    }
  };

  const value: ChatContextValue = {
    userMessages,
    sendMessage,
    resetUnreadCount,
    startConversation,
    resetInnerUnreadCount,
    currIndex,
    setCurrIndex,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export default ChatProvider;
