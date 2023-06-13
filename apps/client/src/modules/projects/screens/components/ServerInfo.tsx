"use-client";

import { Avatar, Flex, Select, Text } from "@chakra-ui/react";
import { type APIChannel, type APIGuild } from "discord-api-types/v10";
import { useEffect, useState } from "react";

import api from "@/discord/api";

interface ServerInfoProps {
  onChangeChannel: (channel: APIChannel) => APIChannel;
  guildID: APIGuild["id"];
}

export default function ServerInfo({onChangeChannel, guildID}: ServerInfoProps) {
  const [guildsDetail, setGuildsDetail] = useState<APIGuild | null>(null);
  const [channels, setChannels] = useState<APIChannel[] | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<APIChannel | null>(null);

  const getGuildsInfo = async (guildID: APIGuild["id"]) => {
    const guild = await api.guild.fetch(guildID);
    const channels = await api.guild.fetchChannels(guildID);
    const onlyTextChannels = channels.filter((channel) => channel.type === 0);

    setGuildsDetail(guild);
    setChannels(onlyTextChannels);

    const savedChannelID = localStorage.getItem("channel_id");

    if (savedChannelID) {
      const channel = onlyTextChannels.find(({id}) => id === savedChannelID);

      if (channel) {
        onChangeChannel(channel);
        setSelectedChannel(channel);
      }
    }
  };

  const handleChangeChannel = (event: React.ChangeEvent) => {
    const target = event.target as HTMLSelectElement;
    const id = target.value;
    const channel = channels?.find((channel) => channel.id === id)!;

    onChangeChannel(channel);
    setSelectedChannel(channel);
    localStorage.setItem("channel_id", channel.id);
  };

  useEffect(() => {
    getGuildsInfo(guildID);
  }, []);

  return (
    <>
      {guildsDetail ? (
        <Flex alignItems="center" gap={3}>
          <Avatar
            size="lg"
            src={`https://cdn.discordapp.com/icons/${guildsDetail.id}/${guildsDetail.icon}`}
          />
          <Text
            borderRight={4}
            borderRightColor="gray.300"
            borderRightStyle="solid"
            fontSize={"3xl"}
            fontWeight={"semibold"}
            paddingRight={4}
          >
            {guildsDetail.name}
          </Text>
          <Select value={selectedChannel?.id ?? ""} onChange={handleChangeChannel}>
            <option disabled value="">
              Seleccionar canal
            </option>
            {channels?.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {`# ${channel.name}`}
              </option>
            ))}
          </Select>
        </Flex>
      ) : null}
    </>
  );
}
