/* Represents the Firebase UI */
var ui = new firebaseui.auth.AuthUI(firebase.auth());

/*
Contains a callback that checks if the user has successfully 
created an account and, if successful, creates a user document 
representing their account details. 
It is used or called whenever the user tries to log in.
*/
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            var user = authResult.user;                            
            if (authResult.additionalUserInfo.isNewUser) {         
                db.collection("users").doc(user.uid).set({         
                       name: user.displayName,                    
                       email: user.email,                         
                }).then(function () {
                       window.location.assign("main.html");
                }).catch(function (error) {
                       console.log("Error adding new user: " + error);
                });
            } else {
                return true;
            }
                return false;
            },
        uiShown: function() {
            document.getElementById('loader').style.display = 'none';
        }
    },
    signInFlow: 'popup',
    signInSuccessUrl: "main.html",
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ]
};


ui.start('#firebaseui-auth-container', uiConfig);
