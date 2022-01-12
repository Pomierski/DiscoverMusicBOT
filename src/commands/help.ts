import Discord from "discord.js";
import { Command } from "../types/command";

const helpContent = new Discord.MessageEmbed()
  .setColor("#0099ff")
  .setTitle("Available commands")
  .setURL("https://github.com/Pomierski/DiscoverMusicBOT-private")
  .addFields(
    {
      name: "🔹 play [query / youtube url]",
      value:
        "Loads your input and adds it to the queue; If there is no playing track, then it will start playing",
    },
    { name: "🔹 skip", value: "Skips to the next song" },
    { name: "🔹 np", value: "Displays info about the currently playing track" },
    {
      name: "🔹 genres",
      value: "Displays info about available genres to discover",
    },
    {
      name: "🔹 genre [genre name]",
      value: "Displays info about channels used for provided genre",
    },
    {
      name: "🔹 discover [youtube url]",
      value:
        "Loads your input and adds dicovered track to the queue; If there is no playing track, then it will start playing",
    },
    {
      name: "🔹 shuffle",
      value: "Shuffles queue",
    },
    {
      name: "🔹 queue",
      value: "Displays queue",
    },
    {
      name: "🔹 remove [song position in queue]",
      value: "Removes song from queue",
    }
  )
  .setTimestamp();

const help = ({ message }: Pick<Command, "message">) => {
  message.channel.send(helpContent);
};

export default help;
