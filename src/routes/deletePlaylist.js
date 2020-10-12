require("dotenv").config();
const SpotifyApi = require("spotify-web-api-node");

module.exports = async function (req, res) {
  try {
    const { collection } = req.database;
    const { idToDelete } = req.body;
    const listId = idToDelete.replace("playlist-", "");
    const { spotToken } = req.session.user;
    const spotifyApi = new SpotifyApi();
    spotifyApi.setAccessToken(spotToken);
    const SpotSuccess = await spotifyApi.unfollowPlaylist(listId);
    if (SpotSuccess.statusCode === 200) {
      return collection
        .deleteOne({ listId })
        .then(() => res.json({ message: `deleted` }))
        .catch((e) => {
          console.log(e);
          return res.json({ error: "failed to delete from database" });
        });
    } else {
      return res.json({ error: "failed to delete from Spotify" });
    }
  } catch (e) {
    console.log(e);
    return res.json({ error: "server screwup deleting from spotify" });
  }
};
