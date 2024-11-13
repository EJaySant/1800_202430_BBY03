function displayCards(collection) {
    let cardTemplate = document.getElementById("postCardTemplate");

    db.collection(collection).get()
        .then(allPosts => {
            allPosts.forEach(doc => {
                var tags = doc.data().item;
                var description = doc.data().description;
                var location = doc.data().geolocation;
                var time = doc.data().time.toDate();
                var data = doc.data().image;

                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector('.lostItemContainer').setAttribute("src", data);
                newcard.querySelector('.lostItemContainer').setAttribute("alt", tags);
                newcard.querySelector('.tagHolder').innerHTML = "#" + tags;
                newcard.querySelector('.descriptionHolder').innerHTML = description;
                newcard.querySelector('.timeHolder').innerHTML = time;

                if (location && location.latitude && location.longitude) {
                    let locationUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                    newcard.querySelector('.locationHolder').innerHTML = `Location: <a href="${locationUrl}" target="_blank">View on Map</a>`;
                } else {
                    newcard.querySelector('.locationHolder').innerHTML = "Location not available";
                }

                let directionsButton = newcard.querySelector('.getDirectionsButton');
                directionsButton.onclick = function () {
                    if (location && location.latitude && location.longitude) {
                        if ("geolocation" in navigator) {
                            navigator.geolocation.getCurrentPosition(function (position) {
                                let userLat = position.coords.latitude;
                                let userLng = position.coords.longitude;

                                let directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${location.latitude},${location.longitude}`;

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