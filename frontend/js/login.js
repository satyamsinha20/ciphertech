const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    email: loginForm.email.value,
    password: loginForm.password.value,
  };

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      const expiry = new Date().getTime() + 5 * 60 * 1000; // 5 minutes
      localStorage.setItem("token", data.token);
      localStorage.setItem("tokenExpiry", expiry);
      window.location.href = "/admin/dashboard.html";
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});
