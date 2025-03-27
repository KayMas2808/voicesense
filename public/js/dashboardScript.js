// dashboardScript.js

class AudioProcessor {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.keywords = [];
        this.detectedLanguage = 'English';
        this.recordingTimerInterval = null;
        this.recordingSeconds = 0;
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => this.processRecordedAudio();

            this.mediaRecorder.start();

            // Update UI
            document.querySelector(".batch-section").classList.add("inactive-mode");
            document.getElementById("stop-recording").disabled = false;
            document.querySelector(".red-circle").style.display = "block";
            this.startTimer();
            this.startEqualizer();
        } catch (error) {
            console.error('Recording error:', error);
        }
    }

    stopRecording() {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();

            // Reset UI
            document.querySelector(".batch-section").classList.remove("inactive-mode");
            document.getElementById("stop-recording").disabled = true;
            document.querySelector(".red-circle").style.display = "none";
            this.stopTimer();
        }
    }

    async processRecordedAudio() {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.audioChunks = [];

        const formData = new FormData();
        formData.append('audioFiles', audioBlob, 'recording.webm');
        formData.append('type', 'realTime');
        formData.append('language', this.detectedLanguage);
        formData.append('keywords', JSON.stringify(this.keywords));

        try {
            const response = await fetch('/api/process-audio', {
                method: 'POST',
                body: formData
            });
            const results = await response.json();
            this.displayResults(results);
        } catch (error) {
            console.error('Audio processing failed:', error);
        }
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = results.map(result => `
            <div class="result-item">
                <h3>File: ${result.filename}</h3>
                <p>Detected Language: ${result.language}</p>
                <audio controls>
                    <source src="/uploads/${result.type === 'realTime' ? 'real-time/' : 'batch/'}${result.filename}" type="audio/webm">
                    Your browser does not support the audio element.
                </audio>
                <div class="transcription">
                    <strong>Transcription:</strong> ${result.transcription}
                </div>
                <div class="keyword-matches">
                    <strong>Keyword Matches:</strong>
                    ${result.keywordMatches ? result.keywordMatches.map(match => `
                        <div class="match">
                            <span>${match.matchedWord}</span>
                            <span>Intent: ${match.intent}</span>
                        </div>
                    `).join('') : 'No matches found'}
                </div>
            </div>
        `).join('');
    }

    startTimer() {
        this.recordingSeconds = 0;
        const timerDisplay = document.getElementById("recording-timer");
        this.recordingTimerInterval = setInterval(() => {
            this.recordingSeconds++;
            let minutes = Math.floor(this.recordingSeconds / 60);
            let secs = this.recordingSeconds % 60;
            timerDisplay.innerText =
                (minutes < 10 ? "0" : "") + minutes + ":" +
                (secs < 10 ? "0" : "") + secs;
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.recordingTimerInterval);
        document.getElementById("recording-timer").innerText = "00:00";
    }

    startEqualizer() {
        const canvas = document.getElementById('audio-visualization');
        const ctx = canvas.getContext('2d');

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                analyser.fftSize = 256;

                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const draw = () => {
                    if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') return;

                    requestAnimationFrame(draw);
                    analyser.getByteFrequencyData(dataArray);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = "#0ff";

                    for (let i = 0; i < bufferLength; i++) {
                        let barHeight = dataArray[i] / 2;
                        ctx.fillRect(i * 3, canvas.height - barHeight, 2, barHeight);
                    }
                };

                draw();
            })
            .catch(err => console.error(err));
    }
}

// Initialize Audio Processor
const audioProcessor = new AudioProcessor();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Language Selection
    document.getElementById('language').addEventListener('change', (e) => {
        audioProcessor.detectedLanguage = e.target.value;
    });

    // Recording Controls
    document.getElementById('start-recording').addEventListener('click', () => {
        audioProcessor.startRecording();
    });

    document.getElementById('stop-recording').addEventListener('click', () => {
        audioProcessor.stopRecording();
    });

    // Batch File Upload
    document.getElementById('audio-file').addEventListener('change', (event) => {
        audioProcessor.handleBatchUpload(event);

        // Update UI to show batch mode is active
        document.querySelector(".real-time-section").classList.add("inactive-mode");
    });
    
    // Train Model Upload
    document.getElementById('audio-file-train').addEventListener('change',(event)=>{
        const files = event.target.files;
        audioProcessor.keywords = Array.from(files).map(file => file.name);
    });

    // Dark/Light Mode Toggle (existing functionality)
    document.getElementById('theme-toggle').addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        this.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    });
});