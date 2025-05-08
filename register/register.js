import { signup } from "../Profile_Builder/script.js";


$(document).on("click", "#register", function(evt){
    let email = document.getElementById("user").value;
    console.log(typeof email, email);
    let password = document.getElementById("pass").value;
    console.log(typeof password, password);
    signup(email, password);
});
