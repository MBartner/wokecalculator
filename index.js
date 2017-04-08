var express = require('express');
var app = express();
var request = require('request');
var twit = require('twit');
var config = require('./config');

var T = new twit(config);

app.listen(3000, function() {
	console.log('server running');
})

app.get('/', function(req, res){
    res.send('hello');
})

var params = {
	q: 'rainbow', 
	count: 2
};

T.get('search/tweets',
	params,
	gotData);

function gotData(err, data, response){
	var tweets = data.statuses;
	for(var i = 0; i < tweets.length; i++){
		
	}
	console.log(data);
}