 const firebaseConfig = {
  apiKey: "AIzaSyBXzqu9Y1mAo-rihV1Nim5CvLrBDZmMD3Y",
  authDomain: "ofm-db.firebaseapp.com",
  databaseURL: "https://ofm-db-default-rtdb.firebaseio.com",
  projectId: "ofm-db",
  storageBucket: "ofm-db.appspot.com",
  messagingSenderId: "50200942727",
  appId: "1:50200942727:web:e313e9c66ae918554e8022",
  measurementId: "G-MS12RPQFFS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();