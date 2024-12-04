/* Represents the default amount of posts to display. */
var loadLimit = 10;

/* Represents the search bar element as variable. */
var searchBar = document.getElementById("searchBar");

/*
Hides the inputed DOM element from the user. More specifically, the DOM element's display 
is set to none. 
It is called whenever a section of the posts are undefined like the geolocation or description.
Param: represents a DOM element that will be hidden
*/
function hideElement(element) {
    element.style.display = "none";
}

/*
Creates HTML cards that display the item name, description, time found, and assorted 
buttons and links to find the item's location. The function iterates for each given 
document given within the "posts" collection in the Firestore database. 

It is called whenever the findPost and displayAllCards functions are called in this page, 
which means its called when the user user searches for an item in the search bar and when
they first load into the page.

Param: represents an object that contains the result of a Firestore query
*/
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
            /*
            Creates the functionality of the "Get Direction" button to redirect the user to google maps with the relevant location of the item.
            It is called whenever the user clicks on the button. 
            */
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
Calls displayCard and creates cards for ALL unresolved posts or documents in the "posts" collection.
The cards consists of the item's name, picture, description, location and time when found.
It is called at the start when the user first loads in and whenever the search bar is empty. Specifically, 
the findPost function calls this function.
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
Removes ALL the currently displayed cards from the main page.
It is called when the user searches for posts/items.
*/
function resetDisplayCards() {
    let cardsArray = document.getElementsByClassName("card");
    let length = cardsArray.length;
    for (var i = 0; i < length; i++)
        document.getElementById("postsHere").removeChild(cardsArray[0]);
}

/*
Finds posts from the database with an item value that matches the user's search input.
It is called via an event listener whenever the user tries to enter a search input.
*/
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

/*
Updates the specified post that it has been resolved and found by the owner,
and will no longer be displayed when refreshed.
It is called whenever a user clicks on the "Resolve" button via an event listener.
Param: represents the ID of the document/post within the Firestore database to be resolved
*/
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

/*
Clears the inputed value within the search bar and invokes the findPost function to 
reset the displayed cards to its initial state.
It is called whenever the user clicks on the search bar via an event listener.
*/
function clearSearch() {
    searchBar.value = "";
    findPost();
}

displayAllCards();

/* 
    Upon clicking on the button with the id load, it will reset the displayed posts,
    Increase the amount of posts show by 10 and re show all the post again.
*/
document.getElementById("load").addEventListener("click", () => {
    resetDisplayCards();
    loadLimit += 10;
    findPost();
})

/* 
    When the search bar changes from the users inputs, it would update the web
    and find the post through findPost relating to the input. 
*/
searchBar.addEventListener("change", findPost);

/* 
    When the search bar gets clicked on, if there were any values on the search bar,
    it would clear the text with the clearSearch function.
*/
searchBar.addEventListener("click", clearSearch);