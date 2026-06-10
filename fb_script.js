console.log("Running Sal's Strawberries")

const HTML_LOGIN = document.getElementById("loginButton");

const HTML_NAME = document.getElementById("name");
const HTML_AGE = document.getElementById("favoriteFruit");

const HTML_FORM_ERROR = document.getElementById("formError");

const HTML_SUBMIT_BUTTON = document.getElementById("submitButton");

const HTML_TEXT_OUTPUT = document.getElementById("statusMessage");

var loggedIn = false

function fb_authenticate() {
    fb_login();
}


function showLoggedIn() {
    // make it so that it automaticaly redirects to index.html if uid = userdata/$uid
    if (GLOBAL_user.uid) {

    } else {

    }
    let userName = GLOBAL_user.displayName
    HTML_LOGIN.innerHTML = "<h3> Logged in as " + userName + " </h3> <button onclick='fb_logout()'>logout</button>"
    HTML_SUBMIT_BUTTON.innerHTML = '<button onclick="writeForm()">Submit</button>'
    /*
    let userID = GLOBAL_user.uid;
    let userImage = GLOBAL_user.photoURL;
    console.log(userID);

    firebase.database().ref("salsstrawberries/users/" + userID).set({

        name: HTML_NAME,
        favoriteFruit: HTML_FRUIT,
        fruitQuantity: HTML_AMOUNT

    });
    */
}

function showLoggedOut() {
    HTML_LOGIN.innerHTML = '<button onclick="fb_login()">Login with Google</button>'
    console.log("logged out!")
}

async function writeForm() {
    // Get the form data
    const HTML_NAME = document.getElementById("userName");
    let formName = HTML_NAME.value;
    const HTML_AGE = document.getElementById("userAge");
    let formAge = HTML_AGE.value;

    if (formName == "" || formAge == "") {
        console.log("error")
        HTML_FORM_ERROR.innerHTML = "cannot submit, form incomplete"
    } else {
        let googleName = GLOBAL_user.displayName;
        let email = GLOBAL_user.email;
        let userID = GLOBAL_user.uid;
        let userImage = GLOBAL_user.photoURL;
        console.log(userID);

        await firebase.database().ref("userData/" + userID).set({

            displayName: googleName,
            userEmail: email,
            photoURL: userImage,
            gameName: formName,
            age: formAge

        });
        loggedIn = true
        window.location.replace("/index.html")
    };
};

function fb_error(error) {
    console.log("there was an error");
    console.log(error);
}