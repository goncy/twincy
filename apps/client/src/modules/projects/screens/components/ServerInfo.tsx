"use-client";

import { Avatar, Flex, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import api from "@/discord/api";
import { Channel, Guild } from "@/discord/interface";

const guildID = "505180649787752450";

interface ServerInfoProps {
  onChangeChannel: (channel: Channel) => Channel;
}

export default function ServerInfo({onChangeChannel}: ServerInfoProps) {
  const [guildsDetail, setGuildsDetail] = useState<Guild | null>(null);
  const [channels, setChannels] = useState<Channel[] | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  const getGuildsInfo = async (guildID: Guild["id"]) => {
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
