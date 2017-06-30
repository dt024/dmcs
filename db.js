//dependencies 

const nedb = require('nedb');
const db = new nedb({
	filename: 'database.db',
	autoload: true
}); 

function add(toadd){
	db.insert(toadd, function(err,doc){
		console.log("question: " + doc.question + " with id: " + doc._id);
	});
}

function grab(callback){
	db.find({}).exec(callback);
}

function find(question, callback){
	db.find({question: question}, function(err, rows){ 
		if (rows.length === 0)
			callback(new Error("No girl found"), null);
		else
			callback(null, /*{_id: rows[0]._id, question: rows[0].question, answer: rows[0].answer}*/rows);
	})
}

function findbyid(id, callback){
	db.find({_id: id}, function(err,rows){
		if (rows.length === 0)
			callback(new Error("None found"), null);
		else 
			callback(null, {_id: rows[0]._id, question: rows[0].question, answer: rows[0].answer});
	})
}

function update(question, answer, callback){
	db.update({question: question}, {$push: {answer: answer}}, {} ,callback);
}


module.exports = {
	add: add,
	grab: grab,
	find: find,
	findbyid: findbyid,
	update: update
}