const getVideoIDIfYoutubeUrl = (str: string): string => {
  let songID = "";
  if (str.includes("?v=") && str.includes("youtube.")) {
    str.indexOf("?v=")
      ? (songID = str.slice(str.indexOf("?v=") + 3))
      : (songID = str.slice(str.lastIndexOf("/") + 1));
  }

  return songID;
};

export default getVideoIDIfYoutubeUrl;
