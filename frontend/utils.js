// utils.js

// ✅ Check if user is logged in and session is valid
function isLoggedIn() {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("tokenExpiry");
  return token && expiry && new Date().getTime() < parseInt(expiry);
}

// ✅ Enforce login session or redirect
function requireLogin() {
  if (!isLoggedIn()) {
    localStorage.clear();
    window.location.href = "login.html";
  }
}

// ✅ Auto logout after inactivity
function autoLogout(minutes = 5) {
  setTimeout(() => {
    localStorage.clear();
    window.location.href = "login.html";
  }, minutes * 60 * 1000);
}

// ✅ Logout handler
function setupLogoutButton(buttonId = "logoutBtn") {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
}
