const getWholePlaylist = require("./getWholePlaylist");
const getPlaylistName = require("./getPlaylistName");

const Mr = () => Math.random();
const r = (arr) => arr[(Mr() * arr.length) | 0];
const selectOne = (arrayName) => `spotify:track:${r(arrayName)}`;

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

module.exports = async (spotifyApi, numberOfTracks, mix) => {
  /** MIX is array of 2-item arrays:
   * - ["id of each pL it wants to pick from",
   * - numeric percentage out of 100]
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
    // for each array item in the "mix"....
    for (var i = 0; i < mix.length; i++) {
      try {
        const playlistId = mix[i][0];
        const percentage = +mix[i][1];
        // get the playlist name via api
        const { error, playlistName } = await getPlaylistName(
          spotifyApi,
          playlistId
        );
        if (error) throw new Error(error);
        // save all metadata in the object we eventually return
        objToReturn.compositionData.push({
          id: i, // unused
          playlistId,
          percentage,
          playlistName,
        });
        // calc how many actual tracks we're gonna pick(minimum of 1 guaranteed)
        const actualRoundedUpPercentage = Math.ceil(
          (percentage * numberOfTracks) / 100
        );
        // get a list of every track in the playlist
        const possibles = await getWholePlaylist(spotifyApi, playlistId);
        // for as many tracks as we're gonna pick in this loop... do so
        for (var j = 0; j < actualRoundedUpPercentage; j++) {
          if (possibles.length > 0) {
            const trackString = selectOne(possibles);
            objToReturn.tracksToAdd.push(trackString);
            const index = possibles.indexOf(
              trackString.replace("spotify:track:", "")
            );
            if (index > -1) {
              possibles.splice(index, 1);
            }
          } else {
            console.log("i ran out of tracks to select from");
          }
        }
      } catch (e) {
        console.log("inner try-catch failure; probably on getPlaylistName?");
        console.log(e);
      }
    }
    // filter out track-lookup errors
    objToReturn.tracksToAdd = objToReturn.tracksToAdd.filter(
      (t) => t !== "spotify:track:null"
    );
    // shuffle
    objToReturn.tracksToAdd = shuffle(objToReturn.tracksToAdd);
    // return
    return objToReturn;
  } catch (error) {
    console.log(error);
    console.log("Error somewhere in the picker...");
    return objToReturn;
  }
};
