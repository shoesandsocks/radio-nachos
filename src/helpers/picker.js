const getWholePlaylist = require("./getWholePlaylist");
const getPlaylistName = require("./getPlaylistName");

const Mr = () => Math.random();
const r = (arr) => arr[(Mr() * arr.length) | 0];
const selectOne = (arrayName) => `spotify:track:${r(arrayName)}`;

module.exports = async (spotifyApi, numberOfTracks, mix) => {
  /** MIX is array of 2-item arrays:
   * - ["id of each pL it wants to pick from",
   * - numeric percentage out of 100]
   * NOTE: numerics need to add up to 100.
   * this function can turns the ids into track arrays
   * then applies the percentages and picks
   */
  try {
    const objToReturn = {
      tracksToAdd: [],
      compositionData: [
        // {
        //   id: 0,
        //   playlistName: "Bort",
        //   playlistId: "abcde1345",
        //   percentage: 100,
        // },
      ],
    };
    let sum = 0;
    for (var i = 0; i < mix.length; i++) {
      try {
        const playlistId = mix[i][0];
        const percentage = mix[i][1];
        const playlistName = await getPlaylistName(spotifyApi, playlistId);
        objToReturn.compositionData.push({
          id: i,
          playlistId,
          percentage,
          playlistName,
        });
        mix[i][0] = await getWholePlaylist(spotifyApi, playlistId);
        sum += percentage;
      } catch (e) {
        console.log(e);
      }
    }
    if (sum !== 100) {
      console.log("that doesn't add up to 100");
      return objToReturn;
    }
    for (var j = 0; j < numberOfTracks; j++) {
      const odds = Math.floor(Math.random() * Math.floor(100));
      let climbingOdds = 0;
      for (var k = 1; k < mix.length + 1; k++) {
        const currentOdds = mix[k - 1][1];
        climbingOdds += currentOdds;
        if (odds < climbingOdds) {
          const trackString = selectOne(mix[k - 1][0]);
          objToReturn.tracksToAdd.push(trackString);
          break;
        }
      }
    }
    // remove track-lookup errors
    objToReturn.tracksToAdd = objToReturn.tracksToAdd.filter(
      (t) => t !== "spotify:track:null"
    );
    return objToReturn;
  } catch (error) {
    console.log(error);
    console.log("Error somewhere in the picker...");
    return objToReturn;
  }
};
