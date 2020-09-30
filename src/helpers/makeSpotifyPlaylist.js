const picker = require("./picker");
const now = require("./now");

module.exports = async (spotifyApi, numberOfTracks, mix) => {
  try {
    const timestamp = now();
    const me = await spotifyApi.getMe();
    const { id } = me.body;
    const list = await spotifyApi.createPlaylist(
      id,
      `radio-nachos-${timestamp}`
    );
    const listId = list.body.id;
    const tracksAndCompositionData = await picker(
      spotifyApi,
      numberOfTracks,
      mix
    );
    console.log("gloop: ", tracksAndCompositionData);
    const { tracksToAdd, compositionData } = tracksAndCompositionData;
    const addEm = await spotifyApi.addTracksToPlaylist(listId, tracksToAdd);
    return [listId, compositionData, timestamp];
  } catch (error) {
    console.log({ error });
    console.log("naaah");
    return [];
  }
};
