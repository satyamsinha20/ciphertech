requireLogin();
autoLogout();
setupLogoutButton();

let allClients = [];

async function fetchClients() {
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

    allClients = data.clients;
    renderClientList(allClients);
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

function renderClientList(clients) {
  const container = document.getElementById("clientItems");
  container.innerHTML = "";

  clients.forEach((client, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${index + 1}. ${client.name}</strong> | ${client.serviceType} | Status: ${client.status || "Pending"} 
      <button onclick='viewClient(${JSON.stringify(client)})'>👁️</button>
    `;
    container.appendChild(li);
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
    <p><strong>Status:</strong> ${client.status || "Pending"}</p>
    <p><strong>Submitted At:</strong> ${new Date(client.createdAt).toLocaleString()}</p>
  `;

  modal.style.display = "block";
}

document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("clientModal").style.display = "none";
});

document.getElementById("toggleClientsBtn").addEventListener("click", () => {
  const listDiv = document.getElementById("clientList");
  listDiv.style.display = listDiv.style.display === "none" ? "block" : "none";
});

fetchClients();
