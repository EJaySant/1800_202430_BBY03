function checkPage() {
    let leftButton = document.getElementById("leftNavButton");
    if (window.location.pathname != '/main.html') {
        leftButton.style.display = "block";
        leftButton.querySelector("a").href = "/main.html";
    } else {
        leftButton.style.display = "none";
    }
}

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