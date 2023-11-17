import { Stack } from "@chakra-ui/react";
import React from "react";
import { Skeleton } from "@chakra-ui/react";
const ChatLoading = () => {
  return (
    <Stack>
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    </Stack>
  );
};

export default ChatLoading;
