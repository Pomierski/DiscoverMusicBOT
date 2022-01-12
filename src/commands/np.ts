import { createSimpleEmbed } from "../functions/embeds";
import { playing, youtubeClient } from "../functions/music";
import { Command } from "../types/command";

const np = async ({
  message,
  guildID,
}: Pick<Command, "message" | "guildID">) => {
  if (guildID && playing[guildID]) {
    const video = await youtubeClient.getVideo(playing[guildID] as string);
    if (video) {
      message.channel.send(
        createSimpleEmbed("default", video.title).setURL(
          `https://www.youtube.com/watch?v=${video.id}`
        )
      );
    }
  } else {
    message.channel.send(createSimpleEmbed("error", "Nothing playing..."));
  }
};

export default np;
