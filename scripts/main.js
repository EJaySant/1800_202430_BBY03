/*
Represents the default amount of posts to display.
*/
var loadLimit = 10;

var searchBar = document.getElementById("searchBar");

/*
A support function that hides the inputed DOM element from the user.
More specifically, the DOM element's display is set to none. 
Param: element represents a DOM element.
*/
function hideElement(element) {
    element.style.display = "none";
}

function displayCard(allPosts) {
    let cardTemplate = document.getElementById("postCardTemplate");
    let currentTime = Date.now();
    allPosts.forEach(doc => {
        if (doc.data().finishPost != true) {
            let tags = doc.data().item;
            let description = doc.data().description;
            let latitude = doc.data().latitude;
            let longitude = doc.data().longitude;
            let data = doc.data().image;
            let docID = doc.id;

            let elapsed = currentTime - doc.data().time.toDate();
            let seconds = Math.floor(elapsed / 1000);
            let minutes = Math.floor(elapsed / 60000);
            let hours = Math.floor(elapsed / 3600000);
            let days = Math.floor(elapsed / 86400000);

            let newcard = cardTemplate.content.cloneNode(true);

            newcard.querySelector('.lostItemContainer').setAttribute("src", data);
            newcard.querySelector('.lostItemContainer').setAttribute("alt", tags);
            newcard.querySelector('.heading').innerHTML += tags.toString().charAt(0).toUpperCase() + tags.toString().substring(1) + " found";
            newcard.querySelector('.descriptionHolder').innerHTML = description;

            newcard.querySelector('.submit').onclick = () => finishPost(docID);

            if (description == "") {
                hideElement(newcard.querySelector('.descriptionHolder'));
            }

            if (days >= 1) {
                newcard.querySelector('.timeHolder').innerHTML = "Found " + days + " day" + ((days == 1) ? "" : "s") + " ago";
            } else if (hours >= 1) {
                newcard.querySelector('.timeHolder').innerHTML = "Found " + hours + " hour" + ((hours == 1) ? "" : "s") + " ago";
            } else if (minutes >= 1) {
                newcard.querySelector('.timeHolder').innerHTML = "Found " + minutes + " minute" + ((minutes == 1) ? "" : "s") + " ago";
            } else {
                newcard.querySelector('.timeHolder').innerHTML = "Found " + seconds + " second" + ((seconds == 1) ? "" : "s") + " ago";
            }

            let directionsButton = newcard.querySelector('.getDirectionsButton');

            if (latitude && longitude) {
                let locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                newcard.querySelector('.locationHolder').innerHTML = `Location:<br><a href="${locationUrl}" target="_blank">View on Map</a>`;
            } else {
                newcard.querySelector('.locationHolder').innerHTML = "Location not available";
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

            document.getElementById("postsHere").appendChild(newcard);
        }

    });

}

/*
Creates cards for each post or document in the posts collection which consists of the item's name, 
picture, description, location and time when found.
Param: collection represents specific collection being displayed, which is the posts collection.
*/
function displayAllCards() {
    db.collection("posts")
        .orderBy("time", "desc")
        .limit(loadLimit)
        .get()
        .then(allPosts => {
            displayCard(allPosts)
        });
}

/*
Deletes all the cards elements from the main page.
*/
function resetDisplayCards() {
    let cardsArray = document.getElementsByClassName("card");
    let length = cardsArray.length;
    for (var i = 0; i < length; i++)
        document.getElementById("postsHere").removeChild(cardsArray[0]);
}

function findPost() {
    resetDisplayCards()
    let input = searchBar.value;
    if (input !== "") {
        db.collection("posts")
            .where("item", "==", input)
            .limit(loadLimit)
            .get()
            .then(allPosts => {
                displayCard(allPosts);
            });
    } else {
        displayAllCards();
    }
}

displayAllCards();

document.getElementById("load").addEventListener("click", () => {
    resetDisplayCards();
    loadLimit += 10;
    findPost();
})

searchBar.addEventListener("input", findPost);

function finishPost(postID) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("posts").doc(postID).update({
                finishPost: true
            })
        }
    })
    findPost();
}
