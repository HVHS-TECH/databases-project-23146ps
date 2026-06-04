/**************************************************************/
// fb_initialise()
// Initialize firebase, connect to the Firebase project.
// 
// Find the config data in the Firebase console. Cog wheel > Project Settings > General > Your Apps > SDK setup and configuration > Config
//
// Input:  n/a
// Return: n/a
/**************************************************************/
const firebaseConfig = {
  apiKey: "AIzaSyCqjfEw2Jxx7x_xvO2TYWsAcfTOPD21zLo",
  authDomain: "comp-project-41142.firebaseapp.com",
  databaseURL: "https://comp-project-41142-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comp-project-41142",
  storageBucket: "comp-project-41142.firebasestorage.app",
  messagingSenderId: "1082131255430",
  appId: "1:1082131255430:web:ec51d5020377a0f5660107"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // This log prints the firebase object to the console to show that it is working.
  // As soon as you have the script working, delete this log.
  console.log("Firebase initialize finished:");
  console.log(firebase);