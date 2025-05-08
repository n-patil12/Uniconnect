import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";

const auth = getAuth();

function signup(email, password){
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        console.log("User signed up:", user);
    })
    .catch((error) => {
        console.error("Error signing up:", error);
    });
}

function signin(email, password){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed in:", user);
    })
    .catch((error) => {
      console.error("Error signing in:", error);
    });
}

onAuthStateChanged(auth, (user) => {
    if(user){
        console.log("User signed in: ", user);
    } else{
        console.log("User signed out");
    }
});
