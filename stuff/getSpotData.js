// require("dotenv").config();
// const SpotifyWebApi = require("spotify-web-api-node");

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.CID,
//   clientSecret: process.env.CS,
//   redirectUri: "https://www.porknachos.com/node/spotify-callback",
// });

// const scopes = "user-read-private user-read-email";

// const getPlaylistData = (identifier) =>
//   spotifyApi
//     .getPlaylistTracks(identifier, {
//       offset: 0,
//       limit: 100,
//     })
//     .then(
//       function (data) {
//         const x = data.body.items.map((i) => i.track.id);
//         console.log(x);
//       },
//       function (err) {
//         console.log("Something went wrong!", err);
//       }
//     );

// const pl = [
//   "2dp14VWbIxOVNmaWKkVB1r",
//   "3SUusuA9jH1v6PVwtYMbdv",
//   "58PSYdY0GFg0LFb2PxYk4T",
//   "7ui9Qq4JcPGcd3xWOeXhHp",
//   "0qUJiBYAngJDJwNVh17GNF",
//   "5GALSojbb6yxDKCGVa2HVS",
//   "6q9o34l9jRBiICBJidG9TZ",
//   "0W4Kpfp1w2xkY3PrV714B7",
//   "2BBkIgdXLv5vyp1DR0wpQl",
//   "5MtN38MGEWJt60LwtBmFNP",
//   "6ZtlUSe5Vt1ev5767zg46s",
//   "57i3M29DWoo7RDk0Tf0LZG",
//   "60ZGteAEtPCnGE6zevgUcd",
//   "3FtYbEfBqAlGO46NUDQSAt",
//   "2jIypevuISRPFeUvpHWMCL",
//   "78j3qTBdzcIiT3eS7XymoD",
//   "6MdmUCGBdlPf9Cbp4CuzeO",
//   "75a66iUfwKdJb5n9juvXRI",
//   "5MtN38MGEWJt60LwtBmFNP",
//   "5JtPGzRgrWxkXX9LoROq3d",
//   "1a2iF9XymafjRk56q7oCxo",
//   "0Fe3WxeO6lZZxj7ytvbDUh",
//   "0dADgSWy2Q72BhpR6qLdkW",
//   "4tq0LDWthVgq7hXVQNpfp3",
//   "5y1iInKBJiE9Qfi4eKOal9",
//   "2MVwrvjmcdt4MsYYLCYMt8",
//   "58PSYdY0GFg0LFb2PxYk4T",
//   "2HC6DOJvppo0Dn3KFl084N",
//   "2ULVuBP9BX7fdYm8so58KX",
//   "4R8yORS2HYbviDdE2Jmkad",
//   "1aDLUzCyYpRXgrjwUWzV2X",
//   "7j02rdE5RVtNcNMuLGY5SS",
//   "3cg0dJfrQB66Qf2YthPb6G",
//   "4kiVRcINxpbNTbmEbePXQL",
//   "7GUVaGNiu11HXN2aqF6Rir",
//   "6Dj0RpOdgzXWnxf7wyZhay",
//   "2BBkIgdXLv5vyp1DR0wpQl",
//   "0GaAL9rUuGnUOBYC3vUzES",
//   "1a2iF9XymafjRk56q7oCxo",
//   "2wYRLkOYMDOe6ABxAa2BKR",
//   "6vECYJHxYmm3Ydt3fF01pE",
//   "2dp14VWbIxOVNmaWKkVB1r",
//   "2iUmqdfGZcHIhS3b9E9EWq",
//   "7j02rdE5RVtNcNMuLGY5SS",
//   "5MtN38MGEWJt60LwtBmFNP",
//   "1a2iF9XymafjRk56q7oCxo",
//   "0grFc6klR3hxoHLcgCYsF4",
//   "2KCzAlkQRc4ZzexoSkQALv",
//   "0GO8y8jQk1PkHzS31d699N",
//   "6vSq5q5DCs1IvwKIq53hj2",
//   "4Fh5F6ly7PyBte0iR4e0GC",
//   "3QnUSAeBLVltNX7SzBvRiI",
//   "0NhvXWy3knBLgGGM6Y1Q7R",
//   "4BYmnYGNVBVm2JHVxFNMXj",
//   "2nvZv4qatgsDIbEqqbQLUT",
//   "2zYZknwsvUmBTIoD8G0HdC",
//   "1eyzqe2QqGZUmfcPZtrIyt",
//   "0JCJcQey1P00ZPV3WiaRxg",
//   "7ttwrfe807K63aXv3VSKU1",
//   "4yYvWFUWMaKMXtoJKJnmZk",
//   "6jrMVRReY24qzCfe1BRrww",
//   "7ti4qMC7xYQeh1uRzj5XuM",
//   "6M6UoxIPn4NOWW0x7JPRfv",
//   "70wYA8oYHoMzhRRkARoMhU",
//   "4BEU0NjtF2EHmlWi4Cs1Kf",
//   "46Xnj8vZFwOZCE4aZNXlTf",
//   "5dS3H2D6fRevtCOdHAk1lT",
//   "3e0yTP5trHBBVvV32jwXqF",
//   "3cg0dJfrQB66Qf2YthPb6G",
//   "1BwhFXqoIsePt21WyWIttb",
//   "0qnOjNW04qpcgXqD9dwru2",
//   "5XNpdKmlLJPUbwKQceX2tW",
//   "2mtyoFWkXMkOt8DP8hxi2B",
//   "25nzKGDiua1lE9Qo5V19GL",
//   "1aE3If5Perm6VYmO5fuz2Y",
//   "5yc59J3MR3tVDPTOgwgRI5",
//   "4PkzZmXwCjJffrUqPVrksU",
//   "25nzKGDiua1lE9Qo5V19GL",
//   "05ZJ8eeJuvFM9PIAa00E0n",
//   "4VbDJMkAX3dWNBdn3KH6Wx",
//   "5QNpEA1gZN5SCF7NydOvhm",
//   "4MzGM692jKGkNSQ7qzeTaJ",
//   "2yEvbLwLpEq4Z5yhyQLI0q",
//   "5rHoZOh481VFV9kJovM9RI",
//   "57i3M29DWoo7RDk0Tf0LZG",
//   "59CzyyXjbOfTxfsv5MnBOV",
//   "4prEPl61C8qZpeo3IkYSMl",
//   "1a2iF9XymafjRk56q7oCxo",
//   "7uOzAJFCHdBAs301jGgpoq",
//   "7IzLAli1EfsUYTLgfp4MvM",
//   "5jhEFOyVyguavP0eIQZpGK",
//   "4kiVRcINxpbNTbmEbePXQL",
//   "5MtN38MGEWJt60LwtBmFNP",
//   "0GO8y8jQk1PkHzS31d699N",
//   "2PlP2rRrgSz8lC7MpH3e4e",
//   "2tzlyoBIHSWahs6jCshWJt",
//   "5XNpdKmlLJPUbwKQceX2tW",
//   "6RKGBcDtgzXx21zUjpeu6F",
//   "7H6Zum7na77O7dwShaPapK",
//   "5GALSojbb6yxDKCGVa2HVS",
// ];
// spotifyApi.clientCredentialsGrant().then(
//   function (data) {
//     // console.log("The access token expires in " + data.body["expires_in"]);
//     // console.log("The access token is " + data.body["access_token"]);
//     spotifyApi.setAccessToken(data.body["access_token"]);
//     // getPlaylistData("");
//   },
//   function (err) {
//     console.log("Something went wrong when retrieving an access token", err);
//   }
// );
