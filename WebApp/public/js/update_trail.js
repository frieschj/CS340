// Citation for the following functions: updateRow
// Date: 11/30/2023
// Adapted from GitHub Node.js starter app walkthrough guide
// The variables and elements were updated to reflect our own database.
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

let updateTrailForm = document.getElementById('update-trail-form-ajax');

updateTrailForm.addEventListener("submit", function (e) {
   
    e.preventDefault();

    let inputTrailID = document.getElementById("input-trailID-update");
    let inputTrail = document.getElementById("input-trail-update");
    let inputPark = document.getElementById("input-park-update");
    let inputElevation = document.getElementById("input-elevation-update");
    let inputDifficulty = document.getElementById("input-difficulty-update");
    let inputLength = document.getElementById("input-length-update");
    let inputAvgTime = document.getElementById("input-avgTime-update");
    let inputAvalancheRisk = document.getElementById("input-avalancheRisk-update");

    let trailIDValue = inputTrailID.value;
    let trailValue = inputTrail.value;
    let parkValue = inputPark.value;
    let elevationValue = inputElevation.value;
    let difficultyValue = inputDifficulty.value;
    let lengthValue = inputLength.value;
    let avgTimeValue = inputAvgTime.value;
    let avalancheRiskValue = inputAvalancheRisk.value;

    let data = {
        trailID: trailIDValue,
        trail: trailValue,
        park: parkValue,
        elevation: elevationValue,
        difficulty: difficultyValue,
        length: lengthValue,
        avgTime: avgTimeValue,
        avalancheRisk: avalancheRiskValue
    }
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-trail-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.response, trailValue);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));
})


function updateRow(data, trail){
    location.reload();
}