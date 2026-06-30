console.log("fb_script.js")

/**************************************************************/
//
// registration.html consts
//
/**************************************************************/
const HTML_NAME = document.getElementById("name");
const HTML_AGE = document.getElementById("favoriteFruit");

const HTML_FORM_ERROR = document.getElementById("formError");

const HTML_SUBMIT_BUTTON = document.getElementById("submitButton");

const HTML_TEXT_OUTPUT = document.getElementById("statusMessage");

const HTML_FORM = document.getElementById("signUpForm");





/**************************************************************/
//
// index.html consts
//
/**************************************************************/
const HTML_LOGIN = document.getElementById("loginButton");

const HTML_LOADING = document.getElementById("loading")

const HTML_HOME_LOGIN = document.getElementById("homeLoginRedirect");

const HTML_SHOW_USER = document.getElementById("loggedInAs");

const HTML_HOME_LOGOUT = document.getElementById("logoutButton");

const HTML_HOME_MENU = document.getElementById("homeMenu");

const HTML_GAME_1_BUTTON = document.getElementById("game1Button");

const HTML_GAME_2_BUTTON = document.getElementById("game2Button");

const HTML_GAME_1_OUTPUT = document.getElementById("game1Scores");

const HTML_GAME_2_OUTPUT = document.getElementById("game2Scores");



/**************************************************************/
//
// game1 consts
//
/**************************************************************/
const HTML_GAME_1_SCRIPT = document.getElementById("game1Script");

const HTML_GAME_1_HOME = document.getElementById("game1HomeMenu");



/**************************************************************/
//
// game2.html consts
//
/**************************************************************/
const HTML_GAME_2_SCRIPT = document.getElementById("game2Script");


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
    console.log(GLOBAL_user)
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
    if (log == null) {
        HTML_FORM.innerHTML = `<form id="userForm">
        <label for="userName">Please enter a nickname:</label>
        <input type="text" id="userName" name="userName" required />
        <label for="userAge">Your age:</label>
        <input type="number" id="userAge" name="userAge" required />
        </form>
        <p>note: you cannot change your nickname or age after registering</p>
        <div id="formError">
        </div><button onclick="writeForm()">Submit</button>`
    } else {
        window.location.replace("index.html")
    }
}

function showLoggedOut() {
    //logged out, show login button
    HTML_LOGIN.innerHTML = '<button onclick="fb_login()">Login with Google</button>'
    HTML_FORM.innerHTML = ``
    HTML_HOME_MENU.innerHTML = ``
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
        if (formAge < 16) {
            console.log("user is underage")
            HTML_FORM_ERROR.innerHTML = "cannot submit, invalid age"
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
            window.location.replace("index.html");
        };
    };
};





/**************************************************************/
// 
// index.html
//
/**************************************************************/
async function readUIDHome() {
    //reads if the user uid is in the database
    let GLOBAL_user = JSON.parse(window.sessionStorage.getItem('GLOBAL_user'));
    if (GLOBAL_user == null) {
        HTML_LOADING.innerHTML = ''

        HTML_SHOW_USER.innerHTML = ''

        HTML_LOGIN.innerHTML = `<button onclick="location.href='registration.html'">Login or sign up</button>`

        HTML_HOME_MENU.innerHTML = ''

        HTML_HOME_LOGOUT.innerHTML = ''
    } else {
        await firebase.database().ref('/userData').orderByKey().equalTo(GLOBAL_user.uid).once('value', ifLoggedInHome, fb_error);
        await firebase.database().ref('/userData/' + GLOBAL_user.uid + '/gameName').once('value', showUserHome, fb_error);
    }
}

async function ifLoggedInHome(snapshot) {
    let GLOBAL_user = JSON.parse(window.sessionStorage.getItem('GLOBAL_user'));
    var log = snapshot.val();
    if (GLOBAL_user.uid = log) {
        HTML_LOADING.innerHTML = ''

        HTML_LOGIN.innerHTML = ''

        HTML_HOME_LOGOUT.innerHTML = `<button onclick="logoutHome()">Log out</button>`

        HTML_GAME_1_BUTTON.innerHTML = `
        <button onclick="location.href='game1_home.html'">Dungeon Cleaner</button>
        <h3>HIGH SCORES:</h3>`

        HTML_GAME_2_BUTTON.innerHTML = `
        <button onclick="location.href='game2.html'">GeoDash</button>
        <h3>HIGH SCORES:</h3>`

        console.log(GLOBAL_user)
        await readGame1Score()
    } else {
        HTML_LOADING.innerHTML = ''

        HTML_SHOW_USER.innerHTML = ''

        HTML_LOGIN.innerHTML = `<button onclick="location.href='registration.html'">Login or sign up</button>`

        HTML_HOME_MENU.innerHTML = ``

        HTML_HOME_LOGOUT.innerHTML = ''
    }
}

function showUserHome(snapshot) {
    fbGameName = snapshot.val();
    HTML_SHOW_USER.innerHTML = '<h2>logged in as: ' + fbGameName + '</h2>'
}

function showLoggedOutHome() {
    //logged out, show login button
    HTML_LOGIN.innerHTML = `<button onclick="location.href='registration.html'">Login or sign up</button>`
    HTML_LOADING.innerHTML = ``
    HTML_SHOW_USER.innerHTML = ''
    HTML_HOME_MENU.innerHTML = ``
    HTML_HOME_LOGOUT.innerHTML = ''
    console.log("logged out!")
}

async function readGame1Score() {
    console.log("reading data");
    await firebase.database().ref('/game1').orderByValue().once('value', displayGame1Scores, fb_error);
    console.log('readData() complete');
}

function displayGame1Scores(snapshot) {
    console.log("fb_readUserScores");
    snapshot.forEach(showGame1Score)
    /*
    let userData = snapshot.val();
    let messages = Object.keys(userData)
    for(i=0; i < messages.length; i++) {
      let key =  messages[i];
      console.log(i+ " is for " +key+ "." +userData[key])
    
    }
    */
    console.log("fb_readUserData complete")
}

function showGame1Score(child) {
    console.log(child.key + " got " + child.val() + " points");
    HTML_GAME_1_OUTPUT.innerHTML += "<p>" + child.key + " got " + child.val() + " points </p>"
}



/**************************************************************/
// 
// Game1
//
/**************************************************************/

async function readUIDGame1() {
    //reads if the user uid is in the database
    let GLOBAL_user = JSON.parse(window.sessionStorage.getItem('GLOBAL_user'));
    if (GLOBAL_user == null) {
        window.location.replace("index.html");
    } else {
        console.log("reading data");
        await firebase.database().ref('/userData').orderByKey().equalTo(GLOBAL_user.uid).once('value', ifLoggedInGame1, fb_error);
        console.log('readUID() complete');
    }
}

function ifLoggedInGame1(snapshot) {
    let GLOBAL_user = JSON.parse(window.sessionStorage.getItem('GLOBAL_user'));
    var log = snapshot.val();
    if (GLOBAL_user.uid = log) {
        console.log(GLOBAL_user);
    } else {
        window.location.replace("index.html");
    }
}



async function readUIDGame1Home() {
    //reads if the user uid is in the database
    let GLOBAL_user = JSON.parse(window.sessionStorage.getItem('GLOBAL_user'));
    if (GLOBAL_user == null) {
        HTML_LOADING.innerHTML = ''
        HTML_LOGIN.innerHTML = `<button onclick="location.href='registration.html'">Login or sign up to play game</button>`
    } else {
        console.log("reading data");
        await firebase.database().ref('/userData').orderByKey().equalTo(GLOBAL_user.uid).once('value', ifLoggedInGame1Home, fb_error);
        console.log('readUID() complete');
    }
}

function ifLoggedInGame1Home(snapshot) {
    let GLOBAL_user = JSON.parse(window.sessionStorage.getItem('GLOBAL_user'));
    var log = snapshot.val();
    if (GLOBAL_user.uid = log) {
        HTML_LOADING.innerHTML = ''
        HTML_LOGIN.innerHTML = ''
        HTML_GAME_1_HOME.innerHTML = `<h1>dungeon cleaner!!</h1>

      <div class="container">
        <div class="column">
          <button onclick="location.href='game1_play.html'">start game</button>
        </div>
      </div>

      <h2>how to play:</h2>
      <h3>WASD for movement,</h3>
      <h3>Aim with mouse cursor,</h3>
      <h3>Spacebar to shoot bullet,</h3>
      <h3>R or reload page to restart,</h3>
      <h3>Kill all the enemies then go through the orange door to get to the next room!</h3>`
        console.log(GLOBAL_user)
    } else {
        HTML_LOADING.innerHTML = ''
        HTML_LOGIN.innerHTML = `<button onclick="location.href='registration.html'">Login or sign up to play game</button>`
    }
}






/**************************************************************/
// 
// game2
//
/**************************************************************/

async function readUIDGame2() {
    //reads if the user uid is in the database
    let GLOBAL_user = JSON.parse(window.sessionStorage.getItem('GLOBAL_user'));
    if (GLOBAL_user == null) {
        window.location.replace("index.html");
    } else {
        console.log("reading data");
        await firebase.database().ref('/userData').orderByKey().equalTo(GLOBAL_user.uid).once('value', ifLoggedInGame2, fb_error);
        console.log('readUID() complete');
    }
}

function ifLoggedInGame2(snapshot) {
    let GLOBAL_user = JSON.parse(window.sessionStorage.getItem('GLOBAL_user'));
    var log = snapshot.val();
    if (GLOBAL_user.uid = log) {
        console.log(GLOBAL_user)
    } else {
        window.location.replace("index.html");
    }
}












// firebase error 
function fb_error(error) {
    console.log("there was an error");
    console.log(error);
}