// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {  getFirestore, collection, doc, addDoc, getDocs, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA4bL1tslUI_gVB4fLhclsgKHFn_GzAPdA",
    authDomain: "it-placement-2002.firebaseapp.com",
    databaseURL: "https://it-placement-2002-default-rtdb.firebaseio.com",
    projectId: "it-placement-2002",
    storageBucket: "it-placement-2002.appspot.com",
    messagingSenderId: "991820287422",
    appId: "1:991820287422:web:79af1bd21521a62df93def",
    measurementId: "G-Y6N5E1NQCY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collectionRef = collection(db, "it-placement");
const passRef = doc(db, "password", "q6NvogWFN7VlSPL8J1fP");
const getQuestion = async (key) => {
    try {
      const querySnapshot = await getDocs(collectionRef);
      const filteredData = querySnapshot.docs.filter(doc => doc.data().year === key);
      return filteredData;
    } catch (error) {
      console.error("Error reading collection:", error);
      return null;
    }
};

const addQuestion = async (questionData) => {
    try {
      const docRef = await addDoc(collectionRef, questionData);
      return docRef.id;
    } catch (error) {
      console.error("Error adding question:", error);
      return null;
    }
};
  


const getPass = async (count) =>{
  try {
      const documentSnapshot = await getDoc(passRef);
      if (documentSnapshot.exists()) {
       return documentSnapshot.data().pass;
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error reading document:", error);
    }
}


export {
    getQuestion,
    addQuestion,
    getPass
};
