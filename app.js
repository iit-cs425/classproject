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

const bcrypt = require('bcrypt');
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
Warehouse.belongsTo(User, { as: 'Manager', foreignKey: 'ManagerID', constraints: false});
Warehouse.hasOne(Address, { foreignKey: 'AddressID', constraints: false});
Warehouse.hasMany(Product, { foreignKey: 'ProductID' });
User.belongsToMany(Address, {through: 'userhasaddress', foreignKey: 'UserID', otherKey: 'AddressID'});
User.hasMany(Category, { foreignKey: 'CategoryID'});
User.hasMany(Product, { foreignKey: 'ProductID'});
User.belongsTo(Warehouse, {foreignKey: 'WarehouseID'})
Product.belongsToMany(Category, { through: 'productincategory'});
// Note - those constraints:false are because Users can have Warehouses, but
// Warehouses can have managers (Users).  It's not smart enough to figure out
// that it should create one table and then add the constraint, like
// `create.sql` does, so it'll fail with a cyclic dependency error.
// sequelize.sync().then(function() {
//   console.log("synced");
// });

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

app.get('/login', function(req, res) {
  res.render('login')
});

app.post('/process_login', urlencodedParser, function (req, res) {
   // Prepare output in JSON format
   console.log(req.body);

    let nameRE = RegExp ("^[-a-z0-9_'\.]{1,32}$");

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
    bcrypt.compare(req.body.password, results[0].Password).then(passOK => {
      if (passOK) {
        console.log ("Password Match");
        let options = {
          maxAge: 1000 * 60 * 15, // Cookies expire after 15 minutes
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
    });
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


app.get('/addresses', function(req, res) {
  // Show the user's entered addresses, with buttons to add or change them.
  User.findById(req.signedCookies['UserID']).then(user => {
    user.getAddresses().then(results => {
      res.render('show_addresses', {
        addresses: results
      });
    });
  });
});

/**
 * Delete an address given by AddressID, if it belongs to the signed-in user.
 */
app.get('/del_address/:AddressID', function(req, res) {
  User.findById(req.signedCookies['UserID']).then(user => {
    if (user === null) {
      res.status(400);
      res.send("User not found! Try logging in again.");
    } else {
      user.removeAddress(req.params['AddressID']).then(results => {
        res.send("Address was deleted.")
      });
    }
  });
});

/**
 * Prompt user to enter a new address.
 */
app.get('/new_address/', function(req, res) {
  res.render('new_address');
});

/**
 * Save a new address entered by the user.
 */
app.post('/new_address/', urlencodedParser, function(req, res) {
  User.findById(req.signedCookies['UserID']).then(user => {
    Address.create({
      ContactName: req.body.ContactName,
      CompanyName: req.body.CompanyName ? req.body.CompanyName : null,
      District: req.body.District ? req.body.District : null,
      Province_State: req.body.Province_State,
      Nation: req.body.Nation,
      PostalCode: req.body.PostalCode,
      City: req.body.City
    }).then(address => {
      user.addAddress(address);
      res.redirect("/addresses");
    }).catch(error => {
      res.send(error);
    });
  }).catch(error => {
    res.send(error);
  });
});

// TODO: make sure user owns address
/**
 * Prompt user to edit an address given by AddressID.
 */
app.get('/edit_address/:AddressID', function(req, res) {
  User.findById(req.signedCookies['UserID']).then(user => {
    Address.findById(req.params['AddressID']).then(address => {
      res.render('edit_address', {
        address: address.get()
      });
    });
  });
});

// TODO: make sure user owns address
/**
 * Edit an address owned by the user.
 */
app.post('/edit_address/', urlencodedParser, function(req, res) {
  User.findById(req.signedCookies['UserID']).then(user => {
    return Address.findById(req.body.AddressID);
  }).then(address => {
    return address.update({
      ContactName: req.body.ContactName,
      CompanyName: req.body.CompanyName ? req.body.CompanyName : null,
      District: req.body.District ? req.body.District : null,
      Province_State: req.body.Province_State,
      Nation: req.body.Nation,
      PostalCode: req.body.PostalCode,
      City: req.body.City});
  }).then(() => {
    res.redirect("/addresses");
  }).catch(error => {
    res.send("something went wrong");
  });
});

/**
 * Prompt user to change their password.
 */
app.get('/change_password', function(req, res) {
  res.render('change_password');
});

/**
 * Process a user's request to change their password.  If they authenticate,
 * their password was entered without typos, and wasn't terrible, update the
 * database with the hashed password + salt.
 */
app.post('/change_password', urlencodedParser, function(req, res) {
  User.findById(req.signedCookies['UserID']).then(user => {
    bcrypt.compare(req.body['oldPassword'], user.Password).then(passOK => {
      if (!passOK) {
        res.send("incorrect password");
      }
      if (req.body['password1'] !== req.body['password2']) {
        res.send("passwords didn't match");
      }
      const newPass = req.body['password1'];
      if (false) { // TODO: can't begin or end with whitespace; >=8 chars, printable ASCII only
        res.send("not up-to-par")
      }
      return bcrypt.genSalt(10);
    }).then(salt => {
      return bcrypt.hash(req.body['password1'], salt);
    }).then(hash => {
      return user.update({ Password: hash });
    }).then(result => {
      res.send("Password changed.");
    }).catch(error => {
      console.log(error);
      res.send("It didn't work");
    });
  }).catch(error => {
    res.send("Couldn't find your user.  Are you logged in?")
  })
});

// Start the server
const PORT = process.env.PORT || 80;
var server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
