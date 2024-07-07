// Citation for the following functions: deleteTrailEnvironment, deleteRow
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The routes and varialbes were changed to apply to the database we created.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js


function deleteTrail(trailID) {
    let data = {
        id: trailID
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-trail-ajax/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(trailID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    xhttp.send(JSON.stringify(data));
}

function deleteRow(trailID){
    let table = document.getElementById("trail-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       if (table.rows[i].getAttribute("data-value") == trailID) {
            table.deleteRow(i);
            break;
       }
    }
}