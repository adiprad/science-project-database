var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://pradosh:myTest@localhost:5432/postgres';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// POST
router.post('/api/v1/test/report', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {text: req.body.text};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO hstore_data(data) values($1)", [data.text]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM hstore_data");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });


    });
});


module.exports = router;


