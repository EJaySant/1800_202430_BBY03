var currentUser;

/*
    UserInfo loads the user's information and posts. It does this by making sure that the user is logged in
    and using that information to check the users collection database. From the users database, it grabs the user's
    information, and any posts that the user has. UserInfo is used when the profile page loads.
*/
function userInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
                .then(userDoc => {
                    let profileImage = userDoc.data().image;
                    let userName = userDoc.data().name;
                    let userEmail = userDoc.data().email;

                    if (profileImage != null) {
                        document.getElementById("profileImage").innerHTML = profileImage;
                    }

                    if (userName != null) {
                        document.getElementById("name").value = userName;
                    }

                    if (userEmail != null) {
                        document.getElementById("gmail").value = userEmail;
                    }

                    var myPosts = userDoc.data().myposts;
                    let cardTemplate = document.getElementById("postCardTemplate");
                    let currentTime = Date.now();

                    myPosts.forEach(postID => {
                        db.collection("posts").doc(postID).get().then(doc => {

                            var tags = doc.data().item;
                            var description = doc.data().description;
                            var data = doc.data().image;

                            let latitude = doc.data().latitude;
                            let longitude = doc.data().longitude;

                            let elapsed = currentTime - doc.data().time.toDate();
                            var seconds = Math.floor(elapsed / 1000);
                            var minutes = Math.floor(elapsed / 60000);
                            var hours = Math.floor(elapsed / 3600000);
                            var days = Math.floor(elapsed / 86400000);

                            let newCard = cardTemplate.content.cloneNode(true);

                            newCard.querySelector('.lostItemContainer').setAttribute("src", data);
                            newCard.querySelector('.lostItemContainer').setAttribute("alt", tags);
                            newCard.querySelector('.heading').innerHTML += tags.toString().charAt(0).toUpperCase() + tags.toString().substring(1) + " found";
                            newCard.querySelector('.descriptionHolder').innerHTML = description;

                            if (description == "") {
                                hideElement(newCard.querySelector('.descriptionHolder'));
                            }

                            if (doc.data().finishPost == true) {
                                newCard.querySelector('.found').innerHTML = "Owner found the item";
                            }

                            if (days >= 1) {
                                newCard.querySelector('.timeHolder').innerHTML = "Found " + days + " day" + ((days == 1) ? "" : "s") + " ago";
                            } else if (hours >= 1) {
                                newCard.querySelector('.timeHolder').innerHTML = "Found " + hours + " hour" + ((hours == 1) ? "" : "s") + " ago";
                            } else if (minutes >= 1) {
                                newCard.querySelector('.timeHolder').innerHTML = "Found " + minutes + " minute" + ((minutes == 1) ? "" : "s") + " ago";
                            } else {
                                newCard.querySelector('.timeHolder').innerHTML = "Found " + seconds + " second" + ((seconds == 1) ? "" : "s") + " ago";
                            }
                            let directionsButton = newCard.querySelector('.getDirectionsButton');

                            if (latitude && longitude) {
                                let locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                                newCard.querySelector('.locationHolder').innerHTML = `Location:<br><a href="${locationUrl}" target="_blank">View on Map</a>`;
                            } else {
                                newCard.querySelector('.locationHolder').innerHTML = "Location not available";
                                hideElement(directionsButton);
                            }

                            directionsButton.onclick = function () {
                                if (latitude && longitude) {
                                    if ("geolocation" in navigator) {
                                        navigator.geolocation.getCurrentPosition(function (position) {
                                            let userLat = position.coords.latitude;
                                            let userLng = position.coords.longitude;

                                            let directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${latitude},${longitude}`;

                                            window.open(directionsUrl, "_blank");
                                        }, function (error) {
                                            console.error("Geolocation Error: ", error);
                                            alert("Unable to retrieve your location.");
                                        });
                                    } else {
                                        console.log("Geolocation is not supported by this browser.");
                                        alert("Geolocation is not supported by this browser.");
                                    }
                                } else {
                                    console.log("Post location is missing or incomplete.");
                                    alert("The post's location is not available.");
                                }
                            };


                            document.getElementById("mypostsHere").appendChild(newCard);
                        })
                    })
                })

        }
        else {
            console.log("No one is logged in");
        }

    })
}

/* 
    hideElement is used to hide an element from the html, without deleting it from the database. 
    The element variable can be any html element that you want to hide.
*/
function hideElement(element) {
    element.style.display = "none";
}

/*
    saveProfile is used to change the values shown on the profile page. It updates the
    database of the personal user, but for the username and gmail, it does not change 
    the user's log in information. This is called when the user presses the submit button
    on the profile page.
 */
function saveProfile() {
    let icon = document.getElementById("profileIcon");
    firebase.auth().onAuthStateChanged(user => {
        db.collection("users")
        .doc(user.uid).get()
        .then((doc) => {
            if (doc.data().image != null) {
                icon.setAttribute("src", doc.data().image);
            }
        });
    });
    
    document.getElementById("submit").addEventListener("click", (event) => {
        let file = document.querySelector("#profileImage").files[0];
        let reader = new FileReader();

        reader.onload = function (e) {
            firebase.auth().onAuthStateChanged(user => {
                db.collection("users").doc(user.uid).update({
                    image: reader.result
                })
            })
            icon.setAttribute("src", reader.result);
        }
                
        if (file) {
            reader.readAsDataURL(file);
        }

        userName = document.getElementById("name").value;
        userEmail = document.getElementById("gmail").value;

        firebase.auth().onAuthStateChanged(user => {
            db.collection("users").doc(user.uid).update({
                name: userName,
                email: userEmail
            })
        })
    })
}

userInfo();

saveProfile()