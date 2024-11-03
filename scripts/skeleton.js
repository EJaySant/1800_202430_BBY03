function loadSkeleton(){
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {                   
            $('#navbarPlaceholder').load('./text/nav_after_login.html');
            $('#footerPlaceholder').load('./text/footer.html');
        } else {
            // No user is signed in.
            $('#navbarPlaceholder').load('./text/nav_before_login.html');
            $('#footerPlaceholder').load('./text/footer.html');
        }
    });
}
loadSkeleton();