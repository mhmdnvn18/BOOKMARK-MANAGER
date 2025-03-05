const functions = require('firebase-functions');

exports.getFirebaseConfig = functions.https.onRequest((req, res) => {
    const firebaseConfig = {
        apiKey: "AIzaSyDSyI1drQSWkU1192Ol_7UnOztxxTZkerQ",
        authDomain: "bookmark-manager-7c5ab.firebaseapp.com",
        projectId: "bookmark-manager-7c5ab",
        storageBucket: "bookmark-manager-7c5ab.firebasestorage.app",
        messagingSenderId: "1098246411927",
        appId: "1:1098246411927:web:9a44915017f9d35fbefbd2",
        measurementId: "G-YF6CS3N1C6"
    };
    res.json(firebaseConfig);
});


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDSyI1drQSWkU1192Ol_7UnOztxxTZkerQ",
    authDomain: "bookmark-manager-7c5ab.firebaseapp.com",
    projectId: "bookmark-manager-7c5ab",
    storageBucket: "bookmark-manager-7c5ab.firebasestorage.app",
    messagingSenderId: "1098246411927",
    appId: "1:1098246411927:web:9a44915017f9d35fbefbd2",
    measurementId: "G-YF6CS3N1C6"
  };