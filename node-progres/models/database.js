var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://pradosh:myTest@localhost:5432/postgres';

// Connect to postgreSQL
var client = new pg.Client(connectionString);
client.connect();

var query = client.query('SELECT * FROM hstore_data where data->>\'id\' = \'1\'');
query.on('end', function() { 
   client.end(); 
});

