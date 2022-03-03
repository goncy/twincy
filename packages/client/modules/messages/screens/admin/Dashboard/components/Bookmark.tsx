import type {FlexProps} from "@chakra-ui/react";

import {ChatIcon} from "@chakra-ui/icons";
import {Flex, Stack, Text} from "@chakra-ui/react";

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
