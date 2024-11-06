<<<<<<< HEAD
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
(() => {
    const width = 600;
    let height = 0;
    let streaming = false;
    let video = null;
    let canvas = null;
    let photo = null;
    let startButton = null;
=======
// (() => {
//     const width = 600;
//     let height = 0;
//     let streaming = false;
//     let video = null;
//     let canvas = null;
//     let photo = null;
//     let startButton = null;
>>>>>>> 04b9058f4c7095eb471391b305f3588445fdc050
  
//     function showViewLiveResultButton() {
//         if (window.self !== window.top) {
//             return true;
//         }
//         return false;
//     }
  
//     function startup() {
//         if (showViewLiveResultButton()) {
//             return;
//         }
//         video = document.getElementById("video");
//         canvas = document.getElementById("canvas");
//         photo = document.getElementById("photo");
//         startButton = document.getElementById("start-button");
    
//         navigator.mediaDevices
//             .getUserMedia({ video: true, audio: false })
//             .then((stream) => {
//                 video.srcObject = stream;
//                 video.play();
//             })
//             .catch((err) => {
//                 console.error(`An error occurred: ${err}`);
//                 alert("Please enable camera access");
//             });
    
//         video.addEventListener(
//             "canplay",
//             (ev) => {
//             if (!streaming) {
//                 height = video.videoHeight / (video.videoWidth / width);
//                 if (isNaN(height)) {
//                     height = width / (4 / 3);
//                 }
    
//                 video.setAttribute("width", width);
//                 video.setAttribute("height", height);
//                 canvas.setAttribute("width", width);
//                 canvas.setAttribute("height", height);
//                 streaming = true;
//             }},
//             false,
//         );
    
//         startButton.addEventListener(
//             "click",
//             (ev) => {
//                 takePicture();
//                 ev.preventDefault();
//             },
//             false,
//         );
    
//         clearPhoto();
//         }
//         function clearPhoto() {
//             const context = canvas.getContext("2d");
//             context.fillStyle = "#AAA";
//             context.fillRect(0, 0, canvas.width, canvas.height);
        
//             const data = canvas.toDataURL("image/png");
//             photo.setAttribute("src", data);
//         }
//         function takePicture() {
//             const context = canvas.getContext("2d");
//             if (width && height) {
//                 canvas.width = width;
//                 canvas.height = height;
//                 context.drawImage(video, 0, 0, width, height);
        
//                 const data = canvas.toDataURL("image/png");
//                 photo.setAttribute("src", data);

//             } else {
//                 clearPhoto();
//             }
//         }
//         window.addEventListener("load", startup, false);
// })();

// function coverOn() {
//     document.getElementById("check").style.display = "block";
// }

// function coverOff() {
//     document.getElementById("check").style.display = "none";
// }

// function confirmItem() {
//     window.location.href="confirmReport.html";
// }


function savePostIDforUser(postDocID) {
    firebase.auth().onAuthStateChanged(user => {
          db.collection("users").doc(user.uid).update({
                myposts: firebase.firestore.FieldValue.arrayUnion(postDocID)
          }).catch((error) => {
                console.error("Error writing document: ", error);
           });
    })
}

function savePost() {
    // function success(position) {
    //     const latitude = position.coords.latitude;
    //     const longitude = position.coords.longitude;
    // }
    // function error() {
    //     value.textContent = "Unable to retrieve your location";
    // }
    // if (!navigator.geolocation) {
    //     alert("Geolocation is not supported by your browser");
    // } else {
    //     navigator.geolocation.getCurrentPosition(success, error);
    // }

    var desc = document.getElementById("description").value;
    var tag = document.getElementById("selection").value;
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("posts").add({
                owner: user.uid,
                item: tag,
                description: desc,
                time: firebase.firestore.FieldValue
                .serverTimestamp()
                // latitude: latitude,
                // longitude: longitude
            }).then(function (docRef) {
                savePostIDforUser(docRef.id);
            })
        } else {
            console.log("No user is logged in."); 
        }
    })
    
}

document.getElementById("submit").addEventListener("click", () => {
    savePost();
}); 

