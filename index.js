var express = require('express');
var twit = require('twit');
var config = require('./config');
var OAuth= require('oauth').OAuth;

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
	response.render('pages/index');
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

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	"5nCxdlyOaKPDO872Ip3JY1N46",
	"WyEF92yfazPVgQ7W6Z8F3FRVvlWuMGXPVxBggTwYqeImFDYN73",
	"1.0",
	"/auth/twitter/callback",
	"HMAC-SHA1"
);

app.get('/auth/twitter', function(req, res){
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
			console.log(error);
			res.send("yeah no. didn't work.")
		}
		else {
			req.session.oauth = {};
			req.session.oauth.token = oauth_token;
			console.log('oauth.token: ' + req.session.oauth.token);
			req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
			res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
	}
	});
});

app.get('/auth/twitter/callback', function(req, res, next){
	if (req.session.oauth) {
		req.session.oauth.verifier = req.query.oauth_verifier;
		var oauth = req.session.oauth;

		oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("yeah something broke.");
			} else {
				req.session.oauth.access_token = oauth_access_token;
				req.session.oauth,access_token_secret = oauth_access_token_secret;
				console.log(results);
				res.send("worked. nice one.");
			}
		}
		);
	} else
		next(new Error("you're not supposed to be here."))
});
