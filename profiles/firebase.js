import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);



export async function getDBObject(type, ID){
  const docRef = doc(db, type, ID);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  else {
    console.log("Error: Document not found");
  }
}

export async function updateProfile(type, ID, nameInput, bioInput) {
  const docRef = doc(db, type, ID);

  await updateDoc(docRef, {
    name: nameInput,
    bio: bioInput
  });
}


export async function updateOrganizations(type, ID, organizationList) {
  const docRef = doc(db, type, ID);

  await updateDoc(docRef, {
    organizations: organizationList
  });
}

export async function updateMembers(type, ID, memberList) {
  const docRef = doc(db, type, ID);

  await updateDoc(docRef, {
    members: memberList
  });
}

export async function updateFriends(type, ID, friendList) {
  const docRef = doc(db, type, ID);

  await updateDoc(docRef, {
    friends: friendList
  });
}

export async function updateRequests(type, ID, requests) {
  const docRef = doc(db, type, ID);

  await updateDoc(docRef, {
    friend_requests: requests
  });
}