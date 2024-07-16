document.addEventListener('DOMContentLoaded', function() {
    const content = document.getElementById('content');

        // Get the current day of the week
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = daysOfWeek[new Date().getDay()];

    // Function to update the clock
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    }

    // Fetch Rhema for the current day of the week from Firebase
    const rhemaRef = firebase.database().ref('rhema').child(currentDay);

    rhemaRef.once('value').then((snapshot) => {
        const rhemaData = snapshot.val();

        if (rhemaData) {
            const today = new Date();
            const formattedDate = today.toLocaleDateString('en-GB');

            const rhemaHTML = `
                <div class="clock" id="clock"></div>
                <div class="date"><strong>${formattedDate}</strong></div>
                <div class="rhema-container" id="rhema-container">
                    <h2>Rhema for Living</h2>
                    <h6 class="topic"><strong>TOPIC: ${rhemaData.topic}</strong></h6>
                    <p><strong>${formattedDate}</strong></p>
                    <p><strong>OFM DAILY DEVOTIONAL - DR. LIZZY JOHNSON SULEMAN</strong></p>
                    <p><strong>BIBLE READING:</strong> ${rhemaData.bibleReading}</p>
                    <p><strong>TEXT:</strong> "${rhemaData.text}"</p>
                    <p>God knows all the details surrounding the birth, life, and death of every creature He has made. Even the billions of stars.</p>
                    <p>God has a name for each of them in the galaxies (Psalms 147:4). Whenever God takes a bit of what He knows and reveals it to a man, this is referred to as word of knowledge. God knows everything about everyone and everything in heaven, on earth, and beneath the earth. Nothing is missing from God's knowledge.</p>
                    <p>God is so full of knowledge that he longs to share a bit with us from time to time. If only you can link up with the Holy Spirit, worship Him daily, cultivate the habit of fellowshipping with Him and obey Him in all areas of life, He would hardly do everything that pertains to you that He would not have earlier revealed to you.</p>
                    <p>Just imagine, in Genesis 18:17-18 before He destroyed Sodom and Gomorrah, He said this, "Shall I hide from Abraham that thing which I do; Seeing that Abraham shall surely become a great nation... For I know him, that he will command his children and his household after him..." God couldn't hide what He intended to do from a man because Abraham walked in the ways of God. And even when He told Abraham, Abraham interceded for the city asking God if He could spare the city for the sake of the righteous on the city. He pleaded from fifty till he got to ten; that if ten righteous men were found in the city if God would spare the city and God agreed; but there were no such number in the city.</p>
                    <p>You can enjoy His secrets like Abraham if you follow Him like Abraham.</p>
                    <p><strong>Prayer:</strong> My Father! My Father! As I begin to pray, help me to serve you diligently to the end.</p>
                </div>
            `;

            content.innerHTML = rhemaHTML;

            // Update the clock every second
            setInterval(updateClock, 1000);

            // Rhema for Living expand/collapse and fixed positioning
            const rhemaContainer = document.getElementById('rhema-container');
            let isExpanded = false;
            let isFixed = false;

            rhemaContainer.addEventListener('click', function() {
                if (!isExpanded) {
                    rhemaContainer.classList.add('expanded');
                    isExpanded = true;
                } else {
                    rhemaContainer.classList.remove('expanded');
                    isExpanded = false;
                }
            });

            window.addEventListener('scroll', function() {
                if (window.scrollY > 100 && !isFixed) {
                    rhemaContainer.classList.add('fixed');
                    isFixed = true;
                } else if (window.scrollY <= 100 && isFixed) {
                    rhemaContainer.classList.remove('fixed');
                    isFixed = false;
                }
            });
        } else {
            content.innerHTML = '<p>No Rhema for today.</p>';
        }
    });

// Setup the pastors and founders tree on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function() {
    const toggles = document.querySelectorAll("#pastors-and-founders-tree .toggle");

    toggles.forEach(toggle => {
        toggle.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default anchor behavior

            const parentLi = this.parentElement;
            const subUl = parentLi.querySelector("ul");

            if (subUl) {
                subUl.classList.toggle("collapsed");
            } else {
                parentLi.classList.toggle("collapsed");
            }
        });
    });
});

    

// Function to fetch and display upcoming events from Firebase
function fetchAndDisplayEvents() {
    const eventsContainer = document.getElementById('events-calendar');
    const debugElement = document.getElementById('debug');
    const currentDate = new Date(); // Get current date

    debugElement.textContent = "Fetching events..."; // Debug start of fetch

    // Fetch events data from Firebase
    eventsRef.once('value').then((snapshot) => {
        console.log('Firebase snapshot:', snapshot.val()); // Log snapshot data
        debugElement.textContent += "\nFirebase snapshot received."; // Debug snapshot received
        const eventsData = snapshot.val();

        // Clear the container before adding new events
        eventsContainer.innerHTML = '';

        // Check if there are any events
if (eventsData) {
    debugElement.textContent += "\nEvents data found."; // Debug that events data was found

    // Convert eventsData to an array of objects
    const eventsArray = Object.keys(eventsData).map((eventId) => ({
        id: eventId,
        ...eventsData[eventId]
    }));

    // Sort events by date in ascending order
    eventsArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Iterate over each sorted event and create event cards
    eventsArray.forEach((eventData) => {
        console.log('Event Data:', eventData); // Log each event data
        debugElement.textContent += `\nEvent Data: ${JSON.stringify(eventData)}`; // Debug each event data

        const eventDate = new Date(eventData.date); // Parse event date

        // Check if the event date is in the future
        if (eventDate >= currentDate) {
            debugElement.textContent += `\nUpcoming event: ${eventData.name}, ${eventData.date}`; // Debug upcoming event

            // Format the date
            const month = eventDate.toLocaleString('default', { month: 'long' });
            const day = eventDate.getDate();
            const year = eventDate.getFullYear();

            // Create event card HTML
            const eventCardHTML = `
                <div class="event-card">
                    <div class="month">${month}</div>
                    <div class="day">${day}</div>
                    <div class="event-name">${eventData.name}</div>
                    <div class="year">${year}</div>
                </div>
            `;

            // Append event card to events container
            eventsContainer.innerHTML += eventCardHTML;
        } else {
            debugElement.textContent += `\nPast event, not displaying: ${eventData.name}, ${eventData.date}`; // Debug past event
        }
    });
} else {
    debugElement.textContent += "\nNo events data found."; // Debug that no events data was found
    // If no events found or all events are in the past, display a message
    eventsContainer.innerHTML = '<p>No upcoming events</p>';
}
}).catch((error) => {
    console.error("Error fetching events: ", error);
    debugElement.textContent += `\nError fetching events: ${error}`; // Debug error
    eventsContainer.innerHTML = '<p>Error fetching events</p>';
});
}


    // Cell group cards flipping functionality
    const cards = document.querySelectorAll('.cell-group-card');

    cards.forEach(card => {
        card.addEventListener('click', function () {
            card.classList.toggle('flipped');
        });
    });
});

// cell-groups.js
document.addEventListener('DOMContentLoaded', function() {
const cellGroupsContainer = document.getElementById('cell-groups');

// Reference to the cell groups in Firebase
const cellGroupsRef = firebase.database().ref('cells');

// Fetch cell groups from Firebase
cellGroupsRef.once('value').then((snapshot) => {
const cellGroupsData = snapshot.val();

// Clear the container before adding new cell groups
cellGroupsContainer.innerHTML = '<div class="clear"></div>';

// Check if there are any cell groups
if (cellGroupsData) {
    Object.keys(cellGroupsData).forEach((groupId) => {
        const groupData = cellGroupsData[groupId];

        // Create cell group card HTML
        const cellGroupCardHTML = `
            <div class="cell-group-card" data-name="${groupData.name}" data-contact="${groupData.contact}" data-phone="${groupData.phone}" data-email="${groupData.email}">
                <div class="front">
                    <h3>${groupData.name}</h3>
                </div>
                <div class="back">
                    <p>For inquiries contact:</p>
                    <p>${groupData.contact}</p>
                    <p>Phone: ${groupData.phone}</p>
                    <p>Email: ${groupData.email}</p>
                </div>
            </div>
        `;

        // Append cell group card to the container
        cellGroupsContainer.innerHTML += cellGroupCardHTML;
    });

    // Add event listeners for card flipping functionality
    const cards = document.querySelectorAll('.cell-group-card');

    cards.forEach(card => {
        card.addEventListener('click', function () {
            card.classList.toggle('flipped');
        });
    });
} else {
    cellGroupsContainer.innerHTML += '<p>No cell groups available.</p>';
}
}).catch((error) => {
console.error("Error fetching cell groups: ", error);
cellGroupsContainer.innerHTML = '<p>Error fetching cell groups</p>';
});
});

// events.js
document.addEventListener('DOMContentLoaded', function() {
const eventsContainer = document.getElementById('events-calendar');

// Reference to the events in Firebase
const eventsRef = firebase.database().ref('events');

// Fetch events from Firebase
eventsRef.once('value').then((snapshot) => {
const eventsData = snapshot.val();

// Clear the container before adding new events
eventsContainer.innerHTML = '';

// Get the current date
const currentDate = new Date();

// Check if there are any events
if (eventsData) {
    let hasUpcomingEvents = false;

    Object.keys(eventsData).forEach((eventId) => {
        const eventData = eventsData[eventId];
        const eventDate = new Date(eventData.date);

        // Only display events that are in the future
        if (eventDate >= currentDate) {
            hasUpcomingEvents = true;

            const month = eventDate.toLocaleString('default', { month: 'long' });
            const day = eventDate.getDate();
            const year = eventDate.getFullYear();

            // Create event card HTML
            const eventCardHTML = `
                <div class="event-card" data-name="${eventData.name}" data-date="${eventData.date}" data-location="${eventData.location}" data-description="${eventData.description}">
                    <div class="month">${month}</div>
                    <div class="day">${day}</div>
                    <div class="event-name">${eventData.name}</div>
                    <div class="year">${year}</div>
                </div>
            `;

            // Append event card to the container
            eventsContainer.innerHTML += eventCardHTML;
        }
    });

    // If no upcoming events, display a message
    if (!hasUpcomingEvents) {
        eventsContainer.innerHTML = '<p>No upcoming events available.</p>';
    }
} else {
    eventsContainer.innerHTML = '<p>No events available.</p>';
}
}).catch((error) => {
console.error("Error fetching events: ", error);
eventsContainer.innerHTML = '<p>Error fetching events</p>';
});
});

document.addEventListener('DOMContentLoaded', function() {
const routeList = document.getElementById('route-list');

// Reference to the bus stops in Firebase
const stopsRef = firebase.database().ref('bus-stops');

// Fetch bus stops from Firebase
stopsRef.once('value').then((snapshot) => {
const stopsData = snapshot.val();

// Clear the list before adding new stops
routeList.innerHTML = '';

// Check if there are any stops
if (stopsData) {
    Object.keys(stopsData).forEach((stopId) => {
        const stopData = stopsData[stopId];

        // Create stop list item HTML
        const stopListItemHTML = `
            <li>${stopData.name}</li>
        `;

        // Append stop list item to the route list
        routeList.innerHTML += stopListItemHTML;
    });
} else {
    routeList.innerHTML = '<p>No stops available.</p>';
}
}).catch((error) => {
console.error("Error fetching bus stops: ", error);
routeList.innerHTML = '<p>Error fetching bus stops</p>';
});
});



function toggleWordOfWisdom() {
var expandContent = document.getElementById('word-of-wisdom-video');
var quote = document.querySelector('.quote-of-the-week');

if (expandContent.style.display === "block") {
expandContent.style.display = "none";
quote.style.fontSize = "14px";
quote.style.fontWeight = "normal";
} else {
expandContent.style.display = "block";
quote.style.fontSize = "24px";
quote.style.fontWeight = "bold";
}
}

// Reference to the video and quote of the week in Firebase
const videoRef = firebase.database().ref('videos/wordOfWisdom');
const quoteRef = firebase.database().ref('quotes/quoteOfTheWeek');

// Fetch the video URL and quote of the week from Firebase
Promise.all([videoRef.once('value'), quoteRef.once('value')])
.then((snapshots) => {
const videoSnapshot = snapshots[0];
const quoteSnapshot = snapshots[1];

const videoURL = videoSnapshot.val();
const quote = quoteSnapshot.val();

// Update video source and quote on the page
document.getElementById('wisdom-video-source').src = videoURL;
document.getElementById('wisdom-video-player').load();
document.querySelector('.quote-of-the-week').textContent = quote;
})
.catch((error) => {
console.error("Error fetching video and quote: ", error);
});

