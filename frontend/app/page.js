"use client";
import { Link } from "@chakra-ui/next-js";
import Login from "./Components/Authentication/login";
import Signup from "./Components/Authentication/signup";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatLoading from "./Components/ChatLoading";
import {
  ChakraProvider,
  Container,
  Box,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      router.push("/chats");
    }
  }, [router]);
  return (
    <div className="App">
      <ChakraProvider>
        <Container maxW="xl" centerContent>
          <Box
            d="flex"
            justifyContent="center"
            p="3"
            bg="white"
            w="100%"
            m="40px 0 15px 0"
            borderRadius="lg"
            borderWidth="2px"
          >
            <Text fontSize="2xl" fontFamily="Work sans" color="black">
              Chat App
            </Text>
          </Box>
          <Box bg="white" w="100%" p="4" borderRadius="lg" borderWidth="1px">
            <Tabs variant="soft-rounded">
              <TabList>
                <Tab width="50%">Login</Tab>
                <Tab width="50%">Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Container>
      </ChakraProvider>
    </div>
  );
}
