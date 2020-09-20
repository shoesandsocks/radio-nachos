require("dotenv").config();
const express = require("express"); // Express web server framework
const request = require("request"); // "Request" library
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const SpotifyApi = require("spotify-web-api-node");

const makeSpotifyPlaylist = require("./helpers/makeSpotifyPlaylist");

const spotifyApi = new SpotifyApi();
const port = process.env.PORT;
const client_id = process.env.CID;
const client_secret = process.env.CS;
const redirect_uri = `http://localhost:${port}/callback`;
// const redirect_uri = "https://www.porknachos.com/node/spotify-callback";

const generateRandomString = require("./helpers/generateRandomString");
const app = express();

app
  .use(
    express.static(__dirname + "/public", {
      extensions: ["html"],
    })
  )
  .use(cors())
  .use(cookieParser())
  .use(express.urlencoded({ extended: true }))
  .use(express.json());

app.get("/login", function (req, res) {
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
});

app.get("/callback", function (req, res) {
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
        spotifyApi.setAccessToken(access_token);
        res.redirect(`loggedin`);
      } else {
        res.redirect(`/#${querystring.stringify({ error: "invalid_token" })}`);
      }
    });
  }
});
app.get("/make", async (req, res) => {
  const numberOfTracks = +req.query.tracks || 10;
  // TODO: a front-end that can build a dataset like this:
  const eightiesId = "1EQ6eMB19i1XedKO4kpBW0";
  const weirdsiesId = "2UVIa3qRKV7CMoSrF4ENvR";
  const zeroesId = "3bBIkuqDS0cEGUBSblHfzT";
  const tensId = "2jIEdsThLWpmvz4t13kCX9";
  const elevatorId = "0NUtHPgeWm833NU14csQZi";
  const mix = [
    [eightiesId, 33],
    [zeroesId, 25],
    [tensId, 21],
    [weirdsiesId, 19],
    [elevatorId, 2],
  ];
  const [listId, timestamp] = await makeSpotifyPlaylist(
    spotifyApi,
    numberOfTracks,
    mix
  );
  res.redirect(`radio?${querystring.stringify({ listId, timestamp })}`);
});

app.get("/getPrev", async (req, res) => {
  try {
    const me = await spotifyApi.getMe();
    const { id } = me.body;
    const all = await spotifyApi.getUserPlaylists(id);
    const playlists = all.body.items.filter((p) =>
      p.name.match(/^college\-radio\-/)
    );
    return res.json(playlists);
  } catch (e) {
    res.json({ error: "nope " });
  }
});

app.listen(port, () => console.log(`Listening on ${port}`));
