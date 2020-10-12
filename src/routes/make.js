const SpotifyApi = require("spotify-web-api-node");

const makeSpotifyPlaylist = require("../helpers/makeSpotifyPlaylist");

module.exports = async function (req, res) {
  try {
    const { collection } = req.database;
    const { spotToken } = req.session.user;
    const spotifyApi = new SpotifyApi();
    spotifyApi.setAccessToken(spotToken);
    const { arrayOfArrays, numberOfTracks } = req.body;
    // const eightiesId = "1EQ6eMB19i1XedKO4kpBW0";
    // const mix = [
    //   [eightiesId, 100],
    // ];
    const {
      error,
      listId,
      compositionData,
      timestamp,
    } = await makeSpotifyPlaylist(spotifyApi, numberOfTracks, arrayOfArrays);
    if (!error) {
      const newEntry = await collection.insertOne({
        timestamp: timestamp.toString(),
        numberOfTracks,
        listId,
        compositionData,
      });
      if (newEntry.result.ok === 1) {
        return res.json({ listId, timestamp });
      }
      return res.json({
        error: "something went wrong writing to database",
      });
    }
    return res.json({ error });
  } catch (err) {
    console.log("make err -> ", err);
    if (err.statusCode === 401) {
      return res.json({ error: "Try logging in again; sorry." });
    }
    return res.json({ error: "Something failed. Are you logged in?" });
  }
};
