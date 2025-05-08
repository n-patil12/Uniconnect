import { getDBObject } from "../profiles/firebase.js";

const carousel = document.querySelector('.carousel');
const backButton = document.getElementById('backButton');
const nextButton = document.querySelector('.nextButton');
import{getOrganizations, getOrganizationsByStuId, getOrganizationById, getStudents, getFriendsById} from "../Profile_Builder/script.js"

// nextButton.addEventListener('click',()=>{
//     carousel.scrollBy({left:300, behavior: "smooth"})
// });

let studentId = localStorage.getItem("userId");

$(document).on("click", "#nextButton", function(evt){
    console.log("nextButtom active");
    carousel.scrollBy({left:300, behavior: "smooth"})
});

document.addEventListener("DOMContentLoaded", (event) => {
    populateOrganizations();
    // populateOrganizationsByStudentId("JGx0rsMwjSVKdO3ThEqU9qVuf0k2");
    populateOrganizationsByStudentId(studentId);
    console.log("StudentID: ", studentId);

    populateNonFriends();
});

async function populateOrganizationsByStudentId(studentId){
    //let orgIds = await getOrganizationsByStuId(studentId);
    //console.log(orgIds);
    studentId = localStorage.getItem("userId"); 
    getOrganizationsByStuId(studentId).then(orgIds => {
        if(orgIds.length != 0){
            const carousel = document.getElementById("carousel1");
            carousel.innerHTML = "";
            for(const orgId in orgIds){
                //const org = await getOrganizationById(orgIds[orgId]);
                getOrganizationById(orgIds[orgId]).then(org => {
                    if(org){
                        const orgElement = document.createElement("a");
                        orgElement.href = `../profiles/organization.html?type=org&id=${org.id}`;
                        orgElement.className = "carousel-item";
                        orgElement.innerHTML = `<img src="${org.avatar}" alt="${org.name}">
                                                <p>${org.name}</p>`;
                        carousel.appendChild(orgElement);
                    }
                });
            }
        }else{
            const joinedCarousel = document.getElementById("joinedOrgs");
            joinedCarousel.remove();
        }
    });
    
}

async function populateOrganizations(){
    let organizations = await getOrganizations();
    let orgIds = await getOrganizationsByStuId(studentId);
        const carousel = document.getElementById("carousel");
        carousel.innerHTML = "";
        console.log(orgIds);
        organizations.forEach((org) =>{
            console.log((org.id).toString());
            console.log(!(orgIds.includes((org.id).toString())));
            if(!(orgIds.includes((org.id).toString()))){
                const orgElement = document.createElement("a");
                orgElement.href = `../profiles/organization.html?type=org&id=${org.id}`;
                orgElement.className = "carousel-item";
                orgElement.innerHTML = `<img src="${org.avatar}" alt="${org.name}">
                                        <p>${org.name}</p>`;
                carousel.appendChild(orgElement);
            }
        }); 
    
     
}

async function populateNonFriends(){
    let students = await getStudents();
    let friends = await getFriendsById(studentId);
    
    const carousel = document.getElementById("carousel3");
    carousel.innerHTML = "";
    //console.log();
    students.forEach((student) =>{
        console.log((student.id).toString());
        console.log(!(friends.includes((student.id).toString())));
        console.log(typeof student.id, student.id);
        console.log(typeof studentId, studentId);  
        if((!(friends.includes((student.id).toString()))) && student.id != studentId ){
            const orgElement = document.createElement("a");
            orgElement.href = `../profiles/profile.html?type=user&id=${student.id}`;
            orgElement.className = "carousel-item";
            orgElement.innerHTML = `<img src="${student.avatar}" alt="${student.name}">
                                    <p>${student.name}</p>`;
            carousel.appendChild(orgElement);
        }
    });

}
  



// backButton.addEventListener('click',()=>{
//     carousel.scrollBy({left:-200, behavior: "smooth"})
// });

document.addEventListener("DOMContentLoaded", function () {
    console.log("TEST")
    getDBObject("students", "U123").then( data => {
        const friend_requests = data.friend_requests;
        console.log(friend_requests)
        
        if(friend_requests.length !== 0){
            const dropdown = document.getElementById("dropdown");
            dropdown.innerHTML = "";
            friend_requests.forEach(request => {
                const container = document.querySelector(".request-container");
                const clone = container.content.cloneNode(true);
                getDBObject("students", request).then(data => {
                    clone.querySelector(".request").id = "req_" + request;
                    clone.querySelector("p").innerHTML = data.name;
                    clone.querySelector("a").href = `profile.html?type=user&id=${request}`;

                    const c = clone.querySelector(".check-button");
                    // const x = clone.querySelector(".x-button");
                    
                    c.onclick = () => acceptFriendRequest(request);
                    dropdown.appendChild(clone);
                });
            });
        }
        else {
            empty();
        }
    });
});