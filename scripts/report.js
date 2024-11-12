function captureMediaStream() {
    const width = 600;
    let height = 0;
    let streaming = false;
    let video = null;
    let canvas = null;
    let photo = null;
    let startButton = null;

// (() => {
//     const width = 600;
//     let height = 0;
//     let streaming = false;
//     let video = null;
//     let canvas = null;
//     let photo = null;
//     let startButton = null;
  
    function showViewLiveResultButton() {
        if (window.self !== window.top) {
            return true;
        }
        return false;
    }
  

function startup() {
        //Checks to see if the camera is at the top of the page
        if (window.self !== window.top) {
            return;
        }
        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        photo = document.getElementById("photo");
        startButton = document.getElementById("start-button");

        //Creates a video/camera object used to capture pictures from 
        //the website itself
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

        //Event listener that captures the video stream, sets its and the canvas' dimensions
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
                }
            },
            false,
        );

        //Event listener to take a picture.
        startButton.addEventListener(
            "click",
            (ev) => {
                takePicture();
            },
            false,
        );
        clearPhoto();
    }

    //Clears the canvas area.
    function clearPhoto() {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
    }

    //Creates an image using canvas.
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
    window.addEventListener("load", startup);
}
captureMediaStream();

//Displays the submission section.
function coverOn() {
    document.getElementById("check").style.display = "block";
}

//Removes the submission section from view.
function coverOff() {
    document.getElementById("check").style.display = "none";
}

//Updates the user's document with the myposts array and associated post.
function savePostIDforUser(postDocID) {
    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).update({
            myposts: firebase.firestore.FieldValue.arrayUnion(postDocID)
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    })
}

//Grabs the geolocation if the user enables it.
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            savePost(position.coords.latitude, position.coords.longitude);
        })
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

//Creates the post of a lost item and sends it to the database.
//Posts include the user ID, item tag, description, time, geolocation and the data URL of the picture ()
function savePost(lat, lng) {
    getLocation();

    var desc = document.getElementById("description").value;
    var tag = document.getElementById("selection").value;
    var photoData = document.getElementById("canvas").toDataURL();

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("posts").add({
                owner: user.uid,
                item: tag,
                description: desc,
                image: photoData,
                time: firebase.firestore.FieldValue
                    .serverTimestamp(),
                latitude: lat,
                longitude: lng
            }).then(function (docRef) {
                savePostIDforUser(docRef.id);
            })
        } else {
            console.log("No user is logged in.");
        }
    })
    resetForm();
    coverOff();
}

function resetForm() {
    document.getElementById("lostItemForm").reset();
}

document.getElementById("submit").addEventListener("click", () => {
    savePost();
    resetForm();
}); 
