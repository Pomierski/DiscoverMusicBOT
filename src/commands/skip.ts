import { Command } from "../types/command";

const { createSimpleEmbed } = require("../functions/embeds");
const { playing, skipSong } = require("../functions/music");

const skip = async ({
  client,
  message,
  guildID,
}: Pick<Command, "client" | "message" | "guildID">) => {
  if (playing[guildID]) {
    message.channel.send(
      createSimpleEmbed(
        "#298ce4",
        `⏩ Skip`,
        `Requested by ${message.author.toString()}`
      )
    );
    skipSong(client, guildID, message.channel);
  } else {
    const msg = await message.channel.send(
      createSimpleEmbed("#ff0000", `❌ Nothing playing`)
    );
    setTimeout(() => msg.delete(), 5000);
  }
};

export default skip;
