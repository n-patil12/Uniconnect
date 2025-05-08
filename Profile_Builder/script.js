// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {getDatabase, ref, set, get, child} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { collection, addDoc, getDocs, setDoc, doc, getDoc,updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import { getIntrests } from "./interests.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyEhYX3lwFk11wmhb94R7lXuKMKTwbD2o",
  authDomain: "uniconnect2-13dab.firebaseapp.com",
  databaseURL: "https://uniconnect2-13dab-default-rtdb.firebaseio.com/",
  projectId: "uniconnect2-13dab",
  storageBucket: "uniconnect2-13dab.firebasestorage.app",
  messagingSenderId: "754035697766",
  appId: "1:754035697766:web:53c658117ae1fbaef4a5a7",
  measurementId: "G-T3M348EXE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);  
const db = getFirestore(app);
const auth = getAuth(app);

// export const exportAuth = auth;


let organizationsList = []; 
const interests = ["coding", "machine learning", "hackathons"];
const orgDescription = "We organize hackathons and coding workshops for students interested in AI.";
let studentId = localStorage.getItem("userId");
let name_field = "";
let age_field;
let pronoun_field = "";
let major_field = "";
let year_field;

export function signup(email, password){
    console.log(typeof email, email);
    console.log(typeof password, password);
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed up:", user);
      localStorage.setItem("userId", user.uid);
      window.location.href = "../Profile_Builder/index.html";
    })
    .catch((error) => {
      console.error("Error signing up:", error);
    });
}

export function signin(email,password){
  console.log(typeof email, email);
  console.log(typeof password, password);
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    // console.log("User signed in:", user);
    // alert("sign-in comppleted");
    localStorage.setItem("userId", user.uid);
    window.location.href = "../mainPage/index.html";
  })
  .catch((error) => {
    console.error("Error signing in:", error);
  });
  console.log("YAYYY working");
}


async function addStudentInfo(name, age, major, college_yr, organizations, friends, file) { // Accept the File object
  try {
    let avatarUrl = "../mainPage/images/person.png"; // Default URL

    if (file) {
      const storageRefrence = storageRef(storage, `avatars/${studentId}`); // Unique path for each user's avatar
      const snapshot = await uploadBytes(storageRefrence, file);
      avatarUrl = await getDownloadURL(snapshot.ref); // Get the public URL of the uploaded image
    }

    await setDoc(doc(db, "students", studentId), {
      name: name,
      age: age,
      major: major,
      bio: "",
      college_yr: college_yr,
      intrests: [],
      organizations: organizations,
      friends: friends,
      avatar: avatarUrl // Store the download URL in Firestore
    });
  } catch (error) {
    console.error("Student info or avatar didn't store properly: ", error);
  }
}


export async function addStudentIntrests(bio,intrests){
  try{
    await updateDoc(doc(db, "students", studentId), {
      bio: bio, 
      intrests: intrests
    });
  }
  catch (error){
    console.error("Student didn't store properly: ", error);
  }
}

async function addOrganization(OID, name, mission, website, members, events, avatar){
  try{
    await setDoc(doc(db, "organizations", OID), {
      name: name,
      mission: mission,
      website: website,
      members: members,
      events: events,
      avatar: avatar
    });
  }
  catch (error){
    console.error("Organization didn't store properly: ", error);
  }
}

async function addEvent(EID, date, description){
  try{
    await setDoc(doc(db, "events", EID), {
      date: date,
      description: description
    });
  }
  catch (error){
    console.error("Event didn't store properly: ", error);
  }
}


export async function getOrganizations(){
  let organizationsList = []; 
  const organizations = await getDocs(collection(db, "organizations"));
  organizations.forEach((doc) => {
    organizationsList.push({
      id: doc.id,
      ...doc.data()
    });
  });
  console.log(organizationsList);
  return organizationsList;
}

export async function getOrganizationsByStuId(stuId){
  let organizationsList = [];
  const student = await getDoc(doc(db, "students", stuId));
  if(student.exists()){
    organizationsList = student.data().organizations;
    console.log(organizationsList);
    return organizationsList;
  }else{
    return null;
  }
}

export async function getOrganizationById(orgId){
  const organization = await getDoc(doc(db, "organizations", orgId));
  if(organization.exists()){
    return {id: organization.id, ...organization.data()}
  }
  else{
    return null;
  }
}

export async function getStudents(){
  let studentsList = []; 
  const students = await getDocs(collection(db, "students"));
  students.forEach((doc) => {
    studentsList.push({
      id: doc.id,
      ...doc.data()
    });
  });
  console.log(studentsList);
  return studentsList;
}

export async function getFriendsById(studentId){
  let friendsList = [];
  const friends = await getDoc(doc(db, "students", studentId));
  friendsList = friends.data().friends;
  console.log(friendsList);
  return friendsList;
}


document.addEventListener("DOMContentLoaded", (event) => {
  getOrganizations();
  getStudents();
  //getSimilarity(interests, orgDescription);
  getFriendsById("U000");
});


$(document).on("click", "#submitButton", function(evt){
  console.log("Entering the function");
  // let name = $("#name").val();
  // let age = $("#age").val();
  // let major = $("#major").val();
  // let college_yr = $("#year").val();
  //let intrests = $("#intrests").val();
  let bio, intrests = getIntrests();
  let organizations = [];
  let avatar = "../mainPage/images/person.png";
  let friends = [];
  
  //addStudent(name_field, age_field, bio, major_field, year_field, intrests, organizations, friends, avatar);


  console.log("Hello I am working", name_field, age_field, bio, major_field, year_field, intrests, organizations, friends, avatar);
});

window.change_image = function change_image(){
  const fileInput = document.getElementById("input-file");
  const newAvatar = document.getElementById("new_avatar");
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onloadend = function() {
      newAvatar.src = reader.result; // Set the src to the data URL
    }

    reader.readAsDataURL(file); // Read the file as a data URL
  } else {
    // If no file is selected, you might want to reset to a default image
    newAvatar.src = "profile_pic.jpg"; // Or your default image path
  }
    
}

window.submission_check = function submission_check() {
  name_field = document.getElementById("profile_name").value;
  pronoun_field = document.getElementById("profile_pronouns").value;
  age_field = document.getElementById("profile_age").value;
  major_field = document.getElementById("profile_major").value;
  year_field = document.getElementById("profile_year").value;
  const fileInput = document.getElementById("input-file");
  const selectedFile = fileInput.files[0]; // Get the selected file

  if (name_field.length < 1) {
    alert("you must enter a name");
  } else if (pronoun_field.length < 1) {
    alert("you must enter your pronouns");
  } else if (age_field.length < 1) {
    alert("you must enter your age");
  } else if (major_field.length < 1) {
    alert("you must enter your major");
  } else if (year_field.length < 1) {
    alert("you must enter your year");
  } else {
    console.log("values", name_field, age_field, major_field, year_field, selectedFile);
    addStudentInfo(name_field, age_field, major_field, year_field, [], [], selectedFile) // Pass the File object
      .then(() => (window.location.href = "interests.html"));
  }
}

// const nat = require('natural');





// function getSimilarity(userInterests, orgDescription){
//   const tfidf = new nat.TfIdf();
//   tfidf.addDocument(userInterests.join(" "));

//   tfidf.tfidfs(orgDescription, function(i, measure) {
//       console.log(`Similarity score: ${measure}`);  
//   });
// }




// async function addClub(name, category) {
//   try{
//     const docRef = await addDoc(collection(db, "clubs"), {
//       name: name,
//       category: category
//   });
//   console.log("Club added with ID:", docRef.id);
//   } catch (e) {
//       console.error("Error adding document: ", e);
//   }
// }

// addClub("CS club","Technology");
// addClub("History","Someting");

// async function getClubs() {
//   const querySnapshot = await getDocs(collection(db, "clubs"));
//   querySnapshot.forEach((doc) => {
//     console.log(doc.id, " => ", doc.data());
//   });
// }

// getClubs();

// async function displayClubs() {
//   const querySnapshot = await getDocs(collection(db, "clubs"));
//   let clubList = document.getElementById("clubList");
//   clubList.innerHTML = "";

//   querySnapshot.forEach((doc) => {
//       let club = doc.data();
//       let listItem = document.createElement("li");
//       listItem.textContent = `${club.name} - ${club.category}`;
//       clubList.appendChild(listItem);
//   });
// }

// document.addEventListener("DOMContentLoaded", (event) => {
//   displayClubs();
// });



// get reference to database services
//const db = getDatabase(app);

