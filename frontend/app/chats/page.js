"use client";
import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../Components/Authentication/miscellaneous/SideDrawer";
import ChatBox from "../Components/Authentication/miscellaneous/ChatBox";
import MyChats from "../Components/Authentication/miscellaneous/MyChats";
import { ChakraProvider } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
const page = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <ChakraProvider>
        {user && <SideDrawer />}

        <Box
          display="flex"
          justifyContent="space-around"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user && <MyChats fetchAgain={fetchAgain} />}

          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </ChakraProvider>
    </div>
  );
};

export default page;
