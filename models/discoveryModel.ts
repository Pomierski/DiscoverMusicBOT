const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const discoverySchema = new Schema({
  songID: String,
  authorID: String,
  authorName: String,
  authorAvatarURL: String,
  when: Date,
  guildID: String,
  guildName: String,
});

export const discoveryModel = model("discovery", discoverySchema);

export const addDiscoveryToDb = (
  songID: string,
  authorID: string,
  authorName: string,
  authorAvatarURL: string,
  when = new Date(),
  guildID: string,
  guildName: string
) => {
  const discovery = new discoveryModel({
    songID: songID,
    authorID: authorID,
    authorName: authorName,
    authorAvatarURL: authorAvatarURL,
    when: when,
    guildID: guildID,
    guildName: guildName,
  });
  discovery.save();
};
