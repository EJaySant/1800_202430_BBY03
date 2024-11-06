function displayCards(collection) {
    let cardTemplate = document.getElementById("postCardTemplate"); 
    
    db.collection(collection).get()
        .then(allPosts => {
            allPosts.forEach(doc => {
                var tags = doc.data().item;
                var description = doc.data().description;
                var location = doc.data().geolocation;
                var time = doc.data().time.toDate(time);
                let newcard = cardTemplate.content.cloneNode(true);

                console.log(time);

                newcard.querySelector('.tagHolder').innerHTML = "#" + tags;
                // newcard.querySelector('.titleHolder').innerHTML = title;
                newcard.querySelector('.descriptionHolder').innerHTML = description;
                newcard.querySelector('.timeHolder').innerHTML = time;
                
                document.getElementById(collection + "Here").appendChild(newcard);
            });
        })
}

displayCards("posts");