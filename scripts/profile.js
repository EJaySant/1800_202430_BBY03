var currentUser;

function userInfo() {
    firebase.auth().onAuthStateChanged(user => {
        if(user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
                .then(userDoc => {
                    let userName = userDoc.data().name;
                    let userEmail = userDoc.data().email;

                    if(userName != null) {
                        document.getElementById("name").innerHTML = userName;
                    }

                    if(userEmail != null) {
                        document.getElementById("gmail").innerHTML = userEmail;
                    }
                    
                    var myPosts = userDoc.data().myposts;
                    let cardTemplate = document.getElementById("postCardTemplate");

                    myPosts.forEach(postID => { 
                        db.collection("posts").doc(postID).get().then(doc => {

                            var tags = doc.data().item;
                            var description = doc.data().description;
                            var time = doc.data().time.toDate().toDateString();
                            var data = doc.data().image;

                            let newCard = cardTemplate.content.cloneNode(true);

                            newCard.querySelector('.lostItemContainer').setAttribute("src", data);
                            newCard.querySelector('.lostItemContainer').setAttribute("alt", tags);
                            newCard.querySelector('.tagHolder').innerHTML = "#" + tags;
                            newCard.querySelector('.descriptionHolder').innerHTML = description;
                            newCard.querySelector('.timeHolder').innerHTML = time;

                            document.getElementById("mypostsHere").appendChild(newCard);
                        })
                    })
                })

        }
        else {
            console.log("No one is logged in");
        }

    })
}

userInfo();