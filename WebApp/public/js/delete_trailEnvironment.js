// Citation for the following functions: deleteTrailEnvironment, deleteRow
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The routes and varialbes were changed to apply to the database we created.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js


function deleteTrailEnvironment(trailEnvironmentID) {
    let data = {
        id: trailEnvironmentID
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-trailEnvironment-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(trailEnvironmentID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
}

function deleteRow(trailEnvironmentID){
    let table = document.getElementById("trailEnvironment-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == trailEnvironmentID) {
            table.deleteRow(i);
            break;
       }
    }
}