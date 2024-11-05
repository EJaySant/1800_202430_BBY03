function displayCards(collection) {
    let cardTemplate = document.getElementById("postCardTemplate"); 
    
    db.collection(collection).get()
        .then(allPosts => {
            allPosts.forEach(doc => {
                var tags = doc.data().item;
                var description = doc.data().description;
                var title = doc.data().title;
                var time = doc.data().time;
                let newcard = cardTemplate.content.cloneNode(true);

                newcard.querySelector('.tagHolder').innerHTML = "#" + tags;
                newcard.querySelector('.titleHolder').innerHTML = title;
                newcard.querySelector('.descriptionHolder').innerHTML = description;
                newcard.querySelector('.timeHolder').innerHTML = time;
                
                document.getElementById(collection + "Here").appendChild(newcard);
            });
        })
}

displayCards("posts");