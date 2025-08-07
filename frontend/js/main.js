const openFormBtn = document.getElementById("openFormBtn");
const closeFormBtn = document.getElementById("closeFormBtn");
const formModal = document.getElementById("formModal");
const serviceForm = document.getElementById("serviceForm");

// Show modal
openFormBtn.addEventListener("click", () => {
    formModal.style.display = "block";
});

// Close modal
closeFormBtn.addEventListener("click", () => {
    formModal.style.display = "none";
});

// Close modal if user clicks outside
window.addEventListener("click", (e) => {
    if (e.target == formModal) {
        formModal.style.display = "none";
    }
});

// Submit form data
serviceForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        name: serviceForm.name.value,
        email: serviceForm.email.value,
        phone: serviceForm.phone.value,
        serviceType: serviceForm.serviceType.value,
        requirement: serviceForm.requirement.value
    };

    try {
        const res = await fetch("https://ciphertech-lwzq.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            alert("Request submitted successfully!");
            formModal.style.display = "none";
            serviceForm.reset();
            window.location.href = "index.html"; // Redirect to landing
        } else {
            alert("Something went wrong!");
        }
    } catch (err) {
        alert("Server error!");
        console.error(err);
    }
});
