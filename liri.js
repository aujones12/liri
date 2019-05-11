require("dotenv").config();

/*
*
* I used some online code for the spotify portion and did not get to test it 
* For most of these i got it working with console.log then switched to fs.append and couldn't get it to work
*
*/

var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var userOption = process.argv[2]; 
var inputParam = process.argv[3];
var spotify = new Spotify(keys.spotify);

UserInputs(userOption, inputParam);

function UserInputs (userOption, inputParam){
    switch (userOption) {
    case 'concert-this':
        showConcertInfo(inputParam);
        break;
    case 'spotify-this-song':
        showSongInfo(inputParam);
        break;
    case 'movie-this':
        showMovieInfo(inputParam);
        break;
    case 'do-what-it-says':
        showSomeInfo();
        break;
    default: 
        console.log("Not a valid input, try again.")
    }
}

function showConcertInfo(inputParam){
    var queryUrl = "https://rest.bandsintown.com/artists/" + inputParam + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
        var concerts = JSON.parse(body);
        for (var i = 0; i < concerts.length; i++) {  
            fs.appendFileSync("log.txt", "Event Info \n");
            fs.appendFileSync("log.txt", i + "\n");
            fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name+"\n");
            fs.appendFileSync("log.txt", "Venue Location: " +  concerts[i].venue.city+"\n");
            fs.appendFileSync("log.txt", "Date of the Event: " +  concerts[i].datetime+"\n");
        }
    } else{
      console.log('Error occurred.');
    }
});}

function showSongInfo(inputParam) {
    if (inputParam === undefined) {
        inputParam = "Nickleback"; 
    }
//Dont know if this works
    spotify.search(
        {
            type: "track",
            query: inputParam
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                fs.appendFileSync("log.txt", "Song Info \n");
                fs.appendFileSync("log.txt", i +"\n");
                fs.appendFileSync("log.txt", "song name: " + songs[i].name +"\n");
                fs.appendFileSync("log.txt", "preview song: " + songs[i].preview_url +"\n");
                fs.appendFileSync("log.txt", "album: " + songs[i].album.name + "\n");
                fs.appendFileSync("log.txt", "artist(s): " + songs[i].artists[0].name + "\n");
             }
        }
    );
};

function showMovieInfo(inputParam){
    if (inputParam === undefined) {
        inputParam = "Cars"
    }
    var queryUrl = "http://www.omdbapi.com/?t=" + inputParam + "&y=&plot=short&apikey=7ea6d332";
    request(queryUrl, function(error, response, body) {

    if (!error && response.statusCode === 200) {
        var movies = JSON.parse(body);
        fs.appendFileSync("log.txt", "MOVIE INFO \n");
        fs.appendFileSync("log.txt", "Title: " + movies.Title + "\n");
        fs.appendFileSync("log.txt", "Release Year: " + movies.Year + "\n");
        fs.appendFileSync("log.txt", "IMDB Rating: " + movies.imdbRating + "\n");
        fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + rtnTomValue(movies) + "\n");
        fs.appendFileSync("log.txt", "Plot: " + movies.Plot + "\n");
        fs.appendFileSync("log.txt", "Actors: " + movies.Actors + "\n");
    } else {
      console.log('Error');
    }
    });
}

function rtnTomObj (data) {
    return data.Ratings.find(function (item) {
        return item.Source === "Rotten Tomatoes";
    });
  }
  
function rtnTomValue (data) {
    return rtnTomObj(data).Value;
}

function showSomeInfo(){
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err){ 
			return console.log(err);
		}
        var dataArr = data.split(',');
        UserInputs(dataArr[0], dataArr[1]);
	});
}

