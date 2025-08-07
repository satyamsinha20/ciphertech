requireLogin();
autoLogout();
setupLogoutButton();

let allClients = [];

async function fetchSubmissions() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("https://ciphertech-lwzq.onrender.com/api/auth/clients", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Unauthorized");
      window.location.href = "login.html";
      return;
    }

    allClients = data.clients.filter(c => c.status !== "Approved");
    renderSubmissionsTable(allClients);
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

function renderSubmissionsTable(clients) {
  const tbody = document.querySelector("#submissionsTable tbody");
  tbody.innerHTML = "";

  clients.forEach((client, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${client.name}</td>
      <td>${client.serviceType}</td>
      <td>${client.status || "Pending"}</td>
      <td>
        <button onclick='viewClient(${JSON.stringify(client)})'>👁️</button>
        <button onclick='approveClient("${client._id}")'>✅ Approve</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function approveClient(clientId) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`https://ciphertech-lwzq.onrender.com/api/auth/clients/${clientId}/approve`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Approval failed");
      return;
    }

    // ✅ Reload all clients after approval
    fetchSubmissions();

  } catch (err) {
    console.error(err);
    alert("Server error during approval");
  }
}

function viewClient(client) {
  const modal = document.getElementById("clientModal");
  const content = document.getElementById("clientDetails");

  content.innerHTML = `
    <p><strong>Name:</strong> ${client.name}</p>
    <p><strong>Email:</strong> ${client.email}</p>
    <p><strong>Phone:</strong> ${client.phone}</p>
    <p><strong>Service:</strong> ${client.serviceType}</p>
    <p><strong>Requirement:</strong> ${client.requirement}</p>
    <p><strong>Status:</strong> ${client.status || "Pending"}</p>
    <p><strong>Submitted At:</strong> ${new Date(client.createdAt).toLocaleString()}</p>
  `;

  modal.style.display = "block";
}

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("clientModal").style.display = "none";
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allClients.filter(c =>
    c.name.toLowerCase().includes(keyword) ||
    c.serviceType.toLowerCase().includes(keyword)
  );
  renderSubmissionsTable(filtered);
});

fetchSubmissions();
