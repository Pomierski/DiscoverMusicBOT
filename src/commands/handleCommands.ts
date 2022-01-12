import { Client, Message } from "discord.js";
import {
  createGenreChannelsEmbed,
  createGenresEmbed,
} from "../functions/embeds";
import { shuffleQueue } from "../functions/music";
import { discover } from "./discover";
import help from "./help";
import leave from "./leave";
import np from "./np";
import play from "./play";
import remove from "./remove";
import sendQueue from "./sendQueue";
import skip from "./skip";

const handleCommands = async (
  client: Client,
  prefix: string,
  message: Message
) => {
  if (message.author.bot) return;
  if (message.content[0] === prefix) {
    const msg = message.content.split(" ");
    const command = msg[0].slice(1);
    const arg = msg[1];
    const args = [...msg.slice(2)];
    const guildID = message?.guild?.id;

    if (!guildID) return;

    switch (command) {
      case "discover": {
        discover({
          client: client,
          message: message,
          arg: arg,
          guildID: guildID,
          amount: args[0],
        });
      }

      case "leave": {
        leave({ client: client, guildID: guildID });
      }

      case "genres": {
        message.channel.send(createGenresEmbed());
      }

      case "genre": {
        message.channel.send(createGenreChannelsEmbed(arg.toLowerCase()));
      }

      case "skip": {
        skip({ client: client, message: message, guildID: guildID });
      }

      case "play": {
        play({
          client: client,
          message: message,
          arg: arg,
          args: args,
          guildID: guildID,
        });
      }

      case "np": {
        np({ message: message, guildID: guildID });
      }

      case "help": {
        help({ message: message });
      }

      case "shuffle": {
        message.channel.send(shuffleQueue(guildID));
      }
      case "queue": {
        sendQueue({ guildID: guildID, message: message });
      }
      case "remove": {
        remove({
          client: client,
          guildID: guildID,
          message: message,
          arg: arg,
        });
      }
    }
  }
};

export default handleCommands;
