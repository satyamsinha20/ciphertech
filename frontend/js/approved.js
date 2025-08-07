requireLogin();         // Session check
autoLogout();           // Auto logout
setupLogoutButton();    // Logout handler

let approvedClients = [];

async function fetchApprovedClients() {
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

    // Filter approved clients
    approvedClients = data.clients.filter(c => c.status === "Approved");
    renderApprovedTable(approvedClients);
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

function renderApprovedTable(clients) {
  const tbody = document.querySelector("#approvedTable tbody");
  tbody.innerHTML = "";

  clients.forEach((client, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${client.name}</td>
      <td>${client.serviceType}</td>
      <td>${client.status}</td>
      <td><button onclick='viewClient(${JSON.stringify(client)})'>👁️</button></td>
    `;
    tbody.appendChild(tr);
  });
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
    <p><strong>Status:</strong> ${client.status}</p>
    <p><strong>Submitted At:</strong> ${new Date(client.createdAt).toLocaleString()}</p>
  `;

  modal.style.display = "block";
}

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("clientModal").style.display = "none";
});

// Search
document.getElementById("searchInput").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = approvedClients.filter(c =>
    c.name.toLowerCase().includes(keyword) ||
    c.serviceType.toLowerCase().includes(keyword)
  );
  renderApprovedTable(filtered);
});

fetchApprovedClients();
