'use strict';

// test database connection

var mysql = require('mysql');
var con = mysql.createConnection({
	  host: "localhost",
	  user: "travis",
	  password: "",
	  database: "cs425"
});
con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
});
con.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
	  if (error) throw error;
	  console.log('The solution is: ', results[0].solution);
});
con.end(function(err) {
	console.log("Terminated db connection.")
});
