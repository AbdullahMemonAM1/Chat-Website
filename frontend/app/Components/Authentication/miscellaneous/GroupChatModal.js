import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";
import UserBadgeItem from "../../UserAvatar/UserBadge";
import { ChatState } from "../../../Context/ChatProvider";
import UserListItem from "../../UserAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUser] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState();

  const handleGroup = (usertoAdd) => {
    if (selectedUsers.includes(usertoAdd)) {
      toast({
        title: "user Already Added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setSelectedUser([...selectedUsers, usertoAdd]);
  };

  const handleSearch = async (query) => {
    setSearchResult(query);
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
      setLoading(false);
      setSearchResult(data);
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
  const toast = useToast();
  const { user, chats, setChats } = ChatState();
  const handleSubmit = async (query) => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please Fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } catch (err) {
      toast({
        title: "Cant add Group",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  const handleDelete = (delUser) => {
    setSelectedUser(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
          ></ModalBody>
          <FormControl>
            <Input
              placeholder="Chatname"
              mb="3"
              onChange={(e) => {
                return setGroupChatName(e.target.value);
              }}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add Users"
              mb="3"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          <Box w="100%" display="flex" flexWrap="wrap">
            {selectedUsers.map((user) => {
              return (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => {
                    handleDelete(user);
                  }}
                ></UserBadgeItem>
              );
            })}
          </Box>
          {loading ? (
            // <ChatLoading />
            <div>Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Search
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
