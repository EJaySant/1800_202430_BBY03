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
function savePost() {
    alert ("SAVE POST is triggered");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            var desc = document.getElementById("description").value;
            db.collection("Lost_Items").add({
                owner: user.uid,
                description: desc,
                last_updated: firebase.firestore.FieldValue
                    .serverTimestamp() //current system time
            }).then(doc => {
                console.log("1. Post document added!");
                console.log(doc.id);
                uploadPic(doc.id);
            })
        } else {
            // No user is signed in.
                          console.log("Error, no user signed in");
        }
    });
}
// app.js
document.getElementById("inputForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Collect user input
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const tag = document.getElementById("tag").value;
    const timestamp = new Date().toISOString(); // Get the current date and time

    // Create an object to store the data
    const inputData = {
        title: title,
        description: description,
        tag: tag,
        timestamp: timestamp
    };

    // Push the data to Firebase
    const inputRef = database.ref('inputs'); // Reference to your Firebase database path
    inputRef.push(inputData)
        .then(() => {
            console.log("Data saved successfully!");
            // Clear the form fields
            document.getElementById("inputForm").reset();
        })
        .catch((error) => {
            console.error("Error saving data:", error);
        });
});

