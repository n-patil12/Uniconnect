import {displayProfile} from './profile.js';
import { getDBObject, updateOrganizations, updateMembers } from './firebase.js';

let studentId = localStorage.getItem("userId");

//add members part of an organization
function addMember(name, description, avatar, id) {
    let list = document.getElementById("memberList");
    let item = document.getElementById("memberItem");
    
    let clone = item.content.cloneNode(true);

    clone.getElementById("memberName").textContent = name;
    clone.getElementById("memberBio").textContent = description;
    if(avatar != ""){ 
        clone.getElementById("memberPfp").src = avatar;
    }
    clone.querySelector(".mid").href = `profile.html?type=user&id=${id}`; 
    
    list.appendChild(clone);
}

//add upcoming events hosted by organization
function addEvent(date, description) {
    let list = document.getElementById("eventList");
    let item = document.getElementById("eventItem");
    
    let clone = item.content.cloneNode(true);

    clone.getElementById("eventDate").textContent = date;
    clone.getElementById("eventDescription").textContent = description;

    list.appendChild(clone);
}

//changes plain organization page to reflect organization's info
export function displayOrganization(org) {
    let name, mission, website, avatar;
    name = document.getElementById("organizationName");
    mission = document.getElementById("organizationMission");
    website = document.getElementById("organizationSite");
    avatar = document.getElementById("orgImg");
    
    if(org.avatar != ""){
        avatar.src = org.avatar; 
    }

    name.innerText = org.name;
    mission.innerText = org.mission;
    website.innerText = "";
    if (org.website !== ""){
        website.innerHTML = `<a href="${org.website}" target="_blank">${org.website}</a>`;
    }
    else{
        website.innerHTML = "";
       document.getElementById("website").remove();
    }
    document.getElementById("memberList").innerHTML = "";
    document.getElementById("eventList").innerHTML = "";
    org.members.forEach(async member => {
        getDBObject("students", member).then(data => {
            addMember(data.name, data.bio, data.avatar, member);
        });
    });

    org.events.forEach(async event => {
        getDBObject("events", event).then(data => {
            addEvent(data.date, data.description);
        });
    });

}

//function to update join/quit button text
function updateJoinButton(orgId, userOrgs) {
    let joinButton = document.getElementById("joinButton");
    if (userOrgs.includes(orgId)) {
        joinButton.innerText = "Leave";
    } else {
        joinButton.innerText = "Join";
    }
}

//function to toggle joining or quitting an organization
async function toggleOrgMembership(orgId) {
    let userId = "U123"; //placeholder for logged in user
    let org = await getDBObject("organizations", orgId);
    getDBObject("students", userId).then(user => {
        let index = user.organizations.indexOf(orgId);
        let index2 = org.members.indexOf(userId);
        if (index === -1) { //adds org to user's list and user to org's
            user.organizations.push(orgId);
            org.members.push(userId);
        } 
        else { //removes the user/org from each list 
            user.organizations.splice(index, 1);
            org.members.splice(index2, 1);
        }
        updateOrganizations("students", userId, user.organizations); //updates both documents with the addition/removal
        updateMembers("organizations", orgId, org.members);
        updateJoinButton(orgId, user.organizations); //update button text
    });
}

//handles functionality for join/quit button on organization page
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.href.includes("organization.html")) {
        let joinButton = document.getElementById("joinButton");
        let params = new URLSearchParams(window.location.search);
        const orgId = params.get("id");
        
        getDBObject("students", "U123").then(user => { //displays proper join status
            updateJoinButton(orgId, user.organizations);
        });
        
        joinButton.addEventListener("click", function() { //onClick functionality (join or quit group) 
            toggleOrgMembership(orgId);
        });    
    }
});
