/*
Displays a back button on the page if the user is not on the main page.
It is called by the loadSkeleton function or
whenever the user enters one of the pages of the web app.
*/
function checkPage() {
    let leftButton = document.getElementById("leftNavButton");
    if (window.location.pathname != '/main.html') {
        leftButton.style.display = "block";
        leftButton.querySelector("a").href = "/main.html";
    } else {
        leftButton.style.display = "none";
    }
}
/*
Checks if the user is logged in and invokes checkPage function if so.
If the user is not logged in, they are redirected to the index.html or 
landing page.
It is invoked whenever a page loads, excluding the index and login pages.
*/
function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            checkPage();
        } else {
            window.location.href = "index.html";
        }
    });
}
loadSkeleton();