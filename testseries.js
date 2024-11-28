// Screen Elements
const airplaneModeScreen = document.getElementById("airplane-mode-screen");
const mockTestScreen = document.getElementById("mock-test-screen");
const internetReconnectionScreen = document.getElementById("internet-reconnection-screen");

// Buttons
const checkAirplaneModeButton = document.getElementById("check-airplane-mode");
const endTestButton = document.getElementById("end-test-btn");
const checkInternetButton = document.getElementById("check-internet");
const submitTestButton = document.getElementById("submit-test-btn");

// Timer
let timerElement = document.getElementById("timer");
let totalSeconds = 3600; // 1 hour

// Check Airplane Mode
checkAirplaneModeButton.addEventListener("click", () => {
    if (!navigator.onLine) {
        alert("Airplane mode detected. You can start the exam.");
        airplaneModeScreen.classList.remove("active");
        mockTestScreen.classList.add("active");
        startTimer();
    } else {
        alert("Please enable airplane mode to proceed.");
    }
});

// Timer Function
function startTimer() {
    setInterval(() => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (totalSeconds > 0) totalSeconds--;
    }, 1000);
}

// End Test
endTestButton.addEventListener("click", () => {
    mockTestScreen.classList.remove("active");
    internetReconnectionScreen.classList.add("active");
});

// Check Internet Connection
checkInternetButton.addEventListener("click", () => {
    if (navigator.onLine) {
        alert("Internet reconnected. You can submit the test.");
        submitTestButton.disabled = false;
    } else {
        alert("Please reconnect to the internet.");
    }
});

// Submit Test
submitTestButton.addEventListener("click", () => {
    if (navigator.onLine) {
        alert("Test submitted successfully!");
        // Add submission logic here
    } else {
        alert("Please reconnect to the internet before submitting.");
    }
});
