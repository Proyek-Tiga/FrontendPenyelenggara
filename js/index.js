const token = localStorage.getItem("authToken");
if (!token) {
    alert('Token tidak ditemukan. Harap login terlebih dahulu');
    window.location.href = "proyek-tiga.github.io";
    return;
}

// Fungsi untuk mendapatkan user_id dari token
function getUserIdFromToken() {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Dekode token JWT
        return payload.user_id;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}

// Fungsi untuk mengambil dan menghitung total permintaan sesuai user_id
async function fetchTotalRequests() {
    const userId = getUserIdFromToken();
    if (!userId) {
        console.error("User ID tidak ditemukan dalam token");
        return;
    }

    try {
        const response = await fetch("https://tiket-backend-theta.vercel.app/api/request", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Gagal mengambil data request");
        }

        const data = await response.json();

        // Filter permintaan berdasarkan user_id
        const userRequests = data.filter(request => request.user_id === userId);

        // Tampilkan jumlah permintaan di dashboard
        document.querySelector(".card-info p strong").textContent = userRequests.length;

    } catch (error) {
        console.error("Error fetching requests:", error);
    }
}

// Panggil fungsi untuk memperbarui jumlah permintaan di dashboard
document.addEventListener("DOMContentLoaded", fetchTotalRequests);
