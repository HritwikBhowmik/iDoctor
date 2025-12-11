// ------------------------
// Global Variables
// ------------------------
const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const loading = document.getElementById("loading");
const resultBox = document.getElementById("result");
const predictionText = document.getElementById("predictionText");
const errorBox = document.getElementById("errorBox");

// ------------------------
// Drag & Drop Handling
// ------------------------
dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("dragover"); });
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));

function handleFile(file) {
    if (!file) return;
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("hidden");
}

// ------------------------
// Prediction API Call
// ------------------------
predictBtn.addEventListener("click", async () => {
    if (!fileInput.files[0]) { showError("Please select or drop an image."); return; }
    hideError(); showLoading(); hideResult();

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
        const response = await fetch("http://192.168.0.104:5665/prediction", { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);

        const data = await response.json();
        displayResult(data);

    } catch (err) {
        showError(err.message);
    }

    hideLoading();
});

// ------------------------
// Display ONE Progress Bar
// ------------------------
function displayResult(data) {
    resultBox.classList.remove("hidden");

    predictionText.innerHTML = `<strong>Predicted Class:</strong> ${data.prediction} <br>
                                <strong>Confidence:</strong> ${data.probability.toFixed(2)}%`;

    // Remove old bar if any
    const oldBars = document.querySelectorAll(".progress-bar-container");
    oldBars.forEach(bar => bar.remove());

    // Create single progress bar
    const container = document.createElement("div");
    container.className = "progress-bar-container";
    container.innerHTML = `
        <div class="flex justify-between mb-1 text-sm font-medium">
            <span>${data.prediction}</span>
            <span>${data.probability.toFixed(2)}%</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-4">
            <div class="progress-fill" style="width: ${data.probability}%;"></div>
        </div>
    `;
    resultBox.appendChild(container);
}

// ------------------------
// Loading & Error
// ------------------------
function showLoading() { loading.classList.remove("hidden"); }
function hideLoading() { loading.classList.add("hidden"); }
function showError(msg) { errorBox.textContent = msg; errorBox.classList.remove("hidden"); }
function hideError() { errorBox.classList.add("hidden"); }
function hideResult() { resultBox.classList.add("hidden"); }
