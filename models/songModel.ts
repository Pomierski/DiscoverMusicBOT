const mongoose = require("mongoose");
const { Schema, model } = mongoose;

export const songSchema = new Schema({
  id: String,
  title: String,
  channel: String,
  genre: String,
  thumbnailUrl: String,
});

export const songModel = model("songs", songSchema);

export const addSongToDb = (
  id: string,
  title: string,
  channel: string,
  genre: string,
  thumbnailUrl: string
) => {
  const song = new songModel({
    id: id,
    title: title,
    channel: channel,
    genre: genre,
    thumbnailUrl: thumbnailUrl,
  });
  song.save();
};
