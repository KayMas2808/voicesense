let recording = false;
let timerInterval;
let seconds = 0;

//dark/light mode
document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    //icon based on theme
    if (document.body.classList.contains('dark-theme')) {
        this.textContent = '☀️';
    } else {
        this.textContent = '🌙';
    }
});

//mode switching logic
document.getElementById("start-recording").addEventListener("click", function() {
    document.querySelector(".batch-section").classList.add("inactive-mode");
    document.getElementById("stop-recording").disabled = false;
    document.querySelector(".red-circle").style.display = "block";
    startTimer();
    startEqualizer();
});

document.getElementById("stop-recording").addEventListener("click", function() {
    document.querySelector(".batch-section").classList.remove("inactive-mode");
    this.disabled = true;
    document.querySelector(".red-circle").style.display = "none";
    stopTimer();
});

document.getElementById("process-batch").addEventListener("click", function() {
    document.querySelector(".real-time-section").classList.add("inactive-mode");
});

document.getElementById("batchFile").addEventListener("change", function() {
    document.querySelector(".real-time-section").classList.add("inactive-mode");
});

// recording timer
function startTimer() {
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let secs = seconds % 60;
        document.getElementById("recording-timer").innerText =
            (minutes < 10 ? "0" : "") + minutes + ":" + (secs < 10 ? "0" : "") + secs;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById("recording-timer").innerText = "00:00";
}

// equalizer animation
const canvas = document.getElementById('audio-visualization');
const ctx = canvas.getContext('2d');

function startEqualizer() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function draw() {
            if (!recording) return;
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#0ff";
            for (let i = 0; i < bufferLength; i++) {
                let barHeight = dataArray[i] / 2;
                ctx.fillRect(i * 3, canvas.height - barHeight, 2, barHeight);
            }
        }

        recording = true;
        draw();
    })
    .catch(err => console.error(err));
}
