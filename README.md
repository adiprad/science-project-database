# science-project-database
Repo for science project database

# Setup PostgreSQL

- Make sure postgres 9.4 or higher is installed

- Create standard user

alter user postgres password 'somepassword'
create user myuser createdb createuser createrole password 'somepassword';
create database mydb owner myuser;


- Shortcut commands

\du - lists users
\l - lists tables in the current database
\d - shows relations
\d <table> - shows the table schema
\q - quit

- Create tables

-- Create userinfo table
CREATE TABLE userinfo(id SERIAL PRIMARY KEY not null, user_data JSONB not null);
\d 
\d userinfo
CREATE UNIQUE INDEX userinfo_email ON userinfo ((user_data->>'email'));
ALTER TABLE userinfo ADD CONSTRAINT email_not_null CHECK (char_length(user_data->>'email') > 0);
ALTER TABLE userinfo ADD CONSTRAINT name_not_null CHECK (char_length(user_data->>'name') > 0);
ALTER TABLE userinfo ADD CONSTRAINT adult_age CHECK ((user_data->>'age') >= '18');


# Setup NodeJS



# REST APIs
Here are the REST APIs supported by the Node-PostgreS application

## USER APIs

### Create user
POST /api/v1/user
Content-Type: application/json
```
{
	"user_data":
	{
	    "age": 30,
	    "name": "Dhruv",
	    "email": "dhruv@xyz.com"
	}
}
```

### Deletes user
DELETE /api/v1/user/{email}

### Gets all the existing user info
GET /api/v1/user

### Gets the user info
GET /api/v1/user/{email}


## Questions Reports APIs

### Upload the question info
POST /api/v1/user/{userId}/question/{questionType}
Content-Type: application/json

```
{
     "score_percent" : 0.99,
     "distraction_id" : 1,
     "time_taken" : 100
}
```

### Get all the question types for a particular user
GET /api/v1/user/{userId}/question

### Get the question type for a particular user
GET /api/v1/user/{userId}/question/{questionType}



