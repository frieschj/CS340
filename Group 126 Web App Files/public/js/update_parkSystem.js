// Citation for the following functions: updateRow
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The variables and elements were updated to reflect our own database.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data


// Get the objects we need to modify
let updateParkSystemForm = document.getElementById('update-parkSystem-form-ajax');

// Modify the objects we need
updateParkSystemForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputParkSystem = document.getElementById("input-parkName-update");
    let inputParkPass = document.getElementById("input-parkPass-update");

    // Get the values from the form fields
    let parkSystemValue = inputParkSystem.value;
    let parkPassValue = inputParkPass.value;
    
    // parkPass value is NULLable, so set parkPassValue to 'NULL' if NULL.

    if (isNaN(parkPassValue)) 
    {
        parkPassValue = 'NULL';
    }


    // Put our data we want to send in a javascript object
    let data = {
        parkSystem: parkSystemValue,
        parkPass: parkPassValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-parkSystem-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, parkSystemValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, parkSystemID){
    
    location.reload();
}
