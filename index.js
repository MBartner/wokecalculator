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

/*var _twitterConsumerKey = "5nCxdlyOaKPDO872Ip3JY1N46";
var _twitterConsumerSecret = "WyEF92yfazPVgQ7W6Z8F3FRVvlWuMGXPVxBggTwYqeImFDYN73";

function consumer() {
  return new oauth.OAuth(
    "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token", 
    _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://badgestar.com/sessions/callback", "HMAC-SHA1");   
}

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express.logger());
  app.use(express.cookieDecoder());
  app.use(express.session());
});

app.dynamicHelpers({
  session: function(req, res){
    return req.session;
  }
});

app.get('/sessions/connect', function(req, res){
  consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
    if (error) {
      res.send("Error getting OAuth request token : " + sys.inspect(error), 500);
    } else {  
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);      
    }
  });
});

app.get('/sessions/callback', function(req, res){
  sys.puts(">>"+req.session.oauthRequestToken);
  sys.puts(">>"+req.session.oauthRequestTokenSecret);
  sys.puts(">>"+req.query.oauth_verifier);
  consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      res.send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]", 500);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      // Right here is where we would write out some nice user stuff
      consumer.get("http://twitter.com/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
        if (error) {
          res.send("Error getting twitter screen name : " + sys.inspect(error), 500);
        } else {
          req.session.twitterScreenName = data["screen_name"];    
          res.send('You are signed in: ' + req.session.twitterScreenName)
        }  
      });  
    }
  });
});*/


var url = require('url');
var express = require('express');
var authenticator = require('./authenticator');
var config = require('./configger');
app.use(require('cookie-parser')());
app.get('/auth/twitter', authenticator.redirectToTwitterLoginPAge);

app.get(url.parse(config.oauth_callback).path, fucntion(req, res){
	authenticator.authenticate(req, res, function(err){
		if(err){
			console.log(err);
			res.sendStatus(401);
		}else {
			res.send("Authentication Successful");
		}
	});
});





