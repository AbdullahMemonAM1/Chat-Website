import {
  Box,
  Text,
  Spinner,
  FormControl,
  Input,
  FormLabel,
  useToast,
} from "@chakra-ui/react";

import { io } from "socket.io-client";
import { ChatState } from "../../../Context/ChatProvider";
import React, { useEffect, useState } from "react";
import { IconButton } from "@chakra-ui/button";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderfull } from "@/app/config/ChatLogic";
import ProfileModal from "./Profilemodel";
import UpdatGroupChatModal from "./UpdatGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";

import "./style.css";
const SingleChat = ({ fetchAgain, setFetchAgain, fetchChat }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const [SocketConnected, setSocketConnected] = useState(false);

  const ENDPOINT = "http://localhost:5000";

  var socket, selectedChatCompare;
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        setMessages([...messages, data]);
      } catch (err) {
        toast({
          title: "Error sending Chat",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    console.log(socket);
    socket.emit("joinchat", selectedChat._id);
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );

      console.log(messages);
      setMessages(data);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error fetching Chat",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    console.log(socket);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={3}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {selectedChat.isGroupChat === "false" ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderfull(user, selectedChat.users)}
                ></ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}

                <UpdatGroupChatModal
                  fetchChat={fetchChat}
                  fetchAgain={fetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div>
                <ScrollableChat messages={messages} />
              </div>
            )}
          </Box>
          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            <Input
              variant="filled"
              bg="#E0E0E0"
              placeholder="Enter Message"
              onChange={typingHandler}
              value={newMessage}
            ></Input>
          </FormControl>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click A User To Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
