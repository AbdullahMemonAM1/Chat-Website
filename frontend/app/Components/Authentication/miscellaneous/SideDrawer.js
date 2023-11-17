import React from "react";
import axios from "axios";
import ChatLoading from "../../ChatLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css"; // For all icons
import { BellIcon, ChevronDownIcon, AddIcon } from "@chakra-ui/icons";
import ProfileModal from "./Profilemodel";
import { useToast } from "@chakra-ui/react";
import UserListItem from "../../UserAvatar/UserListItem";
import {
  ChakraProvider,
  Button,
  Box,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Input,
  TabPanel,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../../../Context/ChatProvider";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {} from "@chakra-ui/hooks";
const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const router = useRouter();
  const toast = useToast();
  const logouthandler = () => {
    localStorage.removeItem("userInfo");
    router.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something",
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
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
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
      return;
    }
  };
  const accessChat = async (userId) => {
    try {
      console.log(userId);
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/chat",
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
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

  return (
    <div>
      <ChakraProvider>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          w="100%"
          p="5px 10px 5px 10px"
          borderWidth="5px"
        >
          <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
            <Button colorScheme="green" variant="ghost" onClick={onOpen}>
              <FontAwesomeIcon icon={faSearch} className="fas fa-search" />
              <Text display={{ base: "none", md: "flex" }} px="4">
                Search User
              </Text>
            </Button>
          </Tooltip>
          <Text fontSize="2xl" fontFamily="Work sans">
            Talk-A-Tive
          </Text>
          <div>
            <Menu p="1">
              <MenuButton p="1">
                <BellIcon fontSize="2xl"></BellIcon>
              </MenuButton>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.name}
                  src={user.pic}
                />
              </MenuButton>
              <MenuList>
                <ProfileModal user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logouthandler}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Box>

        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
              <Box display="flex" pb={2}>
                <Input
                  placeholder="Search by name or email"
                  mr={2}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
              {loadingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </ChakraProvider>
    </div>
  );
};

export default SideDrawer;
