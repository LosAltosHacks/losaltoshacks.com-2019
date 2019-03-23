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
  announcementsRef.innerHTML = pinnedAnnoucements + regularAnnouncements;
});
const modalBtn = document.getElementById('request-notifications');
const closeModalPanel = document.getElementById('closeModalPanel');
const closeModalBtn = document.getElementById('closeModalBtn');
modalBtn.addEventListener('click',() => {
  const modal = document.getElementById("mapModal");
  modal.style = "visibility: visible; opacity: 1"
})
closeModalPanel.addEventListener('click',() => {
  const modal = document.getElementById("mapModal");
  modal.style = "visibility: hidden; opacity: 0"
})
closeModalBtn.addEventListener('click',() => {
  const modal = document.getElementById("mapModal");
  modal.style = "visibility: hidden; opacity: 0"
})


//schedules
const updateScheduleCountDown = () => {
  const day = Schedules[moment().format("MMMM D")];
  const currEventNameElem = document.getElementById("current-event-name");
  const nextEventNameElem = document.getElementById("next-event-name");
  const nextEventCountdownElem = document.getElementById("next-event-time");
  const scheduleParent = document.getElementById("schedule");
  let currEvent = "No Curent event";
  let currEventIndex = null;
  let minDiff = null;
  if (day) {
    day.sched.map((event, i) => {
      const localTime = moment(day.day + " " + event.time + " 2019");
      const today = moment();
      const diff = localTime.diff(today);
      if (diff < 0) {
        if (minDiff) {
          if (Math.abs(diff) < Math.abs(minDiff)) {
            minDiff = diff;
            currEvent = event;
            currEventIndex = i;
          }
        }
        else {
          minDiff = diff;
          currEvent = event;
          currEventIndex = i;
        }
      }
    });
    let nextEvent = day.sched[currEventIndex + 1];
    let timeTillNextEvent = null;
    if (!nextEvent) {
      let nextDay = Schedules[moment().add(1,'days').format("MMMM D")];
      if (nextDay) {
        nextEvent = nextDay.sched[0];
        timeTillNextEvent = moment().to(moment(nextDay.day + " " + nextEvent.time + " 2019"));
      }
    }
    else {
      timeTillNextEvent = moment().to(moment(day.day + " " + nextEvent.time + " 2019"));
    }
    currEventNameElem.innerHTML = currEvent.name;
    nextEventNameElem.innerHTML = nextEvent.name;
    nextEventCountdownElem.innerHTML = timeTillNextEvent;
  }
  else {
    scheduleParent.style = "display : none";
  }
}
updateScheduleCountDown();
setInterval(function(){
   updateScheduleCountDown();
},6000);
