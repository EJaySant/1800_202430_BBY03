//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {
    apiKey: "AIzaSyBXeHIquO2saftrelRf-PfApA4satO78vo",
    authDomain: "comp1800-202430-bby03.firebaseapp.com",
    projectId: "comp1800-202430-bby03",
    storageBucket: "comp1800-202430-bby03.appspot.com",
    messagingSenderId: "1015235424214",
    appId: "1:1015235424214:web:ab7f9bc7bf6d1b7869fe77"
};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
