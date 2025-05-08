import {displayOrganization} from "./organization.js"
import { getDBObject, updateFriends, updateProfile, updateRequests } from "./firebase.js";

//Uses string inputs to add profile banners to friends section on a profile page
//likely will change to some sort of ID for db referencing
let studentId = localStorage.getItem("userId");

function addFriend(name, bio, avatar, id) {
    let list = document.getElementById("friendList"); //section reference
    let item = document.getElementById("friendItem"); //template reference
    
    let clone = item.content.cloneNode(true);

    clone.getElementById("friendName").textContent = name;
    clone.getElementById("friendBio").textContent = bio;
    if(avatar != ""){ //accounts for default pfp
        clone.getElementById("friendPfp").src = avatar;
    }
    clone.querySelector(".uid").href = `profile.html?type=user&id=${id}`; //passes id through url

    list.appendChild(clone); //adds new item to list section
}

//Uses string inputs to add organization banners to organizations section on a profile page
function addOrg(name, description, avatar, id) {
    let list = document.getElementById("organizationList");
    let item = document.getElementById("organizationItem");
    
    let clone = item.content.cloneNode(true);

    clone.getElementById("orgName").textContent = name;
    clone.getElementById("orgDescription").textContent = description;
    if(avatar != ""){
        clone.getElementById("orgPfp").src = avatar;
    }
    clone.querySelector(".oid").href = `organization.html?type=org&id=${id}`;

    list.appendChild(clone);
}

//Changes plain profile page to display the contents of a particular user
//Currently takes object input but will likely use an db ID later
export function displayProfile(user) {
    //setting variables 
    let name, major, bio, classes, interests, avatar;
    name = document.getElementById("userName");
    major = document.getElementById("userMajor");
    bio = document.getElementById("userBio");
    classes = document.getElementById("userClasses");
    interests = document.getElementById("userInterests");
    avatar = document.getElementById("pfp");

    if(user.avatar != ""){ //default pfp
        avatar.src = user.avatar; 
    }

    //Appending text to respective spots
    name.innerText = user.name;
    major.innerText = user.major;
    bio.innerText = user.bio;
    interests.innerText = "";
    for(let i = 0; i < user.intrests.length; i++){
        if(i != user.intrests.length - 1){
            interests.innerText += " " + user.intrests[i] + ",";
        }
        else{
            interests.innerText += " " + user.intrests[i];
        }
    }

    document.getElementById("friendList").innerHTML = "";
    document.getElementById("organizationList").innerHTML = "";
    //creates the banners for user's friends and organizations
    user.friends.forEach(friend => {
        getDBObject("students", friend).then(data =>{
            addFriend(data.name, data.bio, data.avatar, friend);
        });             
    });

    user.organizations.forEach(async org => {
        getDBObject("organizations", org).then(data =>{
            addOrg(data.name, data.mission, data.avatar, org);        
        });
    });

}

//initializes profile or organization with content stored in db, retrieved from url
document.addEventListener("DOMContentLoaded", async function () {
    let params = new URLSearchParams(window.location.search); //retrieves query string
    const type = params.get("type"); //get id and type from url
    const id = params.get("id"); 

    if (id != null) { //changes to selected profile or org page if it exists
        if (type === "user") {
            getDBObject("students", studentId).then(data => {
                displayProfile(data);
                if(studentId != studentId){ //edit icon only appears to logged in account
                    const edit = document.getElementById("edit");
                    const button = document.createElement("button");
                    button.innerText = ""
                    button.id = "friend-button"
                    edit.replaceWith(button);
                }
            });
        }        
        else {
            getDBObject("organizations", id).then(data => {
                displayOrganization(data);
            });
        }
    }  
    else { //default user profile when first starting page 
        if(window.location.href.includes("profile.html")){
            getDBObject("students", studentId).then(data => {
                displayProfile(data);
                if(id != studentId){ //edit icon only appears to logged in account
                    document.getElementById("edit").remove();
                }
            });
        }
        else if(window.location.href.includes("organization.html")){
            getDBObject("organizations", "O3").then(data => {
                displayOrganization(data);
            });
        }        
    }
});

function updateFriendButton(id, friendList, friendRequests) {
    let button = document.getElementById("friend-button");

    function addButton(id, list){
        updateRequests("students", id, list);
        button.innerText = "Request sent";
        button.disabled = true;
    }

    function removeButton(id, userFriends, otherFriends, requests){
        updateFriends("students", studentId, userFriends);
        updateFriends("students", id, otherFriends);
        
        button.innerText = "Add";
        button.disabled = false;
        button.onclick = () => addButton(id, friendRequests);
    }

    getDBObject("students", studentId).then(data => {
        if (friendList.includes(studentId)) { //remove friend
            button.innerText = "Remove";
            button.disabled = false;

            const userFriends = data.friends;
            const index = userFriends.indexOf(id);
            userFriends.splice(index, 1);
            
            const index2 = friendList.indexOf(studentId);
            friendList.splice(index2, 1);
            
            friendRequests.push(studentId);
            button.onclick = () => removeButton(id, userFriends, friendList, friendRequests);
        } 
        else if (friendRequests.includes(studentId)) { //pending friend request
            button.innerText = "Request sent";
            button.disabled = true;
        }
        else { //not yet added
            button.innerText = "Add";
            button.disabled = false;

            friendRequests.push(studentId);
            button.onclick = () => addButton(id, friendRequests);
        }
    });

    
}

if(window.location.href.includes("profile.html")){
    let editMode = false; //changes event for icon, either enables editing or saves edits
    let params = new URLSearchParams(window.location.search); //retrieves query string
    const id = params.get("id"); 

    //event listener for "edit" button, allows users to change and save information
    //on their profile
    if(id === studentId) {
        const edit = document.getElementById("edit");
        edit.style.visibility = "visible";
        edit.addEventListener("click", function(){    
            if(editMode) {//save inputs with checkmark
                //capture input elements
                const input1 = document.getElementById('nameInput');  
                const input2 = document.getElementById('bioInput');
                
                //create text elements
                const h2 = document.createElement("h2");
                const p = document.createElement("p");
                h2.id = "userName";
                p.id = "userBio";
    
                //take text from input into text element
                h2.innerHTML = input1.value;
                p.innerHTML = input2.value;
    
                input1.replaceWith(h2);//replace elements
                input2.replaceWith(p);
    
                updateProfile("students", id, h2.innerHTML, p.innerHTML); //updates database with changes
    
                document.getElementById("edit").className = "fa-solid fa-pencil"; //change icon
            }
            else {//initialize edits with pencil icon
                //capture text elements
                const name = document.getElementById("userName");
                const bio = document.getElementById("userBio");
    
                //create input elements
                const input1 = document.createElement("input");
                const input2 = document.createElement("input");
                input1.type = 'text';
                input2.type = 'text';
                input1.id = "nameInput";
                input2.id = "bioInput";
    
                //save current text have as content in input
                input1.value = name.innerText;
                input2.value = bio.innerText;
    
                name.replaceWith(input1); //replace elements
                bio.replaceWith(input2);
    
                document.getElementById("edit").className = "fa-solid fa-circle-check"; //change icon
            }
            editMode = !editMode; //toggle edit mode
        });
    }
    else {
        document.addEventListener("DOMContentLoaded", () => {
            getDBObject("students", id).then(data => {
                updateFriendButton(id, data.friends, data.friend_requests);
            });
        });
    }
    
}

function empty(){
    const dropdown = document.getElementById("dropdown");
    dropdown.innerHTML = "<p>No requests</p>";
}


export async function acceptFriendRequest(ID){
    let user = null;
    let other = null;
    user = await getDBObject("students", studentId);
    other = await getDBObject("students", ID);
    if(user !== null && other !== null){
        let userFriends = user.friends;
        userFriends.push(ID);
        
        let otherFriends = other.friends;
        otherFriends.push(studentId);
        
        let userRequests = user.friend_requests;
        let index = userRequests.indexOf(ID);
        userRequests.splice(index, 1);

        updateFriends("students", studentId, userFriends);
        updateFriends("students", ID, otherFriends);
        updateRequests("students", studentId, userRequests);

        addFriend(other.name, other.bio, other.avatar, ID);
        document.getElementById("req_" + ID).remove();
        if(userRequests == []){
            empty();
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    getDBObject("students", studentId).then( data => {
        const friend_requests = data.friend_requests;

        // if(friend_requests.length > 0){
        //     const icon = document.getElementById("group-message-icon");
        //     const notifcation = document.createElement("div");
        //     notifcation.innerHTML=`<span class="badge">${friend_requests.length}</span>`;
        //     icon.appendChild(notifcation);
        //     console.log(icon);
        // }
        
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