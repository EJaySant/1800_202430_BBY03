/*
Logs the user out of their current session on the website.
It is called whenever the user is on the landing or index page.
*/
function logout() {
    firebase.auth().signOut().catch((error) => {
        console.log("An error has occured: " + error);
    });
}