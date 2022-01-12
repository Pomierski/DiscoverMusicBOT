# DiscoverMusicBOT

## About
One of my older projects that I recently somewhat tweaked to be usable. 
Currently working on another music bot, that won't upset youtube with playing music.
For now it will stay at current state, just as small fullstack project.

## Requirements

- ffmpeg
- mongodb
- node.js with npm

## How to use

Create config.json file in main directory

```
{
  "botToken": "Your Discord bot token",
  "botPrefix": "$",
  "mongoAuth": "MongoDB url e.g mongodb://localhost:27017/",
  "mongoPort": 3000
}
```

Then

`npm install`
`npm start
