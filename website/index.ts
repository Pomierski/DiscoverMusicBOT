import express, { Request, Response } from "express";
import { connect } from "mongoose";
import config from "../config.json";
import { discoveryModel } from "../models/discoveryModel";
import { songModel } from "../models/songModel";
const app = express();
const port = config.mongoPort;

app.use("/static", express.static(__dirname + "/public"));
app.set("view engine", "pug");
app.set("views", "./public/views");

connect(config.mongoAuth, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/:guildID", async (req: Request, res: Response) => {
  const guildID = req.params.guildID;

  const discoveries = await discoveryModel.find({ guildID: guildID });

  if (discoveries.length === 0) {
    return res.render("404");
  }

  for (const discovery of discoveries) {
    const songInfo = await songModel.findOne({ id: discovery.songID });
    discovery.songInfo = songInfo;
  }

  return res.render("index", { discoveries: discoveries });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
