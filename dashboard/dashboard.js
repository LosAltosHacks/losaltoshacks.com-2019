const announcementsRef = document.getElementById("announcements");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCHzE3xNaFFs3Bgk7wkA4S8c4FUwjsQJsA",
  authDomain: "announcements-b9f41.firebaseapp.com",
  databaseURL: "https://announcements-b9f41.firebaseio.com",
  projectId: "announcements-b9f41",
  storageBucket: "announcements-b9f41.appspot.com",
  messagingSenderId: "944833452710"
};
firebase.initializeApp(config);
const db = firebase.firestore();
const dbEventsRef = db.collection("events");

dbEventsRef.orderBy("timePosted","desc").onSnapshot((docs) => {
  let regularAnnouncements = '';
  let pinnedAnnoucements = '';
  docs.forEach(doc => {
    const announcementHTML = (`
      <div class="announcement ">
          <h3>${doc.data().name}</h3>
          <p>${doc.data().content}</p>
          <footer>
            ${doc.data().isPinned ? `<i class="fas fa-thumbtack"></i>` : ``} 
            <date>${moment(doc.data().timePosted.toDate()).calendar()}</date>
          </footer>
      </div>
    `);
    if (doc.data().isPinned) {
      pinnedAnnoucements += announcementHTML;
    }
    else {
      regularAnnouncements += announcementHTML;
    }
  });
  console.log(regularAnnouncements);
  announcementsRef.innerHTML = pinnedAnnoucements + regularAnnouncements;
});
