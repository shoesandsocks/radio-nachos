require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");

const getWholePlaylist = require("./getWholePlaylist");
const zeroes = require("../../stuff/zeroes");
const tens = require("../../stuff/tens");
const eightiesId = "1EQ6eMB19i1XedKO4kpBW0";
const weirdsiesId = "2pWEbLMi3bvDAdozTgxgU5";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CID,
  clientSecret: process.env.CS,
  redirectUri: "https://www.porknachos.com/node/spotify-callback",
});

const Mr = () => Math.random();
const rnd = (likelihoodOfTrue) => Mr() * 100 < likelihoodOfTrue;
const getRandomItemFromArray = (arr) => arr[(Mr() * arr.length) | 0];
const selectOne = (arrayName) =>
  `spotify:track:${getRandomItemFromArray(arrayName)}`;

module.exports = async (len) => {
  const grant = await spotifyApi.clientCredentialsGrant();
  // console.log("The access token expires in " + grant.body["expires_in"]);
  // console.log("The access token is " + grant.body["access_token"]);
  spotifyApi.setAccessToken(grant.body["access_token"]);
  const eighties = await getWholePlaylist(spotifyApi, eightiesId);
  const weirdsies = await getWholePlaylist(spotifyApi, weirdsiesId);

  const playANormalSong = () => {
    const odds = Mr() * 100;
    const decade = odds < 36 ? eighties : odds < 66 ? zeroes : tens;
    const bort = selectOne(decade);
    console.log(bort);
    return bort;
  };

  let arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(rnd(85) ? playANormalSong() : selectOne(weirdsies));
  }
  return arr;
};
