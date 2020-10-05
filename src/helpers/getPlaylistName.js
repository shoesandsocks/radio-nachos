const getPlaylistName = async (spotifyApi, identifier) => {
  try {
    const cleaned = identifier.replace("spotify:playlist:", "");
    const data = await spotifyApi.getPlaylist(cleaned);
    return { playlistName: data.body.name };
  } catch (e) {
    return { error: "Error getting playlist name from given ID" };
  }
};

module.exports = getPlaylistName;
