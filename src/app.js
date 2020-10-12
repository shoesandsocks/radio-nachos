require("dotenv").config();
// const path = require("path");
const express = require("express"); // Express web server framework
const session = require("express-session");
const request = require("request"); // "Request" library
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const SpotifyApi = require("spotify-web-api-node");
const MongoClient = require("mongodb").MongoClient;
const MongoStore = require("connect-mongo")(session);

const makeSpotifyPlaylist = require("./helpers/makeSpotifyPlaylist");
const getPlaylistName = require("./helpers/getPlaylistName");
const generateRandomString = require("./helpers/generateRandomString");

const env = process.env.NODE_ENV;

const port = process.env.PORT;
const client_id = process.env.CID;
const client_secret = process.env.CS;

const redirect_uri =
  env === "production"
    ? "https://radio-nachos.herokuapp.com/callback"
    : "http://localhost:8888/callback";
// const redirect_uri = "https://www.porknachos.com/node/spotify-callback";

MongoClient.connect(
  process.env.MONGODB_URI,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log("Connected to Database");

    const isProd = env === "production";
    const originToggle = isProd
      ? ["https://radio-nachos.herokuapp.com"]
      : ["http://localhost:8888"];

    var corsOptions = {
      origin: originToggle,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    };

    const db = client.db("radio-nachos");
    const collection = db.collection("playlists");

    // setup express app
    const app = express();

    const sess = {
      secret: process.env.SESSION_SECRET,
      key: "radionachocookie",
      store: new MongoStore({
        client,
        dbName: "radio-nachos",
        collection: "sessions",
      }),
      resave: false,
      saveUninitialized: false,
      httpOnly: true,
      cookie: {
        sameSite: "strict",
        maxAge: 360000,
        resave: true,
        saveUninitialized: false,
      },
    };
    if (isProd) {
      app.set("trust proxy", 1); // trust first proxy
      sess.cookie.secure = true; // serve secure cookies
    }
    app.use(session(sess));
    console.log(`we are in ${env}`);

    // begin routes
    app.use("/react", cors(corsOptions), express.static("react"));
    app.use(express.static("public", { extensions: ["html"] }));
    app
      // .use(cors(corsOptions))
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
            const spotifyApi = new SpotifyApi();
            spotifyApi.setAccessToken(access_token);
            const me = await spotifyApi.getMe();
            req.session.user = { ...me.body, spotToken: access_token };
            res.redirect("react");
          } else {
            res.redirect(
              `/#${querystring.stringify({ error: "invalid_token" })}`
            );
          }
        });
      }
    });
    app.post("/deletePlaylist", async (req, res) => {
      try {
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
    });
    app.post("/playlistlookup", async (req, res) => {
      try {
        const { spotToken } = req.session.user;
        const spotifyApi = new SpotifyApi();
        spotifyApi.setAccessToken(spotToken);
        const { str } = req.body;
        ident = str.replace("spotify:playlist:", "");
        const { error, playlistName } = await getPlaylistName(
          spotifyApi,
          ident
        );
        return error ? res.json({ error }) : res.json({ name: playlistName });
      } catch (e) {
        console.log(e);
        return res.json({ error: JSON.stringify(e) });
      }
    });
    app.post("/make", async (req, res) => {
      try {
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
        } = await makeSpotifyPlaylist(
          spotifyApi,
          numberOfTracks,
          arrayOfArrays
        );
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
    });

    app.get("/getPrev", async (req, res) => {
      // console.log(req.session.user.spotToken);
      try {
        const { spotToken } = req.session.user;
        const spotifyApi = new SpotifyApi();
        spotifyApi.setAccessToken(spotToken);

        const { id } = req.session.user;
        console.log(`${id} is on the server`);

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

        const recentPlaylists = await collection
          .find({})
          .limit(5)
          .sort({ _id: 1 })
          .toArray();
        const reducedPlaylistData = recentPlaylists.map((pla) => {
          const oneEntry = pla.compositionData.map((data) => {
            const { playlistId, playlistName } = data;
            return { playlistId, playlistName };
          });
          return oneEntry;
        });
        const flattened = reducedPlaylistData.flat();
        // https://stackoverflow.com/a/64051726/5937402
        const filtered = flattened.reduce((thing, current) => {
          const x = thing.find(
            (item) => item.playlistId === current.playlistId
          );
          return !x ? thing.concat([current]) : thing;
        }, []);

        return res.json({ recentPlaylists: filtered, playlists, compositions });
      } catch (e) {
        console.log(e);
        res.json({ error: "you are not logged into Spotify." });
      }
    });

    app.listen(port, () => console.log(`Listening on ${port}`));
  }
);
