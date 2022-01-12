import {
  Client,
  Message,
  MessageEmbed,
  TextChannel,
  VoiceChannel,
  VoiceConnection,
} from "discord.js";
import random from "random";
import shuffle from "shuffle-array";
import * as Youtube from "youtubei";
import ytdl from "ytdl-core";
import { addSongToDb, songModel } from "../../models/songModel";
import { createEmbedForVideo, createSimpleEmbed } from "./embeds";

export const youtubeClient = new Youtube.Client();

export const queue: Queue = {};
export const playing: Playing = {};

interface QueueItem {
  result: Youtube.VideoCompact;
  voiceChannel: VoiceChannel;
  channel: string;
}

type Queue = {
  [key: string]: QueueItem[];
};

type Playing = {
  [key: string]: string | null;
};

type InactiveConnections = {
  [key: string]: NodeJS.Timeout;
};
let inactiveConnections: InactiveConnections = {};

export const setConnectionToInactive = (
  guildID: string,
  connection: VoiceConnection
) => {
  if (guildID in inactiveConnections)
    clearTimeout(inactiveConnections[guildID]);
  inactiveConnections[guildID] = setTimeout(() => {
    if (connection) connection.disconnect();
  }, 30000);
};

export const skipSong = (
  client: Client,
  guildID: string,
  channel: TextChannel
) => {
  if (playing[guildID]) queue[guildID].shift();

  if (queue[guildID].length === 0) {
    client?.voice?.connections?.get(guildID)?.channel.leave();
    playing[guildID] = null;
  } else {
    client.emit("playQueue", guildID, channel);
  }
};

export const getVideoFromChannel = async (
  channelName: string,
  genre: string
) => {
  const channel = await youtubeClient.findOne(channelName, { type: "channel" });
  if (channel) {
    await channel.nextVideos();
    channel.videos.forEach(async (video: Youtube.VideoCompact) => {
      const find = await songModel.find({ id: video.id });
      if (find.length === 0) {
        const thumbnail = video.thumbnails[video.thumbnails.length - 1].url;
        addSongToDb(video.id, video.title, channelName, genre, thumbnail);
      }
    });

    const randomVideo =
      channel.videos[random.int(0, channel.videos.length - 1)];
    return randomVideo;
  }
};

export const getAudioStreamFromVideo = (ytID: string) =>
  ytdl(`https://www.youtube.com/watch?v=${ytID}`, {
    filter: "audioonly",
  });

export const playQueue = async (
  client: Client,
  guildID: string,
  channel: TextChannel
) => {
  clearTimeout(inactiveConnections[guildID]);
  const song = queue[guildID][0];
  const connection = await client?.voice?.connections
    ?.get(guildID)
    ?.channel.join();
  if (connection) {
    const stream = getAudioStreamFromVideo(song.result.id);
    const dispatcher = connection.play(stream);
    channel.send(createEmbedForVideo(song.result, song.channel));
    playing[guildID] = song.result.id;
    dispatcher.on("finish", () => {
      queue[guildID].shift();
      playing[guildID] = null;
      if (queue[guildID].length) {
        playQueue(client, guildID, channel);
      } else setConnectionToInactive(guildID, connection);
    });
  }
};

export const addSongToQueue = (
  result: Youtube.VideoCompact,
  guildID: string,
  voiceChannel: VoiceChannel,
  channel: string
) => {
  clearTimeout(inactiveConnections[guildID]);
  const nextSong = {
    result: result,
    voiceChannel: voiceChannel,
    channel: channel,
  };
  queue[guildID]
    ? queue[guildID].push(nextSong)
    : (queue[guildID] = [nextSong]);
};

export const shuffleQueue = (guildID: string): MessageEmbed => {
  if (playing[guildID]) {
    if (queue[guildID].length > 2) {
      const arrSliceToShuffle = queue[guildID].slice(1);
      const shuffledSlice = shuffle(arrSliceToShuffle);
      queue[guildID] = [queue[guildID][0], ...shuffledSlice];
      return createSimpleEmbed("default", "🔄 Shuffled queue");
    }
    if (queue[guildID].length < 2) {
      return createSimpleEmbed(
        "error",
        "❌ Not enough songs in queue to shuffle"
      );
    }
  }
  if (!playing[guildID]) {
    return createSimpleEmbed("error", "❌ Nothing playing...");
  }
  return createSimpleEmbed("error", "❌ Unexpected error...");
};

export const playYTAudioOnChannel = async (
  client: Client,
  message: Message,
  ytID: string,
  guildID: string
) => {
  if (playing[guildID]) return;
  if (message?.member?.voice.channel) {
    clearTimeout(inactiveConnections[guildID]);
    const connection = await message.member.voice.channel.join();
    const stream = getAudioStreamFromVideo(ytID);
    const dispatcher = connection.play(stream);
    playing[guildID] = ytID;
    dispatcher.on("finish", () => {
      playing[guildID] = null;
      queue[guildID].shift();
      if (queue[guildID].length) {
        client.emit("playQueue", guildID, message.channel);
      } else setConnectionToInactive(guildID, connection);
    });
  } else if (!message?.member?.voice.channel) {
    message.reply("Join voice channel first!");
  }
};
