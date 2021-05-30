import React from "react";
import {Flex, Text, Stack, FlexProps} from "@chakra-ui/react";
import {ChatIcon} from "@chakra-ui/icons";

const Bookmark: React.FC<FlexProps> = (props) => {
  return (
    <Flex
      backgroundColor="secondary.500"
      color="yellow.700"
      justifyContent="center"
      padding={2}
      {...props}
    >
      <Stack alignItems="center" direction="row">
        <ChatIcon />
        <Text fontWeight="500">You are here</Text>
      </Stack>
    </Flex>
  );
};

export default Bookmark;
