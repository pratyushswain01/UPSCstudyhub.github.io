if ("Notification" in window) {
    if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
            console.log(`Notification permission: ${permission}`);
        });
    } else {
        console.log(`Notification already ${Notification.permission}`);
    }
} else {
    alert("Your browser does not support notifications.");
}


function showNotification() {
    if (Notification.permission === "granted") {
        new Notification("Hello from GitHub Pages!", {
            body: "This is a notification triggered by client-side JavaScript.",
            icon: "path-to-icon.png", // Optional
        });
    } else {
        console.log("Notification permission not granted.");
    }
}

// Call the function on some event
document.getElementById("notify-button").addEventListener("click", showNotification);


setTimeout(() => {
    if (Notification.permission === "granted") {
        new Notification("Reminder!", {
            body: "Don't forget to check out our latest updates.",
            icon: "path-to-icon.png",
        });
    }
}, 5000); // Trigger after 5 seconds
