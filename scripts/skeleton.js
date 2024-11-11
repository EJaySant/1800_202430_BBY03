function loadSkeleton(){
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {                   
            $('#footerPlaceholder').load('./text/footer.html');
        }
    });
}
loadSkeleton();

var footerElement = document.getElementById("footerPlaceholder");
footerElement.addEventListener("click", (event) => {
    var leftNav = document.getElementById("leftNavButton");
    var centerNav = document.getElementById("centerNavButton");
    var rightNav = document.getElementById("rightNavButton");
    if (footerElement.style.height === "6vh") {
        footerElement.style.height = "5px";
        leftNav.style.display = "none";
        centerNav.style.display = "none";
        rightNav.style.display = "none";
    } else {
        footerElement.style.height = "6vh";
        leftNav.style.display = "block";
        centerNav.style.display = "block";
        rightNav.style.display = "block";
    }

});