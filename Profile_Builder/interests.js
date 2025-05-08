import { addStudentIntrests } from "./script.js";

const selectedInterests = [];
let bio_field = "";

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.interest-card').forEach(function(button) {
        button.addEventListener('click', function(event) {
            interestCardClicked(event, selectedInterests);
        });
    });
});

window.interestCardClicked = function interestCardClicked(event, selectedInterests) {
    const clickedButton = event.currentTarget;
    const interestText = clickedButton.querySelector('br').nextSibling.textContent.trim().toUpperCase(); // Get the text content of the interest
    const isSelected = selectedInterests.includes(interestText);

    if (isSelected) {
        const index = selectedInterests.indexOf(interestText);
        if (index !== -1) {
            selectedInterests.splice(index, 1);
            clickedButton.style.borderColor = '#1c4544'; // Reset to default border color
            console.log(interestText + " removed from selected interests.");
        }
    } else {
        selectedInterests.push(interestText);
        clickedButton.style.borderColor = 'yellow'; // Change border color on selection
        console.log(interestText + " added to selected interests.");
    }

    console.log("Current selected interests:", selectedInterests);
}

window.submission_check_bio = function submission_check_bio(){

    bio_field = document.getElementById("profile_bio").value;

    if (bio_field.length < 1){
        alert("You must enter a bio.");
        return; // Stop further execution if bio is empty
    }

    if (selectedInterests.length < 1) {
        alert("You must select at least one interest.");
        return; // Stop further execution if no interests are selected
    }

    // If both bio and at least one interest are selected, proceed
    addStudentIntrests(bio_field, selectedInterests).then(() => (window.location.href = "../mainPage/index.html"));
}

export function getIntrests(){
    return bio_field, selectedInterests;
}