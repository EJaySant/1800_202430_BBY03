function logout() {
    firebase.auth().signOut().catch((error) => {
        console.log("An error has occured: " + error);
    });
}