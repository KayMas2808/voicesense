// Theme Toggle Functionality
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  document.body.classList.toggle("light-theme");

  // Update the toggle button icon
  if (document.body.classList.contains("dark-theme")) {
    themeToggle.textContent = "☀️"; // Light mode icon
  } else {
    themeToggle.textContent = "🌙"; // Dark mode icon
  }
});

// File Upload Handling
const fileUploadDiv = document.getElementById("file-upload");
const audioInput = document.getElementById("audio-file");

// Drag-and-Drop Events
fileUploadDiv.addEventListener("dragover", (e) => {
  e.preventDefault();
  fileUploadDiv.style.borderColor = "#30ff0b"; // Highlight border on dragover
});

fileUploadDiv.addEventListener("dragleave", (e) => {
  e.preventDefault();
  fileUploadDiv.style.borderColor = "#666"; // Reset border color on dragleave
});

fileUploadDiv.addEventListener("drop", (e) => {
  e.preventDefault();
  fileUploadDiv.style.borderColor = "#666"; // Reset border color on drop

  const files = e.dataTransfer.files;
  handleFileUpload(files);
});

// File Input Change Event
audioInput.addEventListener("change", () => {
  const files = audioInput.files;
  handleFileUpload(files);
});

// Function to Handle File Uploads
function handleFileUpload(files) {
  if (files.length > 0) {
    let fileNames = [];
    for (let i = 0; i < files.length; i++) {
      fileNames.push(files[i].name);
    }
    alert(`Uploaded files: ${fileNames.join(", ")}`);
  } else {
    alert("No files selected.");
  }
}

// Real-Time Detection Placeholder
const startRecordingButton = document.getElementById("start-recording");
const stopRecordingButton = document.getElementById("stop-recording");
const audioVisualization = document.getElementById("audio-visualization");
const detectedKeywords = document.getElementById("detected-keywords");

startRecordingButton.addEventListener("click", () => {
  alert("Recording started! (This is a placeholder for real-time detection functionality.)");
  audioVisualization.style.backgroundColor = "#30ff0b"; // Simulate visualization activation
});

stopRecordingButton.addEventListener("click", () => {
  alert("Recording stopped! (This is a placeholder for real-time detection functionality.)");
  audioVisualization.style.backgroundColor = ""; // Reset visualization background
});
