var express = require('express');
var app = express();
var oper = require('./operations');
var request = require('request');

app.get('/', function(req, res){
        res.send('hello');
})

app.get('/class/:course', function(req,res){
	var course = req.params.course;
	request('http://api.umd.io/v0/courses/' + course, function(err, resp, body){
		console.log(JSON.parse(body).description);
	})
})

app.get('/factorial/:num', function(req, res){
	// .com/factorial/5
	var num = req.params.num;
	res.send(oper.factorial(num) + "");
})

app.listen(3000, function() {
	console.log('server running');
})

// Ishaan Parikh