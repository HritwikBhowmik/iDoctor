
// local
//const API_BASE_URL = "http://192.168.0.104:5666";

// global
const API_BASE_URL = "http://103.174.51.212:5666";

let editId = null;

function getToken() {
    return localStorage.getItem("authToken");
}

if (!getToken()) window.location.href = "login.html";

document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminEmail");
    window.location.href = "login.html";
};

async function loadMedicines() {
    try {
        const res = await fetch(`${API_BASE_URL}/medicines`, {
            headers: { 
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const body = document.getElementById("medicineTableBody");
        body.innerHTML = "";

        (Array.isArray(data) ? data : []).forEach(med => {
            const row = `
        <tr>
          <td>${med.name}</td>
          <td>${med.for_disease || "N/A"}</td>
          <td>$${med.price || "0"}</td>
          <td>
            <button onclick="editMedicine('${med.id}', '${med.name}', '${med.for_disease || ""}', '${med.price || ""}')">Edit</button>
            <button onclick="deleteMedicine('${med.id}')">Delete</button>
          </td>
        </tr>
        `;
            body.innerHTML += row;
        });
    } catch (err) {
        console.error("Error loading medicines:", err);
        document.getElementById("medicineTableBody").innerHTML = `<tr><td colspan='4'>Error loading medicines</td></tr>`;
    }
}

loadMedicines();

function openMedicineModal() {
    document.getElementById("medicineModal").classList.remove("hidden");
}

function closeMedicineModal() {
    document.getElementById("medicineModal").classList.add("hidden");
    editId = null;
    document.getElementById("medName").value = "";
    document.getElementById("medDisease").value = "";
    document.getElementById("medPrice").value = "";
}

function editMedicine(id, name, disease, price) {
    editId = id;
    document.getElementById("medName").value = name;
    document.getElementById("medDisease").value = disease;
    document.getElementById("medPrice").value = price;
    document.getElementById("modalTitle").textContent = "Edit Medicine";
    openMedicineModal();
}

async function saveMedicine() {
    const name = document.getElementById("medName").value;
    const for_disease = document.getElementById("medDisease").value;
    const price = parseInt(document.getElementById("medPrice").value) || 0;

    if (!name) {
        alert("Please enter medicine name");
        return;
    }

    const payload = { name, for_disease, price };

    const url = editId
        ? `${API_BASE_URL}/medicines/${editId}`
        : `${API_BASE_URL}/medicines`;

    const method = editId ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    } catch (err) {
        console.error("Error saving medicine:", err);
        alert("Failed to save medicine: " + err.message);
        return;
    }

    closeMedicineModal();
    loadMedicines();
}

async function deleteMedicine(id) {
    if (!confirm("Are you sure you want to delete this medicine?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/medicines/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        loadMedicines();
    } catch (err) {
        console.error("Error deleting medicine:", err);
        alert("Failed to delete medicine: " + err.message);
    }
}

async function deleteDoctor(id) {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
        const res = await fetch(`${API_BASE_URL}/doctors/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        loadDoctors();
    } catch (err) {
        console.error("Error deleting doctor:", err);
        alert("Failed to delete doctor: " + err.message);
    }
}
