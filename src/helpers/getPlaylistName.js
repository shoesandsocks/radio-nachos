const getPlaylistName = async (spotifyApi, identifier) => {
  try {
    const data = await spotifyApi.getPlaylist(identifier);
    return data.body.name;
  } catch (e) {
    console.log("Error getting playlist name from given ID");
    return "dunno that playlist ID";
  }
};

module.exports = getPlaylistName;
