const getWholePlaylist = require("./getWholePlaylist");

const Mr = () => Math.random();
const r = (arr) => arr[(Mr() * arr.length) | 0];
const selectOne = (arrayName) => `spotify:track:${r(arrayName)}`;

module.exports = async (spotifyApi, len, mix) => {
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
