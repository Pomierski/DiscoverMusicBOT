import { createSimpleEmbed } from "../functions/embeds";
import { playing, queue } from "../functions/music";
import { Command } from "../types/command";

const sendQueue = ({
  guildID,
  message,
}: Pick<Command, "guildID" | "message">) => {
  const queueEmbed = createSimpleEmbed("default", "🔊 Queue");

  if (playing[guildID]) {
    queue[guildID].forEach((song, i) => {
      queueEmbed.addField(
        `#${i + 1} — ${song.result.title}`,
        `[Video](https://www.youtube.com/watch?v=${
          song.result.id
        }) | [Channel](https://www.youtube.com/results?search_query=${encodeURI(
          song.channel
        )})`
      );
    });

    message.channel.send(queueEmbed);
  } else {
    message.channel.send(createSimpleEmbed("error", "❌ Nothing playing..."));
  }
};

export default sendQueue;
