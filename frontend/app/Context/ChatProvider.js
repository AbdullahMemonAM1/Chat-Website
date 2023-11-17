"use client";
import { useRouter } from "next/navigation";
const { defaultConfig } = require("next/dist/server/config-shared");
const ChatContext = createContext();
import React, { createContext, useContext, useEffect, useState } from "react";

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  const router = useRouter();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    console.log(user);
    if (!userInfo) {
      router.push("/");
    }
  }, [router]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};
export default ChatProvider;
