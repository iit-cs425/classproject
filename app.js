'use strict';

console.log( __filename );

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser("cs425"));

// Set up Pug view engine to render things in /views
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


const fs = require("fs");

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const multer  = require('multer');
const upload = multer({
	  dest: 'uploads/' // this saves your file into a directory called "uploads"
});


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  database: 'cs425',
  username: 'cs425',
  password: 'cs425',
  dialect: 'mysql'
});

const Address = sequelize.import(__dirname + "/models/address.js")
const Warehouse = sequelize.import(__dirname + "/models/warehouse.js")
const User = sequelize.import(__dirname + "/models/user.js")
const Product = sequelize.import(__dirname + "/models/product.js")
const Category = sequelize.import(__dirname + "/models/category.js")
const Empassignedtowarehouse = sequelize.import(__dirname + "/models/empassignedtowarehouse.js")
const Productincategory = sequelize.import(__dirname + "/models/productincategory.js")
const Userhasaddress = sequelize.import(__dirname + "/models/userhasaddress.js")
Warehouse.hasOne(Address, { foreignKey: 'AddressID' });
Warehouse.hasOne(User, { as: 'Manager', foreignKey: 'ManagerID' });
Warehouse.hasMany(Product, { foreignKey: 'ProductID' });
Address.belongsToMany(User, {through: 'userhasaddress'});
User.hasMany(Category, { foreignKey: 'CategoryID'});
User.hasMany(Product, { foreignKey: 'ProductID'});
Product.belongsToMany(Category, { through: 'productincategory'});

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
	res.status(200).send(req.signedCookies).end();
	console.log("Cookies: ", req.signedCookies)
	console.log("Username: ", req.signedCookies['Username'])
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
		res.status(400);
		res.send ("Unknown Name");
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
			// res.redirect ("/cookies");
			res.redirect ("/LICENSE.html");
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


app.get('/change_address', function(req, res) {
    res.render('change_address', {
      formParams: 'foo'
    });
});


// Start the server
const PORT = process.env.PORT || 80;
var server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
