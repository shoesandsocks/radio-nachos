const getWholePlaylist = async (
  spotifyApi,
  identifier,
  offset = 0,
  limit = 100,
  accumulator = []
) => {
  const chunk = await spotifyApi.getPlaylistTracks(identifier, {
    offset,
    limit,
  });
  const items = chunk.body.items.map((it) => it.track.id);
  const newArr = accumulator.concat(...items);
  if (chunk.body.total > offset + limit) {
    return getWholePlaylist(
      spotifyApi,
      identifier,
      offset + limit,
      limit,
      newArr
    );
  }
  return newArr;
};

module.exports = getWholePlaylist;
