import { VideoCompact } from "youtubei";
import getVideoIDIfYoutubeUrl from "../functions/checkIfYoutubeUrl";
import { createSimpleEmbed, createVideoQueuedEmbed } from "../functions/embeds";
import { addSongToQueue, playing, youtubeClient } from "../functions/music";
import { Command } from "../types/command";

const play = async ({ client, message, arg, args, guildID }: Command) => {
  if (message?.member?.voice.channel) {
    let songID = getVideoIDIfYoutubeUrl(arg as string);
    let result;
    if (songID.length) {
      result = await youtubeClient.getVideo(songID);
    } else {
      const search = await youtubeClient.search([arg, ...args].join(" "));
      if (search.length === 0)
        return message.channel.send(
          createSimpleEmbed("error", "nothing found")
        );
      result = search[0];
    }
    if (!result) return;
    addSongToQueue(
      result as VideoCompact,
      guildID,
      message.member.voice.channel,
      (result as VideoCompact)?.channel?.name as string
    );
    if (!playing[guildID]) {
      await message.member.voice.channel.join();
      client.emit("playQueue", guildID, message.channel);
    } else {
      message.channel.send(
        createVideoQueuedEmbed(
          result as VideoCompact,
          message.author.toString()
        )
      );
    }
  }
};

export default play;
