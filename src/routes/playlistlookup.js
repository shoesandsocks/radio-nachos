const SpotifyApi = require("spotify-web-api-node");

const getPlaylistName = require("../helpers/getPlaylistName");

module.exports = async function (req, res) {
  try {
    const { spotToken } = req.session.user;
    const spotifyApi = new SpotifyApi();
    spotifyApi.setAccessToken(spotToken);
    const { str } = req.body;
    ident = str.replace("spotify:playlist:", "");
    const { error, playlistName } = await getPlaylistName(spotifyApi, ident);
    return error ? res.json({ error }) : res.json({ name: playlistName });
  } catch (e) {
    console.log(e);
    return res.json({ error: JSON.stringify(e) });
  }
};
