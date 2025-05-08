import {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import {signin} from "../Profile_Builder/script.js"

// const auth = getAuth();
$(document).on("click", "#signIn", function(evt){
    let email = document.getElementById("user").value;
    let password = document.getElementById("pass").value;
    signin(email,password);
});

// function signin(){
//     email = document.getElementById("user");
//     password = document.getElementById("pass");
//     signInWithEmailAndPassword(exportAuth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       console.log("User signed in:", user);
//       alert("sign-in comppleted");
//       window.location.href = "../mainPage/index.html";
//     })
//     .catch((error) => {
//       console.error("Error signing in:", error);
//     });
//     console.log("YAYYY working");
// }

// onAuthStateChanged(exportAuth, (user) => {
//     if(user){
//         console.log("User signed in: ", user);
//     } else{
//         console.log("User signed out");
//     }
// });