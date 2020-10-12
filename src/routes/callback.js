require("dotenv").config();

const request = require("request"); // "Request" library
const SpotifyApi = require("spotify-web-api-node");
const querystring = require("querystring");

const client_id = process.env.CID;
const client_secret = process.env.CS;

const env = process.env.NODE_ENV;
const redirect_uri =
  env === "production"
    ? "https://radio-nachos.herokuapp.com/callback"
    : "http://localhost:8888/callback";
// const redirect_uri = "https://www.porknachos.com/node/spotify-callback";

module.exports = function (req, res) {
  const { code, state } = req.query || null;
  const storedState = req.cookies ? req.cookies["spotify_auth_state"] : null;

  if (state === null || state !== storedState) {
    res.redirect(`/#${querystring.stringify({ error: "state_mismatch" })}`);
  } else {
    res.clearCookie("spotify_auth_state");
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: { code, redirect_uri, grant_type: "authorization_code" },
      headers: {
        Authorization: `Basic ${Buffer.from(
          client_id + ":" + client_secret
        ).toString("base64")}`,
      },
      json: true,
    };
    request.post(authOptions, async function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const { access_token, refresh_token } = body;
        const spotifyApi = new SpotifyApi();
        spotifyApi.setAccessToken(access_token);
        const me = await spotifyApi.getMe();
        req.session.user = { id: me.body.id, spotToken: access_token };
        res.redirect("react");
      } else {
        res.redirect(`/#${querystring.stringify({ error: "invalid_token" })}`);
      }
    });
  }
};
