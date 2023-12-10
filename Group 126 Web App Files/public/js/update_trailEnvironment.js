// Citation for the following functions: updateTrailEnvironmentForm, updateRow
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The variables and elements were updated to reflect our own database.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
let updateTrailEnvironmentForm = document.getElementById('update-trailEnvironment-form-ajax');

// Modify the objects we need
updateTrailEnvironmentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTrailEnvironmentID = document.getElementById("input-trailEnvironmentID-update");
    let inputTrail = document.getElementById("input-trail-update");
    let inputEnvironment = document.getElementById("input-environment-update");

    // Get the values from the form fields
    let trailEnvironmentIDValue = inputTrailEnvironmentID.value;
    let trailValue = inputTrail.value;
    let environmentValue = inputEnvironment.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(trailValue)) 
    {
        return;
    }

    if (isNaN(environmentValue))
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        trailEnvironmentID: trailEnvironmentIDValue,
        trail: trailValue,
        environment: environmentValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-trailEnvironment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, trailEnvironmentIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, trailEnvironmentID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("trailEnvironment-table");

    location.reload();
}
