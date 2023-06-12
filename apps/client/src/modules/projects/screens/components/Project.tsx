import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { type APIMessage } from "discord-api-types/v10";

interface ProjectProps {
  message: APIMessage;
  selected: boolean;
  guildID: string;
  onVisitPage: () => void;
  onInitVotation: () => void;
  onCloseVotation: () => void;
  onEndVotation: () => void;
  onReject: () => void;
  onOmit: () => void;
  votingClosed: boolean;
}

export default function Project({
  message,
  onVisitPage,
  onCloseVotation,
  onEndVotation,
  onInitVotation,
  onReject,
  onOmit,
  selected,
  guildID,
  votingClosed,
}: ProjectProps) {
  const regex = /(https?:\/\/[^\s]+)/g;
  const links = message.content.match(regex);

  return (
    <Flex gap={5} marginY={8} padding={4}>
      <Box>
        <Avatar
          src={`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`}
        />
      </Box>
      <Box width={600}>
        <Text color="white" fontSize="xl">
          {message.author.username}
        </Text>
        <Text color="whiteAlpha.800" fontSize="md">
          {message.content}
        </Text>
        <Flex gap={3} marginTop={5}>
          {links && links.length > 1 ? (
            <Menu>
              <MenuButton
                _hover={{backgroundColor: "whiteAlpha.300"}}
                alignItems="center"
                background="whiteAlpha.200"
                borderRadius="md"
                display="inline-flex"
                fontSize="sm"
                fontWeight="semibold"
                paddingX={4}
                textAlign="center"
              >
                Visitar enlaces
              </MenuButton>
              <MenuList padding={0}>
                {links.map((link) => (
                  <MenuItem
                    key={link}
                    _hover={{textDecoration: "none", backgroundColor: "whiteAlpha.300"}}
                    alignItems="center"
                    as="a"
                    background="whiteAlpha.200"
                    display="inline-flex"
                    fontSize="sm"
                    fontWeight="semibold"
                    href={link}
                    paddingX={4}
                    paddingY={2}
                    target="_blank"
                    textAlign="center"
                    onClick={onVisitPage}
                  >
                    Visitar {link}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <Link
              _hover={{textDecoration: "none", backgroundColor: "whiteAlpha.300"}}
              alignItems="center"
              background="whiteAlpha.200"
              borderRadius="md"
              display="inline-flex"
              fontSize="sm"
              fontWeight="semibold"
              href={links?.[0]}
              paddingX={4}
              target="_blank"
              textAlign="center"
              onClick={onVisitPage}
            >
              Visitar
            </Link>
          )}

          {!selected && (
            <Button fontSize="sm" onClick={onInitVotation}>
              Iniciar votación
            </Button>
          )}
          {selected && (
            <>
              {!votingClosed && (
                <Button fontSize="sm" onClick={onCloseVotation}>
                  Pausar votación
                </Button>
              )}

              <Button fontSize="sm" onClick={onEndVotation}>
                Terminar votación
              </Button>
            </>
          )}

          <Menu>
            <MenuButton
              _hover={{backgroundColor: "whiteAlpha.300"}}
              alignItems="center"
              backgroundColor="whiteAlpha.200"
              borderRadius="md"
              display="inline-flex"
              fontWeight="semibold"
              paddingX={4}
            >
              :
            </MenuButton>
            <MenuList padding={0}>
              <MenuItem
                as="a"
                href={`https://discord.com/channels/${guildID}/${message.channel_id}/${message.id}`}
                target="_blank"
              >
                Ver mensaje en discord
              </MenuItem>
              <MenuItem as="button" backgroundColor="red.400" onClick={onReject}>
                Rechazar
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
      <CloseButton color="white" onClick={onOmit} />
    </Flex>
  );
}
