
// local
//const API_BASE_URL = "http://192.168.0.104:5666";

// global
const API_BASE_URL = "http://103.174.51.212:5666";

function getToken() {
    return localStorage.getItem("authToken");
}

// Redirect if no login
if (!getToken()) {
    window.location.href = "login.html";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminEmail");
    window.location.href = "login.html";
});

// Fetch Dashboard Stats
async function loadStats() {
    try {
        const token = getToken();
        if (!token) {
            throw new Error("No authentication token found");
        }

        const res = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) {
            if (res.status === 401) {
                // Token expired or invalid
                localStorage.removeItem("authToken");
                window.location.href = "login.html";
                return;
            }
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        document.getElementById("doctorCount").textContent = data.doctors || 0;
        document.getElementById("medicineCount").textContent = data.medicines || 0;
        document.getElementById("predictCount").textContent = data.predictions || "N/A";

    } catch (err) {
        console.error("Error loading stats:", err);
        document.getElementById("doctorCount").textContent = "Error";
        document.getElementById("medicineCount").textContent = "Error";
    }
}

loadStats();
