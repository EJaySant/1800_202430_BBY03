function captureMediaStream() {
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
}

captureMediaStream();

function coverOn() {
    document.getElementById("check").style.display = "block";
}

function coverOff() {
    document.getElementById("check").style.display = "none";
}

function savePostIDforUser(postDocID) {
    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).update({
            myposts: firebase.firestore.FieldValue.arrayUnion(postDocID)
        }).catch((error) => {
            console.error("Error writing document: ", error);
        });
    })
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePost);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function savePost(position) {
    var desc = document.getElementById("description").value;
    var tag = document.getElementById("selection").value;

    const crd = position.coords;
    var lat = crd.latitude;
    var lng = crd.longitude

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("posts").add({
                owner: user.uid,
                item: tag,
                description: desc,
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

