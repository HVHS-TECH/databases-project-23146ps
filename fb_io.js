/**************************************************************
 **************************************************************
 **                                                          **
 ** fb_io.js is where you will put common firebase functions **
 ** used throughout your code.                               **
 **                                                          **
 **************************************************************
 **************************************************************/
var GLOBAL_user;

var authenticationListener

function fb_login(){
    authenticationListener = firebase.auth().onAuthStateChanged(fb_handleLogin);
}

function fb_logout() {
    authenticationListener();
    firebase.auth().signOut();
    console.log("logged out");
    window.sessionStorage.removeItem('GLOBAL_user')
    showLoggedOut();
}

function logoutHome() {
    firebase.auth().signOut();
    console.log("logged out");
    window.sessionStorage.removeItem('GLOBAL_user')
    showLoggedOutHome();
}

function fb_handleLogin(_user) {
    if (_user) {
        console.log("User has logged in")
        GLOBAL_user = _user;
        console.log(GLOBAL_user)
        window.sessionStorage.setItem('GLOBAL_user', JSON.stringify(GLOBAL_user));
        showLoggedIn();
    } else {
        console.log("User is NOT logged in - Starting popup process")
        fb_popupLogin();
    }
}

function fb_popupLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        GLOBAL_user = result.user;
        console.log("User has logged in")
        showLoggedIn();
    });
}

function fb_error(error) {
    console.log("there was an error");
    console.log(error);
}