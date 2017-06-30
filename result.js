//deps 
const express = require('express');
const fs = require('fs');

const app = express();
const template = fs.readFileSync('template/result.html', 'utf-8');

app.get("/result", (req,res) =>{
	res.send("aosiughpoavjn");
});

app.listen(3000, () => {
	console.log("Result Listening!"); // Write a log to know when it's done initializing.
});