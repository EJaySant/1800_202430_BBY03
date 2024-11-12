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

                newcard.querySelector('.lostItemImage').setAttribute("src", data);
                newcard.querySelector('.lostItemImage').setAttribute("alt", tags)
                newcard.querySelector('.tagHolder').innerHTML = "#" + tags;
                // newcard.querySelector('.titleHolder').innerHTML = title;
                newcard.querySelector('.descriptionHolder').innerHTML = description;
                newcard.querySelector('.timeHolder').innerHTML = time;
                
                document.getElementById(collection + "Here").appendChild(newcard);
            });
        })
}

displayCards("posts");

