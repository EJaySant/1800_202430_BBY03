function displayCards(collection) {
    let cardTemplate = document.getElementById("postCardTemplate");

    db.collection(collection).get()
        .then(allPosts => {
            allPosts.forEach(doc => {
                var tags = doc.data().item;
                var description = doc.data().description;
                var location = doc.data().geolocation;
                var time = doc.data().time.toDate(time);
                var data = doc.data().image;

                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector('.lostItemContainer').setAttribute("src", data);
                newcard.querySelector('.lostItemContainer').setAttribute("alt", tags)
                newcard.querySelector('.tagHolder').innerHTML = "#" + tags;
                // newcard.querySelector('.titleHolder').innerHTML = title;
                newcard.querySelector('.descriptionHolder').innerHTML = description;
                newcard.querySelector('.timeHolder').innerHTML = time;
                if (location && location.latitude && location.longitude) {
                    let locationUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

                    // Get the "Get Directions" button and set up the click handler
                    let directionsButton = newcard.querySelector('.getDirectionsButton');
                    directionsButton.onclick = function () {
                        window.open(locationUrl, "_blank"); // Open Google Maps in a new tab
                    };
                } else {
                    newcard.querySelector('.locationHolder').innerHTML = "Location not available";
                }


                document.getElementById(collection + "Here").appendChild(newcard);
            });
        })
}

displayCards("posts");

