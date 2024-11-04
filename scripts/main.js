function displayCards (collection) {
    let cardTemplate = document.getElementById("postBoxTemplate");
    
    db.collection(collection).get();
}