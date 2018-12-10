// Importing access to node environment variable management module
require("dotenv").config();

// Initializing reading and writing
var fs = require("fs");

// Importing access to necessary modules
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");

// Importing JS file containing necessary API keys
var keys = require("./keys");

// Storing each API key by creating a new object named for the API source
var spotify = new Spotify(keys.spotify);

// Greeting
console.log("Welcome to LIRI!");
console.log('\n');

// Directing node to find arguments
var command = process.argv[2];
var term = process.argv.slice(3).join(" ");

// Default response to be printed if command is entered incorrectly
var output = [
  "LIRI accepts the following commands:",
  "node liri.js concert-this <artist/band name here>",
  "node liri.js spotify-this-song '<song name here>",
  "node liri.js movie-this '<movie name here>",
  "node liri.js do-what-it-says"
].join("\n");

// Switch-Case function determines which command gets called
function SC(command, term) 
{
  switch (command) {

  case "concert-this":
    concertSearch(term);
    break;

  case "spotify-this-song":
    songSearch(term);
    break;
    
  case "movie-this":
  if (term === "" || term === null) {
    movieSearch();
  }
  else {
    movieSearch(term);
  }
    break;

  case "do-what-it-says":
    randomSearch();
    break;
  
  default:
    console.log(output);  
  }
}

//Calling the switch-case
SC(command, term);


//Concert This Declaration
function concertSearch(searchTerm) {

  var queryURL = "https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=" + keys.bands.appid;

  axios.get(queryURL)
    .then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        console.log("Concert Venue: " + response.data[i].venue.name);
        console.log("Concert Location: " + response.data[i].venue.city + ", " + 
          response.data[i].venue.region + ", " +
          response.data[i].venue.country);
        console.log("Concert Date: " + moment(response.data[i].datetime).format("MM/DD/YYYY") + '\n');
      }
    })
    .catch(function (error) {
        console.log("Error occurred: " + error);
    });
}


// Spotify This Song Declaration
function songSearch(searchTerm) {
  
  spotify.search({ type: "track", query: searchTerm}, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
  console.log("Song Name : " + data.tracks.items[0].name);
  console.log("Album Name : " + data.tracks.items[0].album.name);
  console.log("Song Preview : " + data.tracks.items[0].preview_url);
  });
}


//Movie This Declaration
function movieSearch (searchTerm = "Mr.Nobody") {

  var queryURL = "https://www.omdbapi.com/?apikey="+ keys.omdb.key + "&t=" + searchTerm + "&type=movie&plot=short&r=json";
  
  axios.get(queryURL)
  .then(function(response) {

    console.log("Movie Title: " + response.data.Title);
    console.log("Movie Year: " + response.data.Year);
    console.log("IMDB Rating: " + response.data.imdbRating);
    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
    console.log("Country: " + response.data.Country);
    console.log("Language: " + response.data.Language);
    console.log("Plot: " + response.data.Plot);
    console.log("Actors: " + response.data.Actors);
  })
  .catch(function (error) {
        console.log("Error occurred: " + error);
  });
}


// Do What It Says Declaration
function randomSearch() {
  
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    console.log(data);
    data = data.split(",");
    SC(data[0], data[1]);
  });
}