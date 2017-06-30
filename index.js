// Now, the "express" library. Express is a popular HTTP Server
// Framework, allowing one to quickly create good web servers in
// a short time.
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const db = require('./db.js');
const async = require('async');

const app = express();
const template = fs.readFileSync('template/index.html', 'utf-8');
const result_template = fs.readFileSync('template/result.html', 'utf-8');
const add_template = fs.readFileSync('template/addstuffs.html', 'utf-8');
const answer_template = fs.readFileSync('template/answer.html', 'utf-8');
const about_template = fs.readFileSync('template/about.html','utf-8');
const help_template = fs.readFileSync('template/help.html','utf-8');

app.use(bodyParser.urlencoded({
    extended: true
}));

function replacest(str, tag, value) {
	return str.replace(`[${tag}]`, value);
}

function nottrue(array){
	for(var i=0; i<array.length; i++){
		if(array[i] == false) return true;
	}
	return false;
}

function stringified(string){
	return string.split('\\').join('\\\\');
}

function deathtocommas(string){
	return string.split(',').join(' ')
}

app.get("/", (req, res) => {
	//res.send(template);

db.grab(function(err, questions){
	var list = [];
	for(var i=0; i<questions.length; i++){
		list[i] = [];
		list[i][0] = questions[i]._id;
		list[i][1] = questions[i].question;
	};
	
	var string = "[";
	for(var i=0; i<list.length; i++){
		string = string + "['" + list[i][0] + "', '" + list[i][1] + "'],"
	}
	string = string.slice(0,-1);
	string += "]";
	var response = replacest(template, "data", string);  
	res.send(response);
});

});

app.post("/answer", (req,res) =>{
	
	var listofquestion = req.body.question.split(",");
	
	console.log(listofquestion);
	//var answers = getanswers(listofquestion);
	var answers = [];
	async.eachSeries(listofquestion, function(question,callback){
		db.find(question, function(err, docs){
			if(err){console.log("err")}	else {		
			
			answers.push(docs[0].answer);
			}
		});
		callback();
	}, function(err){
		
	})
	var string = "";
	var response = replacest(answer_template, "name", req.body.name);
	response = replacest(response, "class", req.body.class);
	response = replacest(response, "school", req.body.school);

	setTimeout(function(){
		for(var i=0; i<answers.length; i++){
			string += "<li>"
			string += "<br> <b>BÀI LÀM</b>: <br>";
			let min = 0, max = answers[i].length;
			let ran = (Math.round(Math.random()*1000) % (max - min) + min);
			console.log(ran);
			string += answers[i][ran];
			string += "</li><br><br><br><br>";
		}
		
		
		response = replacest(response, "data", string);
		res.send(response);
	},2000)
})

app.get("/addstuffs", (req,res) =>{
	res.send(add_template); 
});

app.get("/help", (req,res) =>{
	res.send(help_template); 
});

app.get("/about", (req,res) =>{
	res.send(about_template); 
});

app.post("/add", (req,res) =>{
	
	question=deathtocommas(req.body.question);
	db.find(question.toLowerCase(), function(err,docs){
		if(err){
			db.add({
				question: question.toLowerCase(),
				answer: [req.body.answer]
			})
		}
		else{
			db.update(
				question.toLowerCase(),
				req.body.answer,
				function(err,docs){
					
					db.grab(function(err,docs){console.log(docs);});
				}
			)
		}
	});
	res.redirect("/addstuffs");
});

app.listen(3000, () => {
	console.log("Listening!"); // Write a log to know when it's done initializing.
});

// And that's everything one needs to write a Hello World server.
// Call "node index.js".
