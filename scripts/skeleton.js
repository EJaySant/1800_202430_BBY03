function loadSkeleton(){
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {                   
            $('#footerPlaceholder').load('./text/footer.html');
        } 
    });
}
loadSkeleton();