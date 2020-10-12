const SpotifyApi = require("spotify-web-api-node");

module.exports = async function (req, res) {
  // console.log(req.session.user.spotToken);
  try {
    const { collection } = req.database;
    const { spotToken } = req.session.user;
    const spotifyApi = new SpotifyApi();
    spotifyApi.setAccessToken(spotToken);

    const { id } = req.session.user;
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
      const x = thing.find((item) => item.playlistId === current.playlistId);
      return !x ? thing.concat([current]) : thing;
    }, []);

    return res.json({ recentPlaylists: filtered, playlists, compositions });
  } catch (e) {
    if (e instanceof TypeError) {
      console.log(e.message);
      return res.json({ error: "your session was destroyed (probably)." });
    }
    return res.json({ error: "something went terribly wrong." });
  }
};
