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
  
    function showViewLiveResultButton() {
        if (window.self !== window.top) {
            return true;
        }
        return false;
    }
  
    function startup() {
        if (showViewLiveResultButton()) {
            return;
        }
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        photo = document.getElementById("photo");
        startButton = document.getElementById("start-button");
    
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error(`An error occurred: ${err}`);
                alert("Please enable camera access");
            });
    
        video.addEventListener(
            "canplay",
            (ev) => {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);
                if (isNaN(height)) {
                    height = width / (4 / 3);
                }
    
                video.setAttribute("width", width);
                video.setAttribute("height", height);
                canvas.setAttribute("width", width);
                canvas.setAttribute("height", height);
                streaming = true;
            }},
            false,
        );
    
        startButton.addEventListener(
            "click",
            (ev) => {
                takePicture();
                ev.preventDefault();
            },
            false,
        );
    
        clearPhoto();
        }
        function clearPhoto() {
            const context = canvas.getContext("2d");
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);
        
            const data = canvas.toDataURL("image/png");
            photo.setAttribute("src", data);
        }
        function takePicture() {
            const context = canvas.getContext("2d");
            if (width && height) {
                canvas.width = width;
                canvas.height = height;
                context.drawImage(video, 0, 0, width, height);
        
                const data = canvas.toDataURL("image/png");
                photo.setAttribute("src", data);

            } else {
                clearPhoto();
            }
        }
        window.addEventListener("load", startup, false);
})();

function coverOn() {
    document.getElementById("check").style.display = "block";
}

function coverOff() {
    document.getElementById("check").style.display = "none";
}

function confirmItem() {
    window.location.href="confirmReport.html";
}
// report.js

// Function to save the post to Firestore
function savePost(event) {
    // Prevent default form submission behavior
    event.preventDefault();

    // Get user inputs
    const title = document.getElementById("item-title").value.trim();
    const description = document.getElementById("item-description").value.trim();
    const tag = document.getElementById("item-category").value.trim();

    // Validate inputs
    if (title === "" || description === "" || tag === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Log inputs for debugging
    console.log("Inputs collected:", { title, description, tag });

    // Authenticate the user
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in, proceed to add the document
            db.collection("Lost_Items").add({
                owner: user.uid,
                title: title,
                description: description,
                tag: tag,
                last_updated: firebase.firestore.FieldValue.serverTimestamp() // Timestamp
            })
            .then(docRef => {
                console.log("Document written with ID: ", docRef.id);
                alert("Post saved successfully!");
                // Clear form fields
                document.getElementById("lost-found-post-form").reset();
            })
            .catch(error => {
                console.error("Error adding document: ", error);
                alert("Failed to save post. Please try again.");
            });
        } else {
            // No user is signed in
            console.log("No user is signed in.");
            alert("You must be logged in to post an item.");
        }
    });
}

// Attach the savePost function to the form submission
document.getElementById("lost-found-post-form").addEventListener("submit", savePost);
