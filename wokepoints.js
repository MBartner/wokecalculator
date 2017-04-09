var fs = require("fs");
var cheerio = require('cheerio');
var request = require('request');

/*var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var watson = require('watson-developer-cloud');
var creds = appEnv.getServiceCreds('Credentials-1');
creds.version = 'v2';
var personalityInsights = watson.personality_insights(creds);*/

var bw1 = readInFile('./files/badWords.txt');
var bw2 = readInFile('./files/badWords2.txt');
var test = fs.readFileSync('./files/test.txt', 'utf8');

/*calculateScore("hey asshole #pOpdatGum", "2017-4-08", function(s){
	console.log(s);
});*/

var num = 0;

function calculateTotalScore(array, callback){
	"use strict"
	var total_score = 0;
	var allTweets = "";
	var count = 0;
	for(var i = 0; i < array.length; i++){

		let curTweet = array[i].text;
		let curDate = array[i].date;

		allTweets = allTweets + " " + curTweet;

		//console.log("CURTWEET:"+curTweet);
		//console.log("CURDATE:"+curDate);

		calculateScoreForTweet(curTweet, curDate, function(score){
			/*console.log("debug:");
			console.log("TWEET:"+curTweet);
			console.log(score);
			console.log(total_score);*/
			total_score+=score;

			++count;

			if(count === array.length) {
				//console.log("All Tweets:"+allTweets);
				getPersonality(allTweets, function(json){
					total_score = total_score/num;
					var tempScore = getPersonalityScore(json);
					total_score += tempScore;
					total = total_score;
					calculated = true;
					callback(total_score)
				});
			}
		});
	}

	// console.log("Last Print:");
	// console.log(total_score);
	// return total_score;
}

var total;
var calculated = false;
function getTotal(){
	if(calculated){
		return "" + total;
	}
	else{
		return "no";
	}
}

function calculateScoreForTweet(tweet, tweetDate, callback){ 

	getTrending(tweetDate, function(trending){

		//getPersonality(function(json){

			//console.log(trending);

			var score = 0;

			//score+=getPersonalityScore(json);
			score+=badWordScore(tweet);
			score+=getTrendingScore(trending, tweet);
			//console.log("calculateScoreForTweet:"+score);
			callback(score);
		//});

	});
}

/********************************************************/

function badWordScore(tweet){

	//console.log("in bad words");

	var score = 0;

	words = tweet.split(" ");
	//console.log(words[1]);
	//console.log(bw1.indexOf(words[1]));

	for(var i = 0; i < words.length; i++){

		var cur = (words[i]).toLowerCase();
		cur = cur.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
		//console.log(cur);

		if(bw1.indexOf(cur) != -1 || bw2.indexOf(cur) != -1){
			//console.log(cur);
			score++;
			num++;
		}
	}

	return -(score);
}

function getTrendingScore(trendingData, tweet){

	var score = 0;

	for(var i = 0; i < trendingData.length; i++){
		
		cur = trendingData[i];

		if(cur.substring(0,1) == "#"){
			cur = cur.substring(1);
		}

		if((tweet.toLowerCase()).includes(cur.toLowerCase())){

			score+=1;
			num++;
		}		
	}



	return score;
}

function getPersonalityScore(json){

	var self_trancendance = JSON.stringify((json.values)[4]);
	//console.log(JSON.parse(self_trancendance).name);
	var selfPerc = JSON.parse(self_trancendance).percentile;
	//console.log(selfPerc);

	var Conscientiousness = JSON.stringify((json.personality)[1]);
	//console.log(JSON.parse(Conscientiousness).name);
	var ConsPerc = JSON.parse(Conscientiousness).percentile;
	//console.log(ConsPerc);

	var openness = JSON.stringify((json.personality)[0]);
	//console.log(JSON.parse(openness).name);
	var openPerc = JSON.parse(openness).percentile;
	//console.log(openPerc);

	var agreeableness = JSON.stringify((json.personality)[3]);
	//console.log(JSON.parse(agreeableness).name);
	var agreePerc = JSON.parse(agreeableness).percentile;
	//console.log(agreePerc);

	score = selfPerc + ConsPerc + openPerc + agreePerc;
	score/=4;

	score = (score - .5);
	//console.log(score);
	return score;
}


/******************************************************/


function getTrending(date, callback){

	var trending = "";
	var url = 'https://trendogate.com/placebydate/23424977/'+date;

	request(url, function (error, response, html) {
	  
	  if (!error && response.statusCode == 200) {
	    var $ = cheerio.load(html);
	    $('li.list-group-item').each(function(i, element){
	      var a = $(this).prev();
	      trending+= (a.text()).trim()+"\n";
	    });
	    trending = trending.split("\n");
	    var stop = trending.indexOf("Albuquerque");
	    trending = trending.slice(1, stop-1);
	    callback(trending);
	  }
	 else{
	 	callback(null);
	 }

	});
}

function readInFile(file){

		var data = fs.readFileSync(file, 'utf8');
		return data.split("\n");
}

function getPersonality(allTweets, callback){

	var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');

	var personality_insights = new PersonalityInsightsV3({
	  username: '1ee3f960-d888-4a8b-9efa-d8a5cfc42b78',
	  password: 'znZV2XKVhNM3',
	  version_date: '2016-10-19'
	});

	personality_insights.profile({
		text: allTweets, consumption_preferences: true}, function (err, response) {
	    if (err)
	      console.log('error:', err);
	    else
	      var js = JSON.stringify(response, null, 2);
	  	  var parsedJson = JSON.parse(js);
	  	  callback(parsedJson);
	  	  //get values and personality
	      //console.log(parsedJson.values);
	});
}

module.exports = {
	calculateTotalScore: calculateTotalScore,
	getTotal, getTotal,
	root: root
}