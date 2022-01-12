import { Client, Message } from "discord.js";

export interface Command {
  guildID: string;
  client: Client;
  message: Message;
  arg: string | number;
  args: string[];
}
