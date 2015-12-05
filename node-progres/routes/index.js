var express = require('express');
var router = express.Router();
var pg = require('pg');
var bodyParser = require('body-parser')

// var connectionString = process.env.DATABASE_URL || 'pg://pradosh:myTest@localhost:5432/reportdb';

var connectionString = process.env.DATABASE_URL;
console.log('ConnectionStr: ' + connectionString);

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// POST - Create user
router.post('/api/v1/user', function(req, res) {

    var results = [];

	if (!req.body) return res.sendStatus(400);

    // Grab data from http request
    // var data = {text: req.body.text};
    var postBody = JSON.stringify(req.body);
    console.log('Request JSON: ' + postBody);
    if (postBody.length == 2) {
    	res.set('Content-Type', 'application/json');
    	return res.status(400).json({ success: false, data: "Empty request" });
    }

    // SQL Query > Insert Data
    var userData = JSON.stringify(req.body.user_data);
    // Validate email address
    if (!validateEmail(req.body.user_data.email)) {
    	return res.status(400).json({ success: false, data: "Invalid email address + " + req.body.user_data.email});
    }

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log('pg.connect() failed : ' + err);
          return res.status(500).json({ success: false, data: err });
        }

        client.query("INSERT INTO userinfo(user_data) VALUES(($1)) RETURNING id", [userData], function(err, result) {
        	done();
        	if (err) {
        		console.log('query() failed : ' + err);
        		return res.status(500).json({ success: false, data: err });
        	}

        	console.log('GET result : ' + JSON.stringify(result.rows));
        	done();
        	return res.json(result.rows[0]);
        });

    });
});

// GET - Gets all the users or Gets one user if the ID is provided in the query string
router.get('/api/v1/user', function(req, res) {

    var results = [];

    // Check if query string 'id' parameter is supplied
    var id  = req.query.id;
    console.log("ID : " + id);

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log('pg.connect() failed : ' + err);
          return res.status(500).json({ success: false, data: err });
        }

        // SQL Query > Select Data
        if (id) {
        	console.log('Get the user with ID ' + id);
			client.query("SELECT * FROM userinfo WHERE id = ($1);", [id], function(err, result) {
	        	done();
	        	if (err) {
	        		console.log('query() failed : ' + err);
	        		return res.status(500).json({ success: false, data: err });
	        	}

	        	console.log('GET result : ' + JSON.stringify(result.rows));
	        	return res.json(result.rows);
	        });

        } else {
        	console.log('Gets all users');
	        client.query("SELECT * FROM userinfo;", function(err, result) {
	        	done();
	        	if (err) {
	        		console.log('query() failed : ' + err);
	        		return res.status(500).json({ success: false, data: err });
	        	}

	        	console.log('GET result : ' + JSON.stringify(result.rows));
	        	return res.json(result.rows);
	        });
	    }
    });
});

// GET - Gets the given user
router.get('/api/v1/user/:useremail', function(req, res) {

    var results = [];
    var email = req.params.useremail;
    if (!validateEmail(email)) {
    	return res.status(400).json({ success: false, data: "Invalid email address + " + email});
    }

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log('pg.connect() failed : ' + err);
          return res.status(500).json({ success: false, data: err });
        }

        // SQL Query > Select Data
        client.query("SELECT * FROM userinfo WHERE ((user_data->>'email') = $1);", [email], function(err, result) {
        	done();
        	if (err) {
        		console.log('query() failed : ' + err);
        		return res.status(500).json({ success: false, data: err });
        	}

        	console.log('GET result : ' + JSON.stringify(result.rows));
        	
        	if (result.rows.length == 0) {
        		console.log("No result");
        		return res.json({});
        	}
        	
        	return res.json(result.rows[0]);
        });

    });

});


router.delete('/api/v1/user/:useremail', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var email = req.params.useremail;
    if (!validateEmail(email)) {
    	return res.status(400).json({ success: false, data: "Invalid email address + " + email});
    }

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log('pg.connect() failed : ' + err);
          return res.status(500).json({ success: false, data: err });
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM userinfo WHERE ((user_data->>'email') = $1);", [email], function(err, result) {
			done();
        	if (err) {
        		console.log('query() failed : ' + err);
        		return res.status(500).json({ success: false, data: err });
        	}

        	console.log("DELETE result : " + JSON.stringify(result.rows));
        	return res.json({});
        })
    });

});


module.exports = router;





