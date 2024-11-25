var currentUser;

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
                        document.getElementById("name").innerHTML = userName;
                    }

                    if (userEmail != null) {
                        document.getElementById("gmail").innerHTML = userEmail;
                    }

                    var myPosts = userDoc.data().myposts;
                    let cardTemplate = document.getElementById("postCardTemplate");
                    let currentTime =  Date.now();

                    myPosts.forEach(postID => {
                        db.collection("posts").doc(postID).get().then(doc => {

                            var tags = doc.data().item;
                            var description = doc.data().description;
                            var data = doc.data().image;

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

                            if (days >= 1) {
                                newCard.querySelector('.timeHolder').innerHTML = "Found " + days + " day" + ((days == 1) ? "" :"s") + " ago";
                            } else if (hours >= 1) {
                                newCard.querySelector('.timeHolder').innerHTML = "Found " + hours + " hour" + ((hours == 1) ? "" :"s") + " ago";
                            } else if (minutes >= 1) {
                                newCard.querySelector('.timeHolder').innerHTML = "Found " + minutes + " minute" + ((minutes == 1) ? "" :"s") + " ago";
                            }else {
                                newCard.querySelector('.timeHolder').innerHTML = "Found " + seconds + " second" + ((seconds == 1) ? "" :"s") + " ago";
                            }

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
userInfo();

function saveProfile() {
    document.getElementById("submit").addEventListener("click", (event) => {
        var file = document.querySelector("#profileImage").files[0];
        var reader = new FileReader();

        reader.onload = function (e) {
            firebase.auth().onAuthStateChanged(user => {
                db.collection("users").doc(user.uid).update({
                    image: reader.result
                })
            })
        }
        if (file) {
            reader.readAsDataURL(file);
        }
    })
}
saveProfile()