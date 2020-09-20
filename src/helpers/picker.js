const getWholePlaylist = require("./getWholePlaylist");

const Mr = () => Math.random();
const r = (arr) => arr[(Mr() * arr.length) | 0];
const selectOne = (arrayName) => `spotify:track:${r(arrayName)}`;

module.exports = async (spotifyApi, len, mix) => {
  /** MIX is array of 2-item arrays:
   * - ["id of each pL it wants to pick from",
   * - numeric percentage out of 100]
   * NOTE: numerics need to add up to 100.
   * this function can turns the ids into track arrays
   * then applies the percentages and picks
   */
  try {
    const arrToReturn = [];
    let sum = 0;
    for (var i = 0; i < mix.length; i++) {
      try {
        mix[i][0] = await getWholePlaylist(spotifyApi, mix[i][0]);
      } catch (e) {
        console.log("couldn't get playlist from id. hope you like Berzerk.");
        mix[i][0] = ["3ieAoviJEUB2MCyCjkL9aw"];
      }
      sum += mix[i][1];
    }
    if (sum !== 100) {
      console.log("that doesn't add up to 100");
      return ["spotify:track:3ieAoviJEUB2MCyCjkL9aw"];
    }
    for (var j = 0; j < len; j++) {
      const odds = Math.floor(Math.random() * Math.floor(100));
      let climbingOdds = 0;
      for (var k = 1; k < mix.length + 1; k++) {
        const currentOdds = mix[k - 1][1];
        climbingOdds += currentOdds;
        if (odds < climbingOdds) {
          const trackString = selectOne(mix[k - 1][0]);
          arrToReturn.push(trackString);
          break;
        }
      }
    }
    return arrToReturn;
  } catch (error) {
    console.log(
      "I don't think you should ever get here, given the try catch around the await above"
    );
    console.log(
      "Error somewhere in the picker, either gettingWholePlaylist or selectOne'ing..."
    );
    return [];
  }
};
