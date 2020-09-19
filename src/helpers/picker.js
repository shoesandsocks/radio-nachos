const eighties = require("../../stuff/eighties");
const zeroes = require("../../stuff/zeroes");
const tens = require("../../stuff/tens");
const weirdsies = require("../../stuff/weirdsies");

const Mr = () => Math.random();
const rnd = (likelihoodOfTrue) => Mr() * 100 < likelihoodOfTrue;
// eslint-disable-next-line no-bitwise
const getRandomItemFromArray = (arr) => arr[(Mr() * arr.length) | 0];

const selectOne = (arrayName) =>
  `spotify:track:${getRandomItemFromArray(arrayName)}`;

const playANormalSong = () => {
  const odds = Mr() * 100;
  const decade = odds < 36 ? eighties : odds < 66 ? zeroes : tens;
  return selectOne(decade);
};

module.exports = (len) => {
  arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(rnd(85) ? playANormalSong() : selectOne(weirdsies));
  }
  return arr;
};
