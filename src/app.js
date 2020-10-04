require("dotenv").config();
const path = require("path");
const express = require("express"); // Express web server framework
const request = require("request"); // "Request" library
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const SpotifyApi = require("spotify-web-api-node");
const MongoClient = require("mongodb").MongoClient;

const makeSpotifyPlaylist = require("./helpers/makeSpotifyPlaylist");
const getPlaylistName = require("./helpers/getPlaylistName");

const spotifyApi = new SpotifyApi();
const port = process.env.PORT;
const client_id = process.env.CID;
const client_secret = process.env.CS;
const redirect_uri = `http://localhost:${port}/callback`;
// const redirect_uri = "https://www.porknachos.com/node/spotify-callback";

const generateRandomString = require("./helpers/generateRandomString");
const app = express();

MongoClient.connect(
  process.env.MONGODB_URI,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log("Connected to Database");
    const db = client.db("radio-nachos");
    const collection = db.collection("playlists");
    // app.get("/react", (req, res) =>
    //   res.sendFile(path.join(__dirname, "build", "index.html"))
    // );
    app.use("/react", express.static(__dirname + "/build"));
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
      const storedState = req.cookies
        ? req.cookies["spotify_auth_state"]
        : null;

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
            res.redirect("react");
          } else {
            res.redirect(
              `/#${querystring.stringify({ error: "invalid_token" })}`
            );
          }
        });
      }
    });
    app.post("/deletePlaylist", (req, res) => {
      const { idToDelete } = req.body;
      // just in case FE passes wrong thing
      const listId = idToDelete.replace("playlist-", "");
      collection
        .deleteOne({ listId })
        .then(async () => {
          const SpotSuccess = await spotifyApi.unfollowPlaylist(listId);
        })
        .then(() => res.json({ message: `deleted` }))
        .catch((e) => {
          console.log(e);
          return res.sendStatus(500);
        });
    });
    app.post("/playlistlookup", async (req, res) => {
      const { str } = req.body;
      ident = str.replace("spotify:playlist:", "");
      const name = await getPlaylistName(spotifyApi, ident);
      if (name) return res.json({ name });
      return res.json({ error: "not found " });
    });
    app.post("/make", async (req, res) => {
      try {
        const { arrayOfArrays, numberOfTracks } = req.body;
        // const eightiesId = "1EQ6eMB19i1XedKO4kpBW0";
        // const mix = [
        //   [eightiesId, 100],
        // ];
        const [listId, compositionData, timestamp] = await makeSpotifyPlaylist(
          spotifyApi,
          numberOfTracks,
          arrayOfArrays
        );
        const newEntry = await collection.insertOne({
          timestamp: timestamp.toString(),
          numberOfTracks,
          listId,
          compositionData,
        });
        return res.json({ listId, timestamp });
      } catch (err) {
        console.log("make err -> ", err);
        return res.json({ error: "Something failed in making " });
      }
    });

    app.get("/getPrev", async (req, res) => {
      try {
        const me = await spotifyApi.getMe();
        const { id } = me.body;
        const allPlaylistIds = await spotifyApi.getUserPlaylists(id);
        const playlists = allPlaylistIds.body.items.filter((p) =>
          p.name.match(/^radio\-nachos\-/)
        );
        const dbLookup = playlists.map((_) =>
          _.name.replace(/^radio\-nachos\-/, "")
        );
        // get Composition of user's PLs from db
        const compositions = await collection
          .find({ timestamp: { $in: dbLookup } })
          .toArray();
        return res.json({ playlists, compositions });
      } catch (e) {
        res.json({ error: "you are not logged into Spotify." });
      }
    });

    app.listen(port, () => console.log(`Listening on ${port}`));
  }
);
