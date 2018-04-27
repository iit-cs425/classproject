/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START app]
console.log( __filename );

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser("cs425"));


//
const fs = require("fs");

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const multer  = require('multer');
const upload = multer({
	  dest: 'uploads/' // this saves your file into a directory called "uploads"
}); 

const http = require ("http");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

//
var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "cs425",
	password: "cs425",
	database: "cs425",
	typeCast: function castField( field, useDefaultTypeCasting ) {
		// We only want to cast bit fields that have a single-bit in them. If the field
		// has more than one bit, then we cannot assume it is supposed to be a Boolean.

		if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {

			var bytes = field.buffer();

			// A Buffer in Node represents a collection of 8-bit unsigned integers.
			// Therefore, our single "bit field" comes back as the bits '0000 0001',
			// which is equivalent to the number 1.
			return( bytes[ 0 ] === 1 );

		}

		return( useDefaultTypeCasting() );
	}
});

con.connect(function(err) {
	  if (err) throw err;
	  console.log("Connected!");
});

con.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
	  if (error) throw error;
	  console.log('The solution is: ', results[0].solution);
});
 
app.get('/', (req, res) => {
   res.status(200).send('Hello, root!').end();
});

app.get('/cookies', (req, res) => {
	var outHead = "Welcome ";
	if (req.signedCookies['IsAdmin'] === 'true') outHead += '<a href="/administrator">administrator </a>';
	if (req.signedCookies['IsEmployee'] === 'true') outHead += '<a href="/employee">employee </a>';
	if (req.signedCookies['IsMerchant'] === 'true') outHead += '<a href="/merchant">merchant </a>';
	outHead += req.signedCookies['Username'];
	if (!/null/.test(req.signedCookies['WarehouseID'])) outHead += " with " + '<a href="/warehouse">warehouse </a>' + req.signedCookies['WarehouseID'];
	res.type ('html');
	res.status (200);
	// res.send(req.signedCookies).end();
	res.send (outHead).end;
	console.log("Cookies: ", req.signedCookies)
});

app.get('/foo', (req, res) => {
   res.status(200).send('Hello, foo!').end();
});

app.get('/process_get', function (req, res) {
	   // Prepare output in JSON format
    var response = {
          first_name:req.query.first_name,
          last_name:req.query.last_name
   };
    console.log(response);
    res.end(JSON.stringify(response));
 })

app.get('/administrator', function (req, res) {
    con.query('SELECT * from User', function (error, results, fields) {
		var i;
		var outPage = ` <table >
<tr>
<th>Username</th>
<th>IsAdmin</th>
<th>IsEmployee</th>
<th>IsMerchant</th>
<th>PhoneNumber</th>
<th>EmailAddress</th>
<th>UserID</th>
<th>WarehouseID</th>
</tr>\n
`;
		res.type ('html');
		res.status (200);

		for (i = 0; i < results.length; i++) {
			outPage += "<tr><td>" + results[i].Username + "</td>";
			outPage += "<td>" + results[i].IsAdmin + "</td>";
			outPage += "<td>" + results[i].IsEmployee + "</td>";
			outPage += "<td>" + results[i].IsMerchant + "</td>";
			outPage += "<td>" + results[i].PhoneNumber + "</td>";
			outPage += "<td>" + results[i].EmailAddress + "</td>";
			outPage += "<td>" + results[i].UserID + "</td>";
			outPage += "<td>" + results[i].Warehouse + "</td></tr>\n";
		}
		outPage += "\n</table>\n"
		res.send (outPage);
	});
});


app.post('/process_login', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   console.log(req.body);

    let nameRE = RegExp ("^[-a-z0-9_']{1,32}$");

    if (!nameRE.test(req.body.Username)) {
	res.status(400);
	res.send ("Illegal Name");
	return;
    }


    con.query('SELECT * from User where Username = "' + req.body.Username + '"', function (error, results, fields) {
	  if (error) throw error;
	  if (results.length === 0) {
		res.type ('html');
		res.status (400);
		res.send ('<a href="login.html">Bad login</a>');
	} else {
		console.log(results[0]);
		// if (results[0].PasswordHash === req.body.password) {
		if (true) {
			console.log ("Password Match");
			let options = {
				maxAge: 1000 * 60 * 5, // would expire after 5 minutes
				httpOnly: true, // The cookie only accessible by the web server
				signed: true // Indicates if the cookie should be signed
			}

			res.cookie('Username', req.body.Username, options);
			res.cookie('UserID', results[0].UserID, options);
			res.cookie('IsAdmin', results[0].IsAdmin, options);
			res.cookie('IsEmployee', results[0].IsEmployee, options);
			res.cookie('IsMerchant', results[0].IsMerchant, options);
			res.cookie('WarehouseID', results[0].WarehouseID, options);
			res.redirect ("/cookies");
		} else {
			res.status(400);
			res.send ("Bad Password");
		}
	}
})
})

app.post('/process_post', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   var response = {
      first_name:req.body.first_name,
      last_name:req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

app.post('/file_upload', upload.single('file-to-upload'), (req, res) => {
	  console.log(req.file.filename);
	  res.redirect('/');
});


// app.use(express.static('public'));


// Start the server
const PORT = process.env.PORT || 80;
var server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

// [END app]
