import { TextChannel } from "discord.js";
import { createSimpleEmbed } from "../functions/embeds";
import { playing, queue, skipSong } from "../functions/music";
import { Command } from "../types/command";

const remove = ({
  client,
  guildID,
  message,
  arg,
}: Pick<Command, "client" | "guildID" | "message" | "arg">) => {
  if (guildID && playing[guildID]) {
    if (parseInt(arg as string) === 0) {
      skipSong(client, guildID, message?.channel as TextChannel);
    } else if (queue[guildID].length > arg && arg > 0) {
      message?.channel.send(
        createSimpleEmbed(
          "error",
          `Removed ${queue[guildID][arg as number].result.title} from queue`
        )
      );
      queue[guildID].splice(arg as number, 1);
    } else if (queue[guildID].length <= arg || arg < 0) {
      message?.channel.send(createSimpleEmbed("error", `Invalid index`));
    }
  }
};

export default remove;
