var loadLimit = 10;

function displayCards(collection) {
    let cardTemplate = document.getElementById("postCardTemplate");
    let currentTime =  Date.now();

    db.collection(collection)
        .orderBy("time", "desc")
        .limit(loadLimit)
        .get()
        .then(allPosts => {
            allPosts.forEach(doc => {
                var tags = doc.data().item;
                var description = doc.data().description;
                var latitude = doc.data().latitude;
                var longitude = doc.data().longitude;
                var data = doc.data().image;

                let elapsed = currentTime - doc.data().time.toDate();
                var seconds = Math.floor(elapsed / 1000);
                var minutes = Math.floor(elapsed / 60000);
                var hours = Math.floor(elapsed / 3600000);
                var days = Math.floor(elapsed / 86400000);

                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector('.lostItemContainer').setAttribute("src", data);
                newcard.querySelector('.lostItemContainer').setAttribute("alt", tags);
                newcard.querySelector('.heading').innerHTML += tags.toString().charAt(0).toUpperCase() + tags.toString().substring(1) + " found";
                newcard.querySelector('.descriptionHolder').innerHTML = description;
                if (days >= 1) {
                    newcard.querySelector('.timeHolder').innerHTML = "Found " + days + " day" + ((days == 1) ? "" :"s") + " ago";
                } else if (hours >= 1) {
                    newcard.querySelector('.timeHolder').innerHTML = "Found " + hours + " hour" + ((hours == 1) ? "" :"s") + " ago";
                } else if (minutes >= 1) {
                    newcard.querySelector('.timeHolder').innerHTML = "Found " + minutes + " minute" + ((minutes == 1) ? "" :"s") + " ago";
                }else {
                    newcard.querySelector('.timeHolder').innerHTML = "Found " + seconds + " second" + ((seconds == 1) ? "" :"s") + " ago";
                }

                if (latitude && longitude) {
                    let locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    newcard.querySelector('.locationHolder').innerHTML = `Location: <a href="${locationUrl}" target="_blank">View on Map</a>`;
                } else {
                    newcard.querySelector('.locationHolder').innerHTML = "Location not available";
                }

                let directionsButton = newcard.querySelector('.getDirectionsButton');
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

                document.getElementById(collection + "Here").appendChild(newcard);
            });
        })
}

displayCards("posts");

document.getElementById("load").addEventListener("click", () => {
    resetDisplayCards();
    loadLimit += 10;
    displayCards("posts");
})

function resetDisplayCards() {
    let cardsArray = document.getElementsByClassName("card");
    let length = cardsArray.length;
    for (var i = 0; i < length; i++)
        document.getElementById("postsHere").removeChild(cardsArray[0]);
}