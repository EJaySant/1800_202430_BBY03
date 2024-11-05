function displayCards (collection) {
    let cardTemplate = document.getElementById("postBoxTemplate");
    
    db.collection(collection).get()
        .then(allPosts => {
            allPosts.forEach(doc => {
                var tags = doc.data().item;
                var description = doc.data().description;
                var title = doc.data().title;
                var time = doc.data().time;
                let newcard = boxTemplate.content.cloneNode(true);

                newcard.querySelector('.tagHolder').innerHTML = tags;
                newcard.querySelector('.titleHolder').innerHTML = title;
                newcard.querySelector('.descriptionHolder').innerHTML = description;
                newcard.querySelector('.timeHolder').innerHTML = time;
                
                document.getElementById("postsHere").appendChild(newcard);
            });
        })
}

displayCards("posts");