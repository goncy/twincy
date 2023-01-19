"use client";

import {useState, useEffect} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Box, Flex, Image, Text} from "@chakra-ui/react";

import {useSocket} from "@/socket/context";

interface Message {
  id: string;
  sender: {
    badges: string[];
    name: string;
  };
  timestamp: number;
  message: string;
  color: string;
  isHighlighted: boolean;
}

const TickerClientScreen = () => {
  const socket = useSocket();
  const [selected, setSelected] = useState<null | Message>(null);

  useEffect(() => {
    function handleSelect(message: Message) {
      setSelected(message);
    }

    // Set handler
    socket.on("messages:select", handleSelect);

    return () => {
      // Remove handler
      socket.off("messages:select", handleSelect);
    };
  }, [socket]);

  return (
    <Box bottom={0} padding={6} position="absolute" width="100%">
      <AnimatePresence>
        {selected && (
          <motion.main
            animate={{scale: 1, opacity: 1}}
            exit={{scale: 0.9, opacity: 0}}
            initial={{scale: 0.9, opacity: 0}}
            style={{marginTop: "auto"}}
            transition={{type: "spring", duration: 0.5}}
          >
            <Flex
              backgroundColor="primary.500"
              borderRadius="lg"
              color="white"
              direction="column"
              padding={6}
              shadow="lg"
            >
              <Box
                alignItems="center"
                display="inline-flex"
                fontSize="3.2rem"
                fontWeight={500}
                gap={4}
                lineHeight="normal"
                marginBottom={1}
                textTransform="uppercase"
              >
                {Boolean(selected.sender.badges?.length) && (
                  <Box as="span" display="inline-flex" gap={2}>
                    {selected.sender.badges?.map((badge) => (
                      <Image key={badge} alt={badge} height={10} src={badge} width={10} />
                    ))}
                  </Box>
                )}
                <span dangerouslySetInnerHTML={{__html: selected.sender.name}} />
              </Box>
              <Text
                dangerouslySetInnerHTML={{__html: selected.message}}
                display="inline-block"
                fontSize="2.25rem"
                fontWeight={400}
                lineHeight="130%"
                sx={{
                  "& i": {
                    width: 6,
                    height: 6,
                    margin: "auto 4px",
                    display: "inline-block",
                    verticalAlign: "sub",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  },
                }}
              />
            </Flex>
          </motion.main>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default TickerClientScreen;
