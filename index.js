var express = require('express');
var twit = require('twit');
var config = require('./config');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var T = new twit(config);
var tweetObj = [];

app.get('/go', function(request, response){
	T.get("statuses/home_timeline", {user_id: '850604404105465856', count: 3}, organizeData);
});

function organizeData(err, tweets, printer){
	//console.log(tweets);
	for(var i = 0; i < tweets.length; i++){
		tweetObj[i] = {
			text: tweets[i].text,
			date: tweets[i].user.created_at
		}
	}
	for(var i = 0; i < tweetObj.length; i++){
		console.log(tweetObj[i].date + ":" + tweetObj[i].text + "\n");
	}
}