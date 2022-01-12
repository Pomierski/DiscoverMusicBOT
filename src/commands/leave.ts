import { playing, queue } from "../functions/music";
import { Command } from "../types/command";

const leave = async ({
  client,
  guildID,
}: Pick<Command, "client" | "guildID">) => {
  if (client?.voice?.connections?.get(guildID)?.channel) {
    const connection = await client?.voice?.connections
      ?.get(guildID)
      ?.channel.join();
    queue[guildID] = [];
    playing[guildID] = null;
    connection?.disconnect();
  }
};

export default leave;
