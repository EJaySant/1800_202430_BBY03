function checkPage() {
    let leftButton = document.getElementById("leftNavButton");
    if (window.location.pathname != '/main.html') {
        leftButton.style.display = "block";
        leftButton.querySelector("a").href = document.referrer;
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

function hideFooter() {
    let footerElement = document.getElementById("footernav");
    let centerNav = document.getElementById("centerNavButton");
    if (footerElement.style.height === "6vh") {
        footerElement.style.height = "5px";
        centerNav.style.display = "none";
    } else {
        footerElement.style.height = "6vh";
        centerNav.style.display = "block";
    }
}