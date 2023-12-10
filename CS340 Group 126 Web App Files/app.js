// Citation for the following functions: app.get('/'), app.get('/Trails'), app.get('/Environments'), app.post('/add-environment-form'),
//                                       app.get('/ParkSystems'), app.post('/add-parkSystem-form'), app.put('/put-parkSystem-ajax'), 
//                                       app.get('/ParkPasses'), app.post('/add-parkPass-form'), app.get('/TrailDifficulties'), 
//                                       app.post('/add-difficulty-form'), app.get('/TrailEnvironments'), app.post('/add-trailEnvironment-form'),
//                                       app.delete('/delete-trailEnvironment-ajax/'), app.put('/put-trailEnvironment-ajax')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// Details for what exactly was used for each function are displayed above each function.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js


// App.js

// Citation for the following functions: SETUP SECTION
// Date: 11/30/2023
// Copied from GitHub Node.js starter app walkthrough guide
// Source URLs: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
//              https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%203%20-%20Integrating%20a%20Templating%20Engine%20(Handlebars)
//              https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
               

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
PORT        = 5834;                 // Set a port number at the top so it's easy to change in the future

var db = require('./database/db-connector');


const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



/*
    ROUTES
*/

// Citation for the following functions: app.get('/')
// Date: 11/30/2023
// Copied from GitHub Node.js starter app walkthrough guide
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%203%20-%20Integrating%20a%20Templating%20Engine%20(Handlebars)

// Route for displaying the homepage
app.get('/', function(req, res){
    return res.render('index')
});

// Citation for the following functions: app.get('/Trails')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// Changed the route, queries, and the page being rendered.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data

// Route handles READ functions for the Trails entity.
app.get('/Trails', function(req, res){  
    let query1 = "SELECT trailID, trailName, ParkSystems.parkName AS park, elevation, TrailDifficulties.difficultyName AS difficulty, length, avgTime, avalancheRisk FROM Trails INNER JOIN ParkSystems ON ParkSystems.parkID = Trails.parkID INNER JOIN TrailDifficulties ON TrailDifficulties.difficultyID = Trails.difficultyID;";           

    let query2 = "SELECT * FROM ParkSystems;";

    let query3 = "SELECT * FROM TrailDifficulties;";

    db.pool.query(query1, function(error, rows, fields){    

        let trails = rows;                       

        db.pool.query(query2, (error, rows, fields) => {

            let parkSystems = rows;
            
            db.pool.query(query3, (error, rows, fields) => {

                let difficulties = rows;
                return res.render('Trails', {data: trails, parkSystems: parkSystems, difficulties: difficulties});
            })
        })
    })                                                      
}); 

// Citation for the following functions: app.post('/add-trail-form')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The query was changed to be used with our database, and the redirect page was changed to redirect to the page we created.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Route handles CREATE functions for the Trails entity
app.post('/add-trail-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Trails (trailName, parkID, elevation, difficultyID, length, avgTime, avalancheRisk) VALUES 
    ('${data['input-name']}', '${data['input-park']}', '${data['input-elevation']}', '${data['input-difficulty']}', '${data['input-length']}',
    '${data['input-avgTime']}', '${data['input-avalancheRisk']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to Trails route
        else
        {
            res.redirect('/Trails');
        }
    })
});

// Citation for the following functions: app.delete('/delete-trail-ajax/')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// Changed the queries and variables to be applicable to our database.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// Route handles DELETE functions for the Trails entity.
app.delete('/delete-trail-ajax/', function(req,res,next){
    let data = req.body;
    let trailID = parseInt(data.id);
    let deleteTrail = `DELETE FROM Trails WHERE trailID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteTrail, [trailID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteTrail, [trailID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
})});

// Citation for the following functions: app.post('/put-trail-ajax')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// Changed the variables to reflect the variables needed to perform the two queries. Changed the queries to apply to our own database.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Route handles UPDATE functions for the Trails entity.
app.put('/put-trail-ajax', function(req,res,next){
    let data = req.body;
  
    let trailID = parseInt(data.trailID);
    let trail = data.trail;
    let park = parseInt(data.park);
    let elevation = parseFloat(data.elevation);
    let difficulty = parseInt(data.difficulty);
    let length = parseFloat(data.length);
    let avgTime = parseFloat(data.avgTime);
    let avalancheRisk = data.avalancheRisk;
  
    let queryUpdateTrailEnvironment = `UPDATE Trails SET trailName = ?, parkID = ?, elevation = ?, difficultyID = ?, length = ?, avgTime = ?, avalancheRisk = ? WHERE Trails.trailID = ?`;
    let selectPark = `SELECT * FROM Parks WHERE parkID = ?`
    let selectDifficulty = `SELECT * FROM TrailDifficulties WHERE difficultyID = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateTrailEnvironment, [trail, park, elevation, difficulty, length, avgTime, avalancheRisk, trailID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data
              else
              {
                  // Run the second query
                  db.pool.query(selectPark, [park], function(error, rows, fields){});
                  
                  // Run the third query
                  db.pool.query(selectDifficulty, [difficulty], function(error, rows, fields) {

                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
})}); 

// Citation for the following functions: app.get('/Environments')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The query was changed to be used with our database, and the page being rendered was changed to reflect our own handlebars file.
// Source URL:https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data

// Route handles READ function for the Environments entity.
app.get('/Environments', function(req, res){  
        let query1 = "SELECT * FROM Environments;";

        // Run the query
        db.pool.query(query1, function(error, rows, fields){
            
            // Render Environments page
            res.render('Environments', {data: rows});
        })
}); 

// Citation for the following functions: app.post('/add-environment-form')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The query was changed to be used with our database, and the redirect page was changed to redirect to the page we created.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Route handles CREATE function for the Environments entity.
app.post('/add-environment-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Environments (environmentName) VALUES ('${data['input-environment']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to Environments route
        else
        {
            res.redirect('/Environments');
        }
    })
});

// Citation for the following functions: app.get('/ParkSystems')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The queries were changed to be used with our database, and the page being rendered was changed to reflect our own handlebars file.
// Source URL:https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data

// Route handles READ function for the ParkSystems entity.
app.get('/ParkSystems', function(req, res) {
        let query1 = "SELECT parkID, parkName, location, IFNULL(ParkPasses.parkPassName, 'NULL') AS parkPass FROM ParkSystems LEFT JOIN ParkPasses ON ParkSystems.parkPassID = ParkPasses.parkPassID;";

        let query2 = "SELECT * FROM ParkPasses";

        // Run first query
        db.pool.query(query1, function(error, rows, fields){

            let parkSystems = rows;

            // Run second query
            db.pool.query(query2, (error, rows, fields) => {

                let parkPasses = rows;
                return res.render('ParkSystems', {data: parkSystems, parkPasses: parkPasses})
            })
        })
});

// Citation for the following functions: app.post('/add-parkSystem-form')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// Changed the NULL value capture to the only variable that can be NULL in this table. Changed the query to be used with our database. Changed the 
// redirect to redirect to our own handlebars page.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Route handles CREATE function for the ParkSystems entity.
app.post('/add-parkSystem-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // If parkPass is NULL, set the parkPass variable to NULL as a string
    let parkPass = parseInt(data['input-parkPass']);
    if (isNaN(parkPass))
    {
        parkPass = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO ParkSystems (parkName, location, parkPassID) VALUES ('${data['input-parkName']}', '${data['input-location']}', ${parkPass})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to ParkSystems route
        else
        {
            res.redirect('/ParkSystems');
        }
    })
});

// Citation for the following functions: app.post('/put-parkSystem-ajax')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// Changed the variables to reflect the variables needed to perform the two queries. Changed the queries to apply to our own database.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Route handles UPDATE function for the ParkSystems entity.
app.put('/put-parkSystem-ajax', function(req,res,next){
    let data = req.body;
  
    let parkSystem = parseInt(data.parkSystem);
    let parkPass = parseInt(data.parkPass);

    if (isNaN(parkPass)) {
        parkPass = "NULL"
    };
  
    let queryUpdatePark = `UPDATE ParkSystems SET parkPassID = ${parkPass} WHERE ParkSystems.parkID = ?`;
    let selectParkPass = `SELECT * FROM ParkPasses WHERE parkPassID = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdatePark, [parkSystem], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query
              else
              {
                  // Run the second query
                  db.pool.query(selectParkPass, [parkPass], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
})});

// Citation for the following functions: app.post('/ParkPasses')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The query was changed to be used with our database, and the page rendered was changed to the page we created.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data

// Route handles READ function for the ParkPasses entity.
app.get('/ParkPasses', function(req, res){  
    let query1 = "SELECT * FROM ParkPasses;";

    db.pool.query(query1, function(error, rows, fields){

        res.render('ParkPasses', {data: rows});
    })                                                     
});     

// Citation for the following functions: app.post('/add-parkPass-form')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The query was changed to be used with our database. The redirect page was changed to the page we created.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Route handles CREATE functionality for the ParkPasses entity.
app.post('/add-parkPass-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO ParkPasses (parkPassName) VALUES ('${data['input-parkPass']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to ParkPasses route
        else
        {
            res.redirect('/ParkPasses');
        }
    })
});

// Citation for the following functions: app.get('/TrailDifficulties')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The query was changed to be used with our database. The page rendered was changed to the page we created.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data

// Route handles READ function for the TrailDifficulties entity.
app.get('/TrailDifficulties', function(req, res){  
        let query1 = "SELECT * FROM TrailDifficulties;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('TrailDifficulties', {data: rows});                  // Render the TrailDifficulties.hbs file
        })                                                     
});                                                         

// Citation for the following functions: app.post('/add-difficulty-form')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The query was changed to be used with our database, the redirect page was changed to the page we created.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Route handles CREATE function for the TrailDifficulties entity.
app.post('/add-difficulty-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO TrailDifficulties (difficultyName) VALUES ('${data['input-difficulty']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to TrailDifficulties route
        else
        {
            res.redirect('/TrailDifficulties');
        }
    })
})

// Citation for the following functions: app.get('/TrailEnvironments')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// Added another query and modified the first 2 queries to be used with our database. Changed the render page to the page we created.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data

// Route handles READ function for the TrailEnvironments entity.
app.get('/TrailEnvironments', function(req, res){  
        let query1 = "SELECT trailEnvironmentID, Trails.trailName AS trail, Environments.environmentName AS environment FROM TrailEnvironments INNER JOIN Trails ON TrailEnvironments.trailID = Trails.trailID INNER JOIN Environments ON TrailEnvironments.environmentID = Environments.environmentID;";           

        let query2 = "SELECT * FROM Trails;";

        let query3 = "SELECT * FROM Environments;";

        db.pool.query(query1, function(error, rows, fields){    

            let trailEnvironments = rows;                       

            db.pool.query(query2, (error, rows, fields) => {

                let trails = rows;
                
                db.pool.query(query3, (error, rows, fields) => {

                    let environments = rows;
                    return res.render('TrailEnvironments', {data: trailEnvironments, trails: trails, environments: environments});
                })
            })
        })                                                      
});         

// Citation for the following functions: app.post('/add-trailEnvironment-form')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// Changed the query to be used with our database and changed the redirect page to the page we created.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data

// Route handles CREATE function for the TrailEnvironments entity.
app.post('/add-trailEnvironment-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO TrailEnvironments (trailID, environmentID) VALUES ('${data['input-trail']}', '${data['input-environment']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our TrailEnvironments route
        else
        {
            res.redirect('/TrailEnvironments');
        }
    })
});

// Citation for the following functions: app.delete('/delete-trailEnvironment-ajax/')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// Changed the queries and variables to be applicable to our database.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

// Route handles DELETE functionality for the TrailEnvironments entity.
app.delete('/delete-trailEnvironment-ajax/', function(req,res,next){
    let data = req.body;
    let trailEnvironmentID = parseInt(data.id);
    let deleteTrailEnvironment = `DELETE FROM TrailEnvironments WHERE trailEnvironmentID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteTrailEnvironment, [trailEnvironmentID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteTrailEnvironment, [trailEnvironmentID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
})});

// Citation for the following functions: app.put('/put-trailEnvironment-ajax')
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// Changed the variables and queries to be used with our database. 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Route handles UPDATE functionality for the TrailEnvironments entity.
app.put('/put-trailEnvironment-ajax', function(req,res,next){
    let data = req.body;
  
    let trailEnvironmentID = parseInt(data.trailEnvironmentID);
    let trail = parseInt(data.trail);
    let environment = parseInt(data.environment);
  
    let queryUpdateTrailEnvironment = `UPDATE TrailEnvironments SET trailID = ?, environmentID = ? WHERE TrailEnvironments.trailEnvironmentID = ?`;
    let selectTrail = `SELECT * FROM Trails WHERE trailID = ?`
    let selectEnvironment = `SELECT * FROM Environments WHERE environmentID = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdateTrailEnvironment, [trail, environment, trailEnvironmentID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query
              else
              {
                  // Run the second query
                  db.pool.query(selectTrail, [trail], function(error, rows, fields){});

                  // Run the third query
                  db.pool.query(selectEnvironment, [environment], function(error, rows, fields) {

                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
})}); 

// Citation for the following functions: Listener
// Date: 11/30/2023
// Copied from GitHub Node.js starter app walkthrough guide 
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});