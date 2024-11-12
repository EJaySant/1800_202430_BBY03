function displayCards(collection) {
    let cardTemplate = document.getElementById("postCardTemplate");

    db.collection(collection).get()
        .then(allPosts => {
            allPosts.forEach(doc => {
                var tags = doc.data().item;
                var description = doc.data().description;
                var location = doc.data().geolocation;
                var time = doc.data().time.toDate();  // Ensure correct conversion
                var data = doc.data().image;

                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector('.lostItemContainer').setAttribute("src", data);
                newcard.querySelector('.lostItemContainer').setAttribute("alt", tags);
                newcard.querySelector('.tagHolder').innerHTML = "#" + tags;
                newcard.querySelector('.descriptionHolder').innerHTML = description;
                newcard.querySelector('.timeHolder').innerHTML = time;

                // Check if location exists
                if (location && location.latitude && location.longitude) {
                    // Create a link to view the destination on Google Maps
                    let locationUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                    newcard.querySelector('.locationHolder').innerHTML = `Location: <a href="${locationUrl}" target="_blank">View on Map</a>`;
                } else {
                    newcard.querySelector('.locationHolder').innerHTML = "Location not available";
                }

                // Add "Get Directions" button functionality
                let directionsButton = newcard.querySelector('.getDirectionsButton');
                directionsButton.onclick = function () {
                    if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            let userLat = position.coords.latitude;
                            let userLng = position.coords.longitude;
                            let directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}`;
                            console.log(directionsUrl); // Log the directions URL
                            window.open(directionsUrl, "_blank"); // Open directions in a new tab
                        }, function(error) {
                            console.error("Geolocation Error: ", error);
                            alert("Unable to retrieve your location.");
                        });
                    } else {
                        console.log("Geolocation is not supported by this browser.");
                        alert("Geolocation is not supported by this browser.");
                    }
                };

                // Append the new card to the collection
                document.getElementById(collection + "Here").appendChild(newcard);
            });
        })
}

displayCards("posts");