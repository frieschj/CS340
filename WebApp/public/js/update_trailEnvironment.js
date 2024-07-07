// Citation for the following functions: updateRow
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The variables and elements were updated to reflect our own database.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

let updateTrailEnvironmentForm = document.getElementById('update-trailEnvironment-form-ajax');

updateTrailEnvironmentForm.addEventListener("submit", function (e) {
   
    e.preventDefault();

    let inputTrailEnvironmentID = document.getElementById("input-trailEnvironmentID-update");
    let inputTrail = document.getElementById("input-trail-update");
    let inputEnvironment = document.getElementById("input-environment-update");

    let trailEnvironmentIDValue = inputTrailEnvironmentID.value;
    let trailValue = inputTrail.value;
    let environmentValue = inputEnvironment.value;

    if (isNaN(trailValue)) 
    {
        return;
    }

    if (isNaN(environmentValue))
    {
        return;
    }

    let data = {
        trailEnvironmentID: trailEnvironmentIDValue,
        trail: trailValue,
        environment: environmentValue,
    }
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-trailEnvironment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.response, trailEnvironmentIDValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));
})


function updateRow(data, trailEnvironmentID){
    let parsedData = JSON.parse(data);
    let table = document.getElementById("trailEnvironment-table");
    location.reload();
}
