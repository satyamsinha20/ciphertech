// common.js

// Redirect to login if not logged in or token expired
function requireLogin() {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");

  if (!token || !expiry || Date.now() > parseInt(expiry)) {
    localStorage.clear();
    window.location.href = "login.html";
  }
}

// Auto logout after 10 minutes
function autoLogout() {
  const expiry = localStorage.getItem("tokenExpiry");

  if (expiry && Date.now() > parseInt(expiry)) {
    localStorage.clear();
    alert("Session expired. Please log in again.");
    window.location.href = "login.html";
  }

  setInterval(() => {
    const expiry = localStorage.getItem("tokenExpiry");
    if (expiry && Date.now() > parseInt(expiry)) {
      localStorage.clear();
      alert("Session expired. Please log in again.");
      window.location.href = "login.html";
    }
  }, 10000); // check every 10s
}

// Logout handler
function setupLogoutButton() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
}
