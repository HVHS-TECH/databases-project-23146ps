console.log("fb_script.js")

/**************************************************************/
//
// registration.html consts
//
/**************************************************************/
const HTML_LOGIN = document.getElementById("loginButton");

const HTML_NAME = document.getElementById("name");
const HTML_AGE = document.getElementById("favoriteFruit");

const HTML_FORM_ERROR = document.getElementById("formError");

const HTML_SUBMIT_BUTTON = document.getElementById("submitButton");

const HTML_TEXT_OUTPUT = document.getElementById("statusMessage");

const HTML_FORM = document.getElementById("signUpForm");

var loggedIn = false

/**************************************************************/
//
// index.html consts
//
/**************************************************************/

/**************************************************************/
//
// registration.html functions
//
/**************************************************************/
function fb_authenticate() {
    fb_login();
}

async function showLoggedIn() {

    await readUID()

    let userName = GLOBAL_user.displayName
    HTML_LOGIN.innerHTML = "<h3> Logged in as " + userName + " </h3> <button onclick='fb_logout()'>logout</button>"
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

async function readUID() {
    //reads if the user uid is in the database
    console.log("reading data");
    await firebase.database().ref('/userData').orderByKey().equalTo(GLOBAL_user.uid).once('value', checkUID, fb_error);
    console.log('readUID() complete');
}

function checkUID(snapshot) {
    //this checks if the users uid is already in the database, if it is it redirects back to index.html, otherwise it creates a form
    var log = snapshot.val();
    console.log(log)
    if(log == null) {
        HTML_FORM.innerHTML = `<form id="userForm">
        <label for="userName">Plese enter a nickname:</label>
        <input type="text" id="userName" name="userName" required />
        <label for="userAge">Your age:</label>
        <input type="number" id="userAge" name="userAge" required />
        </form>
        <p>note: you cannot change your nickname or age after registering</p>
        <div id="formError">
        </div><button onclick="writeForm()">Submit</button>`
    } else {
        window.location.replace("/index.html")
        loggedIn = true
    }
}

function showLoggedOut() {
    //logged out, show login button
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

/**************************************************************/
// 
// index.html
//
/**************************************************************/

// firebase error 
function fb_error(error) {
    console.log("there was an error");
    console.log(error);
}