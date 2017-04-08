var express = require('express');
var app = express();
var request = require('request');
var twit = require('twit');
var config = require('./config')

var T = new twit(config);
var dataRecieved = false;
var tweetData = "";

app.listen(3000, function() {
	console.log('server running');
})


var params = {
	q: 'thing', 
	count: 10
};

T.get('search/tweets',
	params,
	gotData);

function gotData(err, data, response){
	tweets = data.statuses;
	for(var i = 0; i < tweets.length; i++){
		console.log(tweets[i].text);
		tweetData += tweets[i].text + '\n\n';
	}
	dataRecieved = true;
}


app.get('/', function(req, res){
    res.send(tweetData);
})

// We good do how woke the feed is