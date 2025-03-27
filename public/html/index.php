<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dashboard - VoiceSense</title>
    <link rel="stylesheet" href="clash-display.css" />
    <style>
        body {
            margin: 0;
            padding: 5px;
            font-family: 'ClashDisplay-Medium', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        body.dark-theme {
            background-color: #1b1c1d;
            color: #fff;
        }

        .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            background-color: #fff;
            transition: background-color 0.3s ease;
        }

        body.dark-theme .navbar {
            background-color: #1b1c1d;
        }

        .navbar .logo a {
            text-decoration: none;
            color: inherit;
            font-size: 24px;
            letter-spacing: 2px;
            font-family: 'ClashDisplay-Bold', sans-serif;
        }

        .navbar .nav-links {
            list-style: none;
            display: flex;
        }

        .navbar .nav-links li {
            margin: 0 10px;
        }

        .navbar .nav-links a {
            color: inherit;
            text-decoration: none;
            font-size: 16px;
            transition: color 0.3s ease;
        }

        .navbar .nav-links a:hover {
            color: #30ff0b;
        }

        #theme-toggle {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: inherit;
        }

        .dashboard-container {
            width: 90%;
            max-width: 1200px;
            margin: 20px auto;
            padding: 30px;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
        }

        body.dark-theme .dashboard-container {
            background-color: #1a1a1a;
            box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.5);
        }

        .sections-container {
            border: 1px solid #444;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            background-color: rgba(255, 255, 255, 0.05);
        }

        body.dark-theme .sections-container {
            border-color: #666;
            background-color: rgba(0, 0, 0, 0.2);
        }

        .detection-modes {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            width: 90%;
            max-width: 1200px;
            margin: 20px auto;
        }

        .real-time-section,
        .batch-section {
            flex: 1;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            text-align: center;
            transition: opacity 0.3s ease;
        }

        body.dark-theme .real-time-section,
        body.dark-theme .batch-section {
            background: rgba(0, 0, 0, 0.2);
        }

        .batch-section input[type="file"] {
            display: block;
            margin: 10px auto;
        }

        .inactive-mode {
            opacity: 0.3;
            pointer-events: none;
        }

        .file-upload input[type="file"] {
            display: none;
        }

        .custom-file-upload-button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #30ff0b;
        }

        .custom-file-upload-button:hover {
            background-color: #128800;
        }

        #recording-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            font-size: 18px;
        }

        .red-circle {
            width: 12px;
            height: 12px;
            background-color: red;
            border-radius: 50%;
            margin-right: 10px;
            display: none;
        }

        #audio-visualization {
            width: 100%;
            height: 200px;
            background: rgba(255, 255, 255, 0.1);
            margin-top: 10px;
            border-radius: 5px;
        }

        body.dark-theme #audio-visualization {
            background: rgba(0, 0, 0, 0.2);
        }

        h2 {
            font-size: 28px;
            margin-bottom: 20px;
            border-bottom: 2px solid #30ff0b;
            display: inline-block;
            color: inherit;
        }

        .file-upload {
            border: 2px dashed #666;
            padding: 30px;
            width: 90%;
            max-width: 500px;
            margin: auto;
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            color: inherit;
        }

        .file-upload:hover {
            border-color: #30ff0b;
        }

        input[type="file"] {
            display: none;
        }

        .btn {
            padding: 10px 10px;
            margin: 10px;
            background-color: #30ff0b;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
        }

        .btn:hover {
            background-color: #128800;
            transform: scale(1.05);
        }

        @media screen and (max-width: 768px) {
            .navbar {
                flex-direction: column;
                align-items: flex-start;
            }

            .navbar .nav-links {
                flex-direction: column;
            }

            .navbar .nav-links li {
                margin: 5px 0;
            }

            .detection-modes {
                flex-direction: column;
            }
        }

        .language-select {
            margin-top: 20px;
            display: flex;
            align-items: center;
            color: inherit;
        }

        .language-select label {
            margin-right: 10px;
            font-size: 16px;
            color: inherit;
        }

        .language-select select {
            padding: 8px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            background-color: #fff;
            color: #333;
            transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url('data:image/svg+xml;utf8,<svg fill="%23333" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
            background-repeat: no-repeat;
            background-position: right 10px center;
            padding-right: 30px;
        }

        body.dark-theme .language-select select {
            background-color: #1a1a1a;
            color: #fff;
            border-color: #555;
            background-image: url('data:image/svg+xml;utf8,<svg fill="%23fff" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
        }

        .language-select select:focus {
            outline: none;
            border-color: #30ff0b;
        }

        .language-select select option {
            background-color: #fff;
            color: #333;
        }

        body.dark-theme .language-select select option {
            background-color: #1a1a1a;
            color: #fff;
        }

        .upload-form-container {
            margin-top: 20px;
        }

        .upload-form-container form {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 20px;
        }

        .upload-form-container label {
            margin-bottom: 5px;
            display: block;
            color: inherit;
        }

        .upload-form-container input[type="file"] {
            margin-bottom: 10px;
            display: inline-block;
        }

        .upload-form-container button[type="submit"] {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        .upload-form-container button[type="submit"]:hover {
            background-color: #367c39;
        }
    </style>
</head>

<body class="dark-theme">
    <nav class="navbar">
        <div class="logo"><a href="C:\Users\sammy\OneDrive\Documents\Code\voicesense\index.html">VoiceSense</a></div>
        <ul class="nav-links">
            <li><a href="#">Upload</a></li>
            <li><a href="#">Results</a></li>
            <li><a href="#">Real-Time</a></li>
            <li><a href="#">Settings</a></li>
            <li><a href="#">Logout</a></li>
        </ul>
        <button id="theme-toggle">☀️</button>
    </nav>
    <div class="dashboard-container">
        <div class="sections-container">
            <section class="upload-section">
                <h2>Train Model</h2>
                <div class="language-select">
                    <label for="language">Select Language:</label>
                    <select id="language">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Mandarin</option>
                        <option>Chinese</option>
                        <option>Hindi</option>
                    </select>
                </div>
                <div class="upload-form-container">
                    <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post"
                        enctype="multipart/form-data">
                        <label for="audio-file-train">Upload Training audio</label>
                        <input type="file" id="audio-file-train" name="audio" multiple accept="audio/*" />
                        <input type="hidden" name="type" value="trainingSamples">
                        <button type="submit" class="btn">Process Audio</button>
                        <?php
                        if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['type'] === 'trainingSamples') {
                            $uploadDir = 'uploads/';
                            $targetDir = $uploadDir . 'trainingSamples/';
                            $file = $_FILES['audio'];

                            if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true)) {
                                echo "<p style='color:red;'>Failed to create directory.</p>";
                            } else {
                                $targetFile = $targetDir . basename($file['name']);
                                if (move_uploaded_file($file['tmp_name'], $targetFile)) {
                                    echo "<p style='color:green;'>The file " . htmlspecialchars(basename($file['name'])) . " has been uploaded.</p>";
                                } else {
                                    echo "<p style='color:red;'>Sorry, there was an error uploading your file.</p>";
                                }
                            }
                        }
                        ?>
                    </form>
                </div>
            </section>
        </div>
        <div class="sections-container">
            <h2>Detect from audio</h2>
            <div class="detection-modes">
                <section class="real-time-section">
                    <h2>Real-Time Recording</h2>
                    <div class="recording-controls">
                        <button id="start-recording" class="btn">Start Recording</button>
                        <button id="stop-recording" class="btn" disabled>
                            Stop Recording
                        </button>
                    </div>
                    <div id="audio-visualization-container" class="visualization">
                        <canvas id="audio-visualization"></canvas>
                    </div>
                    <div id="detected-keywords" class="keywords"></div>
                    <div id="real-time-audio-container" style="margin-top: 20px;">
                        <h3>Record Now:</h3>
                        <audio id="real-time-audio" controls style="display: none;"></audio>
                    </div>
                    <div id="recording-indicator">
                        <span class="red-circle"></span>
                        <span id="recording-timer">00:00</span>
                    </div>
                </section>
                <section class="batch-section">
                    <h2>Batch Processing</h2>
                    <div class="upload-form-container">
                        <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>" method="post"
                            enctype="multipart/form-data">
                            <label for="audio-file">Upload file</label>
                            <input type="file" id="audio-file" name="audio" multiple accept="audio/*"
                                style="display: inline-block;" />
                            <input type="hidden" name="type" value="batch">
                            <button type="submit" class="btn">
                                Process Uploaded File
                            </button>
                            <?php
                            if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST['type'] === 'batch') {
                                $uploadDir = 'uploads/';
                                $targetDir = $uploadDir . 'batch/';
                                $file = $_FILES['audio'];

                                if (!is_dir($targetDir) && !mkdir($targetDir, 0755, true)) {
                                    echo "<p style='color:red;'>Failed to create directory.</p>";
                                } else {
                                    $targetFile = $targetDir . basename($file['name']);
                                    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
                                        echo "<p style='color:green;'>The file " . htmlspecialchars(basename($file['name'])) . " has been uploaded.</p>";
                                    } else {
                                        echo "<p style='color:red;'>Sorry, there was an error uploading your file.</p>";
                                        echo "<p style='color:red;'>Error Details: " . print_r($_FILES['audio']['error'], true) . "</p>";

                                    }
                                }
                            }
                            ?>
                        </form>
                    </div>
                </section>
            </div>
        </div>

        <section class="results-section">
            <h2>Detection Results</h2>
            <div id="results-container"></div>
            <section class="results-section">
                <h2>Detection Results</h2>
                <div id="results-container"></div>
                <div class="feedback-controls">
                    <button class="feedback-btn thumbs-up" data-keyword="">
                        👍 Accurate
                    </button>
                    <button class="feedback-btn thumbs-down" data-keyword="">
                        👎 Inaccurate
                    </button>
                </div>
            </section>
        </section>

        <section class="settings-section">
            <h2>Settings</h2>
            <p>
                Customize your dashboard settings here. (This is a placeholder and can
                be extended.)
            </p>
        </section>
    </div>

    <footer class="dashboard-footer">
        &copy; 2025 VoiceSense. All rights reserved.
    </footer>

    <script>

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
            document.getElementById('audio-file-train').addEventListener('change', (event) => {
                const files = event.target.files;
                audioProcessor.keywords = Array.from(files).map(file => file.name);
            });

            // Dark/Light Mode Toggle (existing functionality)
            document.getElementById('theme-toggle').addEventListener('click', function () {
                document.body.classList.toggle('dark-theme');
                this.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
            });
        });
    </script>
</body>

</html>