require("dotenv").config();

const generateRandomString = require("../helpers/generateRandomString");
const querystring = require("querystring");

const client_id = process.env.CID;
const env = process.env.NODE_ENV;

const redirect_uri =
  env === "production"
    ? "https://radio-nachos.herokuapp.com/callback"
    : "http://localhost:8888/callback";
// const redirect_uri = "https://www.porknachos.com/node/spotify-callback";

module.exports = function (req, res) {
  const state = generateRandomString(16);
  const scope =
    "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming app-remote-control user-read-email user-read-private playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-library-modify user-library-read user-top-read user-read-playback-position user-read-recently-played user-follow-read user-follow-modify";
  res.cookie("spotify_auth_state", state);
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id,
        scope,
        redirect_uri,
        state,
      })
  );
};
