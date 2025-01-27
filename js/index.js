const token = localStorage.getItem("authToken");
if (!token) {
    alert('Token tidak ditemukan. Harap login terlebih dahulu');
    window.location.href = "proyek-tiga.github.io/login"; // Ganti dengan halaman login
    return;
}

// Fungsi untuk mendapatkan user_id dari token
function getUserIdFromToken() {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Dekode token JWT
        console.log("User ID dari token:", payload.user_id); // Debugging
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
            throw new Error(`Gagal mengambil data request. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data permintaan dari API:", data); // Debugging

        // Pastikan data dalam array
        if (!Array.isArray(data)) {
            console.error("Data API bukan array:", data);
            return;
        }

        // Filter permintaan berdasarkan user_id
        const userRequests = data.filter(request => String(request.user_id) === String(userId));
        console.log("Jumlah permintaan sesuai user:", userRequests.length); // Debugging

        // Update jumlah permintaan pada card dashboard
        const requestElements = document.querySelectorAll(".cards-container .card .card-info p strong");
        if (requestElements.length > 0) {
            requestElements[0].textContent = userRequests.length; // Ubah jumlah permintaan pada card pertama
            console.log("Jumlah permintaan berhasil diperbarui di UI");
        } else {
            console.error("Elemen target tidak ditemukan di DOM");
        }

    } catch (error) {
        console.error("Error fetching requests:", error);
    }
}

// Panggil fungsi untuk memperbarui jumlah permintaan di dashboard
document.addEventListener("DOMContentLoaded", fetchTotalRequests);
