import Discord, { Message, TextChannel } from "discord.js";
import mongoose from "mongoose";
import config from "./config.json";
import handleCommands from "./src/commands/handleCommands";
import { playQueue } from "./src/functions/music";

const client = new Discord.Client();

const PREFIX = config.botPrefix;

mongoose.connect(config.mongoAuth, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB: Connection error:"));

db.once("open", function () {
  console.log("MongoDB: Connection established");
});

client.on("playQueue", (guildID: string, channel: TextChannel) => {
  playQueue(client, guildID, channel);
});

client.on("ready", () => {
  console.log(`Discord-Bot: Logged in as ${client?.user?.tag}!`);
});

client.on("message", async (message: Message) => {
  handleCommands(client, PREFIX, message);
});

client.login(config.botToken);
