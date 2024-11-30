/*
Grabs the video from the device's camera and takes a picture from the website itself.
It is called when the page first loads.
Copied and modified from: Mozilla - Taking still photos with getUserMedia()
https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos
*/
function captureMediaStream() {
    const width = 600;
    let height = 0;
    let streaming = false;
    let video = null;
    let canvas = null;
    let photo = null;
    let startButton = null;

    /*
    Creates and sets up the media stream from the user's device, and the event listeners that 
    activate and set up the video element and click event for the footer button.
    It is called when the first page loads.
    */
    function startup() {
        if (window.self !== window.top) {
            return;
        }

        video = document.getElementById("video");
        canvas = document.getElementById("canvas");
        photo = document.getElementById("photo");
        startButton = document.getElementById("start-button");

        
        document.getElementById("activate-video").onclick = () => {
            document.getElementById("activate-video").style.display = "none";
            document.getElementById("start-button").style.display = "flex";
            if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
                const constraints = {
                    video: {facingMode: {ideal: "environment"}}, 
                    audio: false 
                };
                startVideo(constraints); 
            }
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
                document.getElementById("video").play();
            }
        }
        
        /*
        Creates a media object used to capture pictures from the website itself via
        the user's device.
        */
        const startVideo = async (constraints) => {
            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            .catch((err) => {
                let photoBtn = document.getElementById("start-button");

                console.error(`An error occurred: ${err}`);

                photoBtn.disabled = true;
                photoBtn.style.backgroundColor = "grey";
                photoBtn.style.cursor = "default";

                alert("Please enable camera access");
            });;
            handleVideo(stream);
        };

        const handleVideo = (stream) => {
            video.srcObject = stream;
        };

        /*
        Event listener to take a picture when the user clicks on the white button in the footer.
        */
        startButton.addEventListener(
            "click",
            (ev) => {
                takePicture();
            }
        );
        clearPhoto();
    }

    /*
    Clears the canvas area and the image on the post submission form.
    It is called when the user first loads the page and when an error 
    occurs with the video's dimensions.
    */
    function clearPhoto() {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
    }

    /*
    Creates an image using canvas and displays that image on the post submission form.
    It is called whenever the user clicks on the white button in the footer.
    */
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


/*
Displays the post submission form.
It is called 
*/
function coverOn() {
    document.getElementById("check").style.display = "block";
    document.getElementById("video").pause();
}

/*
Hides the post submission form.
It is called when the user clicks on the cancel post button on the form.
*/
function coverOff() {
    document.getElementById("check").style.display = "none";
    document.getElementById("selection").style.boxShadow = "";
    document.getElementById("video").play();
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

//Creates the post of a lost item and sends it to the database.
//Posts include the user ID, item tag, description, time, geolocation and the data URL of the picture ()
function savePost() {
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
                    .serverTimestamp()
            }).then(function (docRef) {
                savePostIDforUser(docRef.id);
                navigator.geolocation.getCurrentPosition(position => {
                    var latit = position.coords.latitude;
                    var longi = position.coords.longitude;

                    db.collection("posts").doc(docRef.id).update({
                        latitude: latit,
                        longitude: longi
                    }).catch((error) => {
                        console.error("Error writing document: ", error);
                    });
                })
            })

        } else {
            console.log("No user is logged in.");
        }
    })
    coverOff();
}

function resetForm() {
    document.getElementById("lostItemForm").reset();
    document.getElementById("selection").style.boxShadow = "";
}

function checkSelect() {
    if (document.getElementById("selection").value != '') {
        document.getElementById("selection").style.boxShadow = "0 0 10px rgb(0, 179, 30)";
    }
}

function doubleCheck() {
    document.getElementById("confirmContainer").style.display = "block";
    document.getElementById("exitConfirm").addEventListener("click", (event) => {
        document.getElementById("confirmContainer").style.display = "none";
    });
    document.getElementById("confirm").addEventListener("click", (event) => {
        savePost();
        coverOff();
        document.getElementById("confirmContainer").style.display = "none";
        resetForm();
    });
}

function submitPost() {
    if (document.getElementById("selection").value != '') {
        doubleCheck();
    } else {
        document.getElementById("selection").style.boxShadow = "0 0 10px red";
    }
}



captureMediaStream();

document.getElementById("selection").addEventListener("change", checkSelect);

document.getElementById("submit").addEventListener("click", submitPost);


