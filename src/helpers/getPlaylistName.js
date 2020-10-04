const getPlaylistName = async (spotifyApi, identifier) => {
  try {
    const cleaned = identifier.replace("spotify:playlist:", "");
    const data = await spotifyApi.getPlaylist(cleaned);
    return data.body.name;
  } catch (e) {
    console.log("Error getting playlist name from given ID");
    return "don't recognize that playlist ID";
  }
};

module.exports = getPlaylistName;
