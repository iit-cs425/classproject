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


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

//
var mysql = require('mysql');

var con = mysql.createConnection({
	  host: "localhost",
	  user: "cs425",
	  password: "cs425",
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
 
app.get('/', (req, res) => {
   res.status(200).send('Hello, root!').end();
});

app.get('/cookies', (req, res) => {
	res.status(200).send(req.signedCookies).end();
	console.log("Cookies: ", req.signedCookies)
	console.log("user_name: ", req.signedCookies['user_name'])
});

app.get('/cookie2-set', (req,res)=>{

    let options = {
        maxAge: 1000 * 60 * 5, // would expire after 5 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: true // Indicates if the cookie should be signed
    }

    // Set cookie
    res.cookie('cookieName', 'cookieValue', options) // options is optional
    res.send('');
    console.log ("Cookie set done");

})

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


app.post('/process_login', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   var response = {
      user_name:req.body.user_name,
      password:req.body.password
   };
   console.log(response);
   // res.end(JSON.stringify(response));

    let options = {
        maxAge: 1000 * 60 * 5, // would expire after 5 minutes
        httpOnly: true, // The cookie only accessible by the web server
        signed: true // Indicates if the cookie should be signed
    }

    // Set cookie
    res.cookie('user_name', req.body.user_name, options) // options is optional
    res.send('');
    console.log ("Cookie set done");

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
