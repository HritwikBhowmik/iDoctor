// ========================
// API Configuration
// ========================
// local api
// const API_BASE_URL = 'http://192.168.0.104:5666';
// const PREDICTION_API = 'http://192.168.0.104:5665/prediction';

// global api
const API_BASE_URL = 'https://shimmery-unusuriously-jeff.ngrok-free.dev';
const PREDICTION_API = 'https://shimmery-unusuriously-jeff.ngrok-free.dev/prediction';

// ========================
// Global Variables
// ========================
const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const preview = document.getElementById("preview");
const predictBtn = document.getElementById("predictBtn");
const loading = document.getElementById("loading");
const resultBox = document.getElementById("result");
const predictionText = document.getElementById("predictionText");
const errorBox = document.getElementById("errorBox");

// Data display elements
const doctorData = document.getElementById("doctorData");
const medicineData = document.getElementById("medicineData");
const llmData = document.getElementById("llmData");

// ========================
// Helper: Make API Request (No Auth Required)
// ========================
async function makeAPIRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return await response.json();
}

// ========================
// Fetch Doctor Data
// ========================
async function fetchDoctorData(cures_disease) {
  try {
    // Fetch all doctors if no cures_disease filter, or filter by cures_disease
    const endpoint = cures_disease ? `/doctors?cures_disease=${cures_disease}` : `/doctors`;
    const data = await makeAPIRequest(endpoint);
    displayDoctorData(data);
  } catch (error) {
    console.error('Error fetching doctor data:', error);
    doctorData.innerHTML = `<p class="text-red-400">Failed to load doctor data: ${error.message}</p>`;
  }
}

// ========================
// Fetch Medicine Data
// ========================
async function fetchMedicineData(for_disease) {
  try {
    // Fetch all medicines if no for_disease filter, or filter by for_disease
    const endpoint = for_disease ? `/medicines?for_disease=${for_disease}` : `/medicines`;
    const data = await makeAPIRequest(endpoint);
    displayMedicineData(data);
  } catch (error) {
    console.error('Error fetching medicine data:', error);
    medicineData.innerHTML = `<p class="text-red-400">Failed to load medicine data: ${error.message}</p>`;
  }
}

// ========================
// Fetch Stats/LLM Data
// ========================
async function fetchStatsData(predictionClass) {
  try {
    const data = await makeAPIRequest(`/stats?condition=${predictionClass}`);
    displayStatsData(data);
  } catch (error) {
    console.error('Error fetching stats data:', error);
    llmData.innerHTML = `<p class="text-red-400">Failed to load AI advice: ${error.message}</p>`;
  }
}

// ========================
// Display Doctor Data
// ========================
function displayDoctorData(data) {
  if (!data || data.length === 0) {
    doctorData.innerHTML = '<p class="text-gray-400">No doctors available</p>';
    return;
  }

  let html = '';
  (Array.isArray(data) ? data : [data]).forEach(doctor => {
    html += `
      <div class="doctor-item p-3 rounded-lg bg-gray-700/30 border border-green-500/20 hover:border-green-500/50 transition">
        <p class="text-green-300 font-semibold">${doctor.name || 'N/A'}</p>
        <p class="text-gray-400 text-sm">Specialty: ${doctor.specialty || 'General'}</p>
        <p class="text-gray-400 text-sm">Location: ${doctor.location || 'General'}</p>
        <p class="text-gray-400 text-sm">Phone: ${doctor.phone || 'N/A'}</p>
        <p class="text-gray-400 text-sm">Email: ${doctor.email || 'N/A'}</p>
      </div>
    `;
  });
  doctorData.innerHTML = html;
}

// ========================
// Display Medicine Data
// ========================
function displayMedicineData(data) {
  if (!data || data.length === 0) {
    medicineData.innerHTML = '<p class="text-gray-400">Ncode 404o medicines available</p>';
    return;
  }

  let html = '';
  (Array.isArray(data) ? data : [data]).forEach(medicine => {
    html += `
      <div class="medicine-item p-3 rounded-lg bg-gray-700/30 border border-yellow-500/20 hover:border-yellow-500/50 transition">
        <p class="text-yellow-300 font-semibold">${medicine.name || 'N/A'}</p>
        <p class="text-gray-400 text-sm">For Disease: ${medicine.for_disease || 'N/A'}</p>
        <p class="text-gray-400 text-sm">Price: $${medicine.price || 'N/A'}</p>
      </div>
    `;
  });
  medicineData.innerHTML = html;
}

// ========================
// Display Stats/LLM Data
// ========================
function displayStatsData(data) {
  if (!data) {
    llmData.innerHTML = '<p class="text-gray-400">No AI advice available</p>';
    return;
  }

  if (typeof data === 'string') {
    llmData.innerHTML = `<p class="text-purple-300">${data}</p>`;
  } else if (data.advice) {
    llmData.innerHTML = `<p class="text-purple-300">${data.advice}</p>`;
  } else if (data.recommendation) {
    llmData.innerHTML = `<p class="text-purple-300">${data.recommendation}</p>`;
  } else {
    llmData.innerHTML = `<pre class="text-purple-300 text-xs overflow-auto max-h-48">${JSON.stringify(data, null, 2)}</pre>`;
  }
}

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
        const response = await fetch(PREDICTION_API, { method: "POST", body: formData });
        if (!response.ok) throw new Error(`Server Error: ${response.statusText}`);

        const data = await response.json();
        displayResult(data);
        
        // Fetch related data from database filtered by predicted condition
        fetchDoctorData(data.prediction);
        fetchMedicineData(data.prediction);
        fetchStatsData(data.prediction);

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
