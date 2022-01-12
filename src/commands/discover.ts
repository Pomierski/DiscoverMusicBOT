import random from "random";
import { addDiscoveryToDb } from "../../models/discoveryModel";
import channelsJSON from "../../music-channels.json";
import {
  createEmbedForVideo,
  createSimpleEmbed,
  createVideoQueuedEmbed,
} from "../functions/embeds";
import {
  addSongToQueue,
  getVideoFromChannel,
  playing,
  playYTAudioOnChannel,
} from "../functions/music";
import { Channels } from "../types/channels";
import { Command } from "../types/command";

interface Discover
  extends Pick<Command, "client" | "message" | "arg" | "guildID"> {
  amount: number | string;
}

const channels: Channels = channelsJSON;

export const discover = async ({
  client,
  message,
  arg,
  guildID,
  amount = 0,
}: Discover) => {
  if (!message.guild) return;
  if (Object.keys(channels).includes((arg as string).toLowerCase())) {
    amount = parseInt(amount as string);
    if (amount > 5)
      return message.channel.send(createSimpleEmbed("error", "Max 5 songs!"));
    if (isNaN(amount))
      return message.channel.send(
        createSimpleEmbed("error", "Invalid number of songs")
      );
    do {
      const randomChannel =
        channels[arg as string][random.int(0, channels[arg].length - 1)];
      const result = await getVideoFromChannel(randomChannel, arg as string);

      if (!result || !message?.member?.voice.channel) return;

      addSongToQueue(
        result,
        guildID,
        message.member.voice.channel,
        randomChannel
      );
      if (playing[guildID]) {
        message.channel.send(
          createVideoQueuedEmbed(result, message.author.toString())
        );
      } else {
        message.channel.send(createEmbedForVideo(result, randomChannel));
        playYTAudioOnChannel(client, message, result.id, guildID);
      }
      addDiscoveryToDb(
        result.id,
        message.author.id,
        message.author.username,
        message.author.displayAvatarURL(),
        new Date(),
        message.guild.id,
        message.guild.name
      );
      if (isNaN(amount)) amount = 0;
      else amount--;
    } while (amount > 0);
  }
};
