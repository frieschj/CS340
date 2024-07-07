// Citation for the following functions: updateRow
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The variables and elements were updated to reflect our own database.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

let updateParkSystemForm = document.getElementById('update-parkSystem-form-ajax');

updateParkSystemForm.addEventListener("submit", function (e) {

    e.preventDefault();

    let inputParkSystem = document.getElementById("input-parkName-update");
    let inputParkPass = document.getElementById("input-parkPass-update");

    let parkSystemValue = inputParkSystem.value;
    let parkPassValue = inputParkPass.value;
    
    // parkPass value is NULLable, so set parkPassValue to 'NULL' if NULL.
    if (isNaN(parkPassValue)) 
    {
        parkPassValue = 'NULL';
    }

    let data = {
        parkSystem: parkSystemValue,
        parkPass: parkPassValue,
    }
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-parkSystem-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.response, parkSystemValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));
})


function updateRow(data, parkSystemID){
    location.reload();
}
