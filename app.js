// App.js

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

// app.js

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.



/*
    ROUTES
*/

app.get('/', function(req, res) {
    return res.render('index')
});

app.get('/Trails', function(req, res) {
    return res.render('Trails')
});

app.get('/Environments', function(req, res)
    {  
        let query1 = "SELECT * FROM Environments;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('Environments', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    }); 

// app.js

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

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/Environments');
        }
    })
})

app.get('/ParkSystems', function(req, res) 
    {
        let query1 = "SELECT parkID, parkName, location, IFNULL(ParkPasses.parkPassName, 'NULL') AS parkPass FROM ParkSystems LEFT JOIN ParkPasses ON ParkSystems.parkPassID = ParkPasses.parkPassID;";

        let query2 = "SELECT * FROM ParkPasses";

        db.pool.query(query1, function(error, rows, fields){

            let parkSystems = rows;

            db.pool.query(query2, (error, rows, fields) => {

                let parkPasses = rows;
                return res.render('ParkSystems', {data: parkSystems, parkPasses: parkPasses})
            })
        })
});

// app.js

app.post('/add-parkSystem-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
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

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/ParkSystems');
        }
    })
});

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
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
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

app.get('/ParkPasses', function(req, res) {
    return res.render('ParkPasses')
});

app.get('/TrailDifficulties', function(req, res) {
    return res.render('TrailDifficulties')
});

app.get('/TrailEnvironments', function(req, res)
    {  
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

// app.js - ROUTES section

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

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/TrailEnvironments');
        }
    })
});

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
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectTrail, [trail], function(error, rows, fields){});

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
/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});