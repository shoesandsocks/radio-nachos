const getWholePlaylist = async (
  spotifyApi,
  identifier,
  offset = 0,
  limit = 100,
  accumulator = []
) => {
  const cleanedIdentifier = identifier.replace("spotify:playlist:", "");
  try {
    const chunk = await spotifyApi.getPlaylistTracks(cleanedIdentifier, {
      offset,
      limit,
    });
    const items = chunk.body.items.map((it) => it.track.id);
    const newArr = accumulator.concat(...items);
    if (chunk.body.total > offset + limit) {
      return getWholePlaylist(
        spotifyApi,
        cleanedIdentifier,
        offset + limit,
        limit,
        newArr
      );
    }
    return newArr;
  } catch (e) {
    console.log("Error getting whole playlist from given ID");
    return [];
  }
};

module.exports = getWholePlaylist;
