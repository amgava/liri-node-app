console.log("this is loaded");
console.log('\n');

/* Spotify */
exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};


/* Bands In Town */
exports.bands = {
  appid: process.env.BAND_ID
};


/* OMDB */
exports.omdb = {
  key: process.env.OMDB_ID
};