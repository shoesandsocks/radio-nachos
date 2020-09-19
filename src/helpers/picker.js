const getWholePlaylist = require("./getWholePlaylist");

const eightiesId = "1EQ6eMB19i1XedKO4kpBW0";
const weirdsiesId = "2UVIa3qRKV7CMoSrF4ENvR";
const zeroesId = "3bBIkuqDS0cEGUBSblHfzT";
const tensId = "2jIEdsThLWpmvz4t13kCX9";

const Mr = () => Math.random();
const r = (arr) => arr[(Mr() * arr.length) | 0];
const selectOne = (arrayName) => `spotify:track:${r(arrayName)}`;

module.exports = async (spotifyApi, len, mix = [], def = true) => {
  if (def) {
    const eighties = await getWholePlaylist(spotifyApi, eightiesId);
    const weirdsies = await getWholePlaylist(spotifyApi, weirdsiesId);
    const zeroes = await getWholePlaylist(spotifyApi, zeroesId);
    const tens = await getWholePlaylist(spotifyApi, tensId);
    const pickOne = () => {
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
      arr.push(pickOne());
    }
    return arr;
  }
  /**mixObject has to have an
   * - id of each pL it wants to pick from
   * - percentage likelihood of picking from said pL
   * the function can turn the id into an array
   * then apply the percentages and pick
   */
  const arrToReturn = [];
  let sum = 0;
  for (var i = 0; i < mix.length; i++) {
    mix[i][0] = await getWholePlaylist(spotifyApi, mix[i][0]);
    sum += mix[i][1];
  }
  if (sum !== 100) return [];
  for (var j = 0; j < len; j++) {
    const odds = Math.floor(Math.random() * Math.floor(100));
    let climbingOdds = 0;
    for (var k = 1; k < mix.length + 1; k++) {
      const currentOdds = mix[k - 1][1];
      climbingOdds += currentOdds;
      if (odds < climbingOdds) {
        const trackString = await selectOne(mix[k - 1][0]);
        arrToReturn.push(trackString);
        break;
      }
    }
  }
  return arrToReturn;
};
