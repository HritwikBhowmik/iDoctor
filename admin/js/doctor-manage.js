const API_BASE_URL = "http://192.168.0.104:5666";

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

async function loadDoctors() {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors`, {
            headers: { 
                "Authorization": `Bearer ${getToken()}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const body = document.getElementById("doctorTableBody");
        body.innerHTML = "";

        (Array.isArray(data) ? data : []).forEach(doc => {
            const row = `
        <tr>
          <td>${doc.name}</td>
          <td>${doc.specialty}</td>
          <td>${doc.cures_disease}</td>
          <td>${doc.location}</td>
          <td>${doc.phone}</td>
          <td>${doc.email}</td>
          <td>
            <button onclick="editDoctor('${doc.id}', '${doc.name}', '${doc.specialty}', '${doc.cures_disease}', '${doc.location}', '${doc.phone}', '${doc.email}')">Edit</button>
            <button onclick="deleteDoctor('${doc.id}')">Delete</button>
          </td>
        </tr>
        `;
            body.innerHTML += row;
        });
    } catch (err) {
        console.error("Error loading doctors:", err);
        document.getElementById("doctorTableBody").innerHTML = `<tr><td colspan='7'>Error loading doctors</td></tr>`;
    }
}

loadDoctors();

function openDoctorModal() {
    document.getElementById("doctorModal").classList.remove("hidden");
}

function closeDoctorModal() {
    document.getElementById("doctorModal").classList.add("hidden");
    document.getElementById("modalTitle").textContent = "Add Doctor";
    editId = null;
    document.getElementById("docName").value = "";
    document.getElementById("docSpecialty").value = "";
    document.getElementById("docCuresDisease").value = "";
    document.getElementById("docLocation").value = "";
    document.getElementById("docPhone").value = "";
    document.getElementById("docEmail").value = "";
}

function editDoctor(id, name, specialty, cures_disease, location, phone, email) {
    editId = id;
    document.getElementById("docName").value = name;
    document.getElementById("docSpecialty").value = specialty;
    document.getElementById("docCuresDisease").value = cures_disease || "";
    document.getElementById("docLocation").value = location || "";
    document.getElementById("docPhone").value = phone || "";
    document.getElementById("docEmail").value = email || "";
    document.getElementById("modalTitle").textContent = "Edit Doctor";
    openDoctorModal();
}

async function saveDoctor() {
    const name = document.getElementById("docName").value;
    const specialty = document.getElementById("docSpecialty").value;
    const cures_disease = document.getElementById("docCuresDisease").value;
    const location = document.getElementById("docLocation").value;
    const phone = document.getElementById("docPhone").value;
    const email = document.getElementById("docEmail").value;

    const payload = { name, specialty, cures_disease, location, phone, email };

    const url = editId
        ? `${API_BASE_URL}/doctors/${editId}`
        : `${API_BASE_URL}/doctors`;

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
        console.error("Error saving doctor:", err);
        alert("Failed to save doctor: " + err.message);
        return;
    }

    closeDoctorModal();
    loadDoctors();
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