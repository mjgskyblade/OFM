// Initialize Firebase
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

firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      firebase.auth().signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
              console.log("User logged in successfully:", userCredential.user);
              window.location.href = "dashboard.html";
          })
          .catch((error) => {
              console.error("Login failed:", error.message);
              alert(error.message);
          });
  });

  firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          console.log("User is already logged in:", user);
          window.location.href = "dashboard.html";
      } else {
          console.log("User is not logged in");
      }
  });
});

const dbRef = firebase.database().ref('rhema');
const eventsRef = firebase.database().ref('events');
const cellsRef = firebase.database().ref('cells');

function saveRhema() {
  const dayOfWeek = document.getElementById('dayOfWeek').value;
  const rhemaData = {
      date: document.getElementById('date').value,
      bibleReading: document.getElementById('bibleReading').value,
      topic: document.getElementById('topic').value,
      text: document.getElementById('text').value
  };

  dbRef.child(dayOfWeek).set(rhemaData)
      .then(() => {
          alert(`Rhema for ${dayOfWeek} saved successfully!`);
      })
      .catch((error) => {
          console.error("Error saving Rhema: ", error);
      });
}

function saveEvent() {
  const eventName = document.getElementById('eventName').value;
  const eventDate = document.getElementById('eventDate').value;
  const eventDescription = document.getElementById('eventDescription').value;

  const eventData = {
      name: eventName,
      date: eventDate,
      description: eventDescription
  };

  eventsRef.push(eventData)
      .then(() => {
          alert('Event saved successfully!');
      })
      .catch((error) => {
          console.error("Error saving event: ", error);
      });
}

function saveCell() {
  const name = document.getElementById('cellName').value;
  const contact = document.getElementById('cellContact').value;
  const phone = document.getElementById('cellPhone').value;
  const email = document.getElementById('cellEmail').value;

  const cellData = {
      name: name,
      contact: contact,
      phone: phone,
      email: email
  };

  cellsRef.push(cellData)
      .then(() => {
          alert('Cell Group saved successfully!');
      })
      .catch((error) => {
          console.error("Error saving Cell Group: ", error);
      });
}

document.addEventListener('DOMContentLoaded', function () {
  const addStopForm = document.getElementById('add-stop-form');

  const stopsRef = firebase.database().ref('bus-stops');

  addStopForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const stopName = document.getElementById('stop-name').value;

      const newStop = {
          name: stopName
      };

      // Push new stop to Firebase
      stopsRef.push(newStop).then(() => {
          alert('Stop added successfully!');
          addStopForm.reset();
      }).catch((error) => {
          console.error("Error adding stop: ", error);
          alert('Error adding stop');
      });
  });
});

document.getElementById('upload-video-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const file = document.getElementById('video-file').files[0];
  if (!file) {
      alert("Please select a video file.");
      return;
  }

  const quote = document.getElementById('quote-of-the-week').value;
  if (!quote) {
      alert("Please enter the quote of the week.");
      return;
  }

  const storageRef = firebase.storage().ref('videos/' + file.name);
  const uploadTask = storageRef.put(file);

  uploadTask.on('state_changed', function (snapshot) {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.getElementById('upload-progress').value = progress;
  }, function (error) {
      console.error("Error uploading video: ", error);
      alert("Error uploading video.");
  }, function () {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          firebase.database().ref('videos/wordOfWisdom').set(downloadURL).then(() => {
              firebase.database().ref('quotes/quoteOfTheWeek').set(quote).then(() => {
                  alert("Video and quote uploaded successfully.");
              }).catch((error) => {
                  console.error("Error saving quote to database: ", error);
                  alert("Error saving quote to database.");
              });
          }).catch((error) => {
              console.error("Error saving video URL to database: ", error);
              alert("Error saving video URL to database.");
          });
      });
  });
});

// Upload multiple testimony videos
document.getElementById('upload-testimony-form').addEventListener('submit', function (event) {
  event.preventDefault();

  for (let i = 1; i <= 8; i++) {
      const file = document.getElementById(`testimony-video-file-${i}`).files[0];
      const testimonyName = document.getElementById(`testimony-name-${i}`).value;
      const progressElement = document.getElementById(`testimony-upload-progress-${i}`);

      if (file && testimonyName) {
          const storageRef = firebase.storage().ref('testimonies/' + file.name);
          const uploadTask = storageRef.put(file);

          uploadTask.on('state_changed', function (snapshot) {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              progressElement.value = progress;
          }, function (error) {
              console.error(`Error uploading video ${i}: `, error);
              alert(`Error uploading video ${i}.`);
          }, function () {
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                  const testimonyData = {
                      name: testimonyName,
                      videoUrl: downloadURL
                  };
                  firebase.database().ref('testimonies').push(testimonyData).then(() => {
                      alert(`Video ${i} uploaded successfully.`);
                  }).catch((error) => {
                      console.error(`Error saving video ${i} URL to database: `, error);
                      alert(`Error saving video ${i} URL to database.`);
                  });
              });
          });
      } else {
          alert(`Please fill in the details for video ${i}.`);
      }
  }
});
