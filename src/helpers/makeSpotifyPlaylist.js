const picker = require("./picker");
const now = require("./now");

module.exports = async (spotifyApi, numberOfTracks, mix) => {
  try {
    const timestamp = now();
    const me = await spotifyApi.getMe();
    const { id } = me.body;
    const list = await spotifyApi.createPlaylist(
      id,
      `college-radio-${timestamp}`
    );
    const listId = list.body.id;
    console.log(spotifyApi, numberOfTracks, mix);
    const tracksToAdd = await picker(spotifyApi, numberOfTracks, mix);
    const addEm = await spotifyApi.addTracksToPlaylist(listId, tracksToAdd);
    return [listId, timestamp];
  } catch (error) {
    console.log({ error });
    console.log("naaah");
    return [];
  }
};
