import Discord, { MessageEmbed } from "discord.js";
import { VideoCompact } from "youtubei";
import channelsJSON from "../../music-channels.json";
import { Channels } from "../types/channels";

const channels: Channels = channelsJSON;

export const checkIfGenreExistOnList = (genre: string) =>
  Object.keys(channels).includes(genre);

export const createVideoQueuedEmbed = (video: VideoCompact, username: string) =>
  createSimpleEmbed(
    "#b2ff59",
    `⏭️ Queued ${video.title}`,
    `Requested by ${username}`
  ).setURL(`https://www.youtube.com/watch?v=${video.id}`);

export const createEmbedForVideo = (video: VideoCompact, channel: string) =>
  new Discord.MessageEmbed()
    .setColor("#b2ff59")
    .setTitle(`▶️ Playing: ${video.title}`)
    .setURL(`https://www.youtube.com/watch?v=${video.id}`)
    .setDescription(
      `🎧 [${channel}](https://www.youtube.com/results?search_query=${encodeURI(
        channel
      )})`
    )
    .setThumbnail(video.thumbnails[video.thumbnails.length - 1].url)
    .setTimestamp();

export const createGenresEmbed = (): MessageEmbed => {
  const embed = new Discord.MessageEmbed()
    .setColor("#b2ff59")
    .setTitle("Genres to discover 🎶")
    .setTimestamp();

  let desc = "";

  Object.keys(channels).forEach((channel) => {
    desc += `➡️ ${channel.slice(0, 1).toUpperCase() + channel.slice(1)} \n`;
  });

  embed.setDescription(desc);

  return embed;
};

export const createSimpleEmbed = (
  color: string,
  title: string,
  description?: string
) => {
  switch (color) {
    case "default":
      color = "b2ff59";
      break;
    case "error":
      color = "#ff0000";
      break;
    default:
      break;
  }
  const embed = new Discord.MessageEmbed().setTitle(title).setTimestamp();
  if (color) embed.setColor(color);
  if (description) embed.setDescription(description);
  return embed;
};

export const createGenreChannelsEmbed = (genre: string) => {
  if (!checkIfGenreExistOnList(genre))
    return new Discord.MessageEmbed()
      .setColor("#ff0000")
      .setTitle(`❌ Genre not found, sorry!`)
      .setDescription("To check avaliable genres use $genres command!")
      .setTimestamp();
  const embed = new Discord.MessageEmbed()
    .setColor("#b2ff59")
    .setTitle(`Channels providing ${genre} genre music 🎶`)
    .setTimestamp();

  let desc = "";

  channels[genre].forEach((channel: string) => {
    desc += `[➡️ ${
      channel.slice(0, 1).toUpperCase() + channel.slice(1)
    }](https://www.youtube.com/results?search_query=${encodeURI(
      channel
    )}) \n \n`;
  });

  embed.setDescription(desc);

  return embed;
};
