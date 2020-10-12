require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MongoClient = require("mongodb").MongoClient;
const MongoStore = require("connect-mongo")(session);

const env = process.env.NODE_ENV;
const port = process.env.PORT;

MongoClient.connect(
  process.env.MONGODB_URI,
  {
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) return console.error(err);
    console.log("Connected to Database");

    // prepare env and cors options
    const isProd = env === "production";
    const originToggle = isProd
      ? ["https://radio-nachos.herokuapp.com"]
      : ["http://localhost:8888"];
    const corsOptions = {
      origin: originToggle,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    };

    // setup database and middleware to provide it to some routes
    const db = client.db("radio-nachos");
    const collection = db.collection("playlists");
    function provideDb() {
      return function (req, res, next) {
        req.database = { collection };
        next();
      };
    }
    // setup express app, session w/ cookies
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
      },
    };
    if (isProd) {
      app.set("trust proxy", 1); // trust first proxy
      sess.cookie.secure = true; // serve secure cookies
    }
    app.use(session(sess));
    console.log(`we are in ${env}`);

    // begin routes
    app
      .use("/react", cors(corsOptions), express.static("react"))
      .use(express.static("public", { extensions: ["html"] }))
      .use(cookieParser())
      .use(express.urlencoded({ extended: true }))
      .use(express.json());

    app.get("/login", require("./routes/login"));
    app.get("/callback", require("./routes/callback"));
    app.post("/playlistlookup", require("./routes/playlistlookup"));
    app.post("/make", provideDb(), require("./routes/make"));
    app.get("/getPrev", provideDb(), require("./routes/getPrev"));
    app.post(
      "/deletePlaylist",
      provideDb(),
      require("./routes/deletePlaylist")
    );

    app.listen(port, () => console.log(`Listening on ${port}`));
  }
);
