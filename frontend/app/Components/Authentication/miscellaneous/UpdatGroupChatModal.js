import React, { useState } from "react";
import {
  IconButton,
  useDisclosure,
  useToast,
  Box,
  Spinner,
} from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  ModalCloseButton,
  FormControl,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../../Context/ChatProvider";
import UserBadgeItem from "../../UserAvatar/UserBadge";
import UserListItem from "../../UserAvatar/UserListItem";
const UpdatGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleAddUser = async (user1) => {
    console.log("try adding");
    if (selectedChat.users.find((user) => user._id === user1._id)) {
      toast({
        title: "User Already Exists",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    if (selectedChat.groupAdmin._id === user1._id) {
      toast({
        title: "Already Admin can Add users",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupadd",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error occured",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleRemove = async (user123) => {
    console.log("hi");
    const user1 = JSON.parse(localStorage.getItem("userInfo"));
    console.log(user1);
    if (selectedChat.groupAdmin._id !== user1._id) {
      toast({
        title: "Only Admin can remove",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/groupremove",
        { chatId: selectedChat._id, userId: user123._id },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error occured",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (err) {
      toast({
        title: "Group Can't rename",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${query}`,
        config,
        config
      );
      console.log(data);

      setSearchResults(data);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Faild to load",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <>
      <IconButton display="flex" icon={<ViewIcon />} onClick={onOpen}>
        Open Modal
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    handleRemove(user);
                  }}
                ></UserBadgeItem>
              ))}
            </Box>
            <FormControl isRequired display="flex">
              <Input
                placeholder="chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResults.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdatGroupChatModal;
