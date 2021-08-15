import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyD96RfanqwSzTYi5SObQt-uwMY06UAbvVI",
    authDomain: "fir-login-b523b.firebaseapp.com",
    projectId: "fir-login-b523b",
    storageBucket: "fir-login-b523b.appspot.com",
    messagingSenderId: "9810711573",
    appId: "1:9810711573:web:722bcdf645fd53ebe9aa1c"
  };

  let firebaseApp = firebase.initializeApp(firebaseConfig);
  export let firebaseAuth = firebaseApp.auth();
  export let firebaseStorage = firebaseApp.storage();
  export let firebaseDB = firebaseApp.firestore();
  export let timeStamp = firebase.firestore.FieldValue.serverTimestamp;