import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBH2etntN6FcE9i0nBgusEuT3B4GPjgiDc",
  authDomain: "tiny-quest-2d3a8.firebaseapp.com",
  projectId: "tiny-quest-2d3a8",
  storageBucket: "tiny-quest-2d3a8.firebasestorage.app",
  messagingSenderId: "745974169104",
  appId: "1:745974169104:web:73d33cc7d6a0ac174f1495",
  measurementId: "G-BQZBQP58Z0"
};


// Start Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// LOGIN
window.login = function () {

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please enter your email and password.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {

            alert("Login successful!");

            window.location.href = "game.html";

        })
        .catch((error) => {

            alert("Login failed: " + error.message);

        });
};


// CREATE ACCOUNT
window.createAccount = function () {

    const username =
        document.getElementById("newUsername").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    if (username === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === "") {

        alert("Please fill in all fields.");
        return;
    }


    if (password !== confirmPassword) {

        alert("Passwords do not match.");
        return;
    }


    createUserWithEmailAndPassword(
        auth,
        email,
        password
    )
    .then((userCredential) => {

        alert("Account created successfully!");

        window.location.href = "index.html";

    })
    .catch((error) => {

        alert("Error: " + error.message);

    });
};


// REGISTER PAGE
window.goToRegister = function () {

    window.location.href = "register.html";

};