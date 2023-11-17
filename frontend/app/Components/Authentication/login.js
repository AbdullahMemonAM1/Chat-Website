import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import {
  Stack,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react"; // Import Input from "@chakra-ui/react"

const login = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const handleClick = () => {
    setShow(!show);
  };
  const SubmitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        config
      );
      
      toast({
        title: "Login Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      router.push("/chats");
    } catch (err) {
      toast({
        title: "Error occured",

        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <div>
      <VStack>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <Button width="100%" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          width="100%"
          style={{ marginTop: "15px" }}
          colorScheme="blue"
          onClick={SubmitHandler}
          isLoading={loading}
        >
          Login
        </Button>
      </VStack>
    </div>
  );
};

export default login;
