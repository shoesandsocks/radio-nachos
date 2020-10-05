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
    const { tracksToAdd, compositionData } = tracksAndCompositionData;
    const addEm = await spotifyApi.addTracksToPlaylist(listId, tracksToAdd);
    if (addEm.statusCode === 201) {
      return { listId, compositionData, timestamp };
    }
    // it failed; undo the playlist
    const remov = await spotifyApi.unfollowPlaylist(listId);
    return { error: "makeSpotifyPlaylist failed." };
  } catch (err) {
    console.log(err);
    // this return mocks empty version of success?
    return ["", [], now()];
  }
};
