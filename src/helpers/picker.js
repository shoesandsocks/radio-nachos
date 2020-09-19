const getWholePlaylist = require("./getWholePlaylist");

const eightiesId = "1EQ6eMB19i1XedKO4kpBW0";
const weirdsiesId = "2UVIa3qRKV7CMoSrF4ENvR";
const zeroesId = "3bBIkuqDS0cEGUBSblHfzT";
const tensId = "2jIEdsThLWpmvz4t13kCX9";

const Mr = () => Math.random();
const rnd = (likelihoodOfTrue) => Mr() * 100 < likelihoodOfTrue;
const getRandomItemFromArray = (arr) => arr[(Mr() * arr.length) | 0];
const selectOne = (arrayName) =>
  `spotify:track:${getRandomItemFromArray(arrayName)}`;

module.exports = async (spotifyApi, len, mixObject = {}, def = true) => {
  const eighties = await getWholePlaylist(spotifyApi, eightiesId);
  const weirdsies = await getWholePlaylist(spotifyApi, weirdsiesId);
  const zeroes = await getWholePlaylist(spotifyApi, zeroesId);
  const tens = await getWholePlaylist(spotifyApi, tensId);

  const playANormalSong = () => {
    if (def) {
      const odds = Mr() * 100;
      const decade =
        odds < 15
          ? eighties
          : odds < 30
          ? zeroes
          : odds < 45
          ? tens
          : weirdsies;
      return selectOne(decade);
    }
  };

  const arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(playANormalSong());
  }
  return arr;
};
