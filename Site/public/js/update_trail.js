// Citation for the following functions: updateRow
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The variables and elements were updated to reflect our own database.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Get the objects we need to modify
let updateTrailForm = document.getElementById('update-trail-form-ajax');

// Modify the objects we need
updateTrailForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTrail = document.getElementById("input-trail-update");
    let inputPark = document.getElementById("input-park-update");
    let inputElevation = document.getElementById("input-elevation-update");
    let inputDifficulty = document.getElementById("input-difficulty-update");
    let inputLength = document.getElementById("input-length-update");
    let inputAvgTime = document.getElementById("input-avgTime-update");
    let inputAvalancheRisk = document.getElementById("input-avalancheRisk-update");

    // Get the values from the form fields
    let trailValue = inputTrail.value;
    let parkValue = inputPark.value;
    let elevationValue = inputElevation.value;
    let difficultyValue = inputDifficulty.value;
    let lengthValue = inputLength.value;
    let avgTimeValue = inputAvgTime.value;
    let avalancheRiskValue = inputAvalancheRisk.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld\

    // Put our data we want to send in a javascript object
    let data = {
        trail: trailValue,
        park: parkValue,
        elevation: elevationValue,
        difficulty: difficultyValue,
        length: lengthValue,
        avgTime: avgTimeValue,
        avalancheRisk: avalancheRiskValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-trail-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, trailValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, trail){

    location.reload();
}