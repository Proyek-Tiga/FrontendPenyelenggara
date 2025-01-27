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
            throw new Error("Gagal mengambil data request");
        }

        const data = await response.json();
        console.log("Data permintaan dari API:", data); // Debugging

        // Pastikan data dalam array
        if (!Array.isArray(data)) {
            console.error("Data API bukan array:", data);
            return;
        }

        // Filter permintaan berdasarkan user_id (cek tipe data)
        const userRequests = data.filter(request => String(request.user_id) === String(userId));
        console.log("Data permintaan sesuai user:", userRequests.length); // Debugging

        // Tampilkan jumlah permintaan di elemen yang benar
        const requestElement = document.querySelector(".cards-container .card:nth-child(1) .card-info p strong");
        if (requestElement) {
            requestElement.textContent = userRequests.length;
        } else {
            console.error("Elemen target tidak ditemukan");
        }

    } catch (error) {
        console.error("Error fetching requests:", error);
    }
}

// Panggil fungsi untuk memperbarui jumlah permintaan di dashboard
document.addEventListener("DOMContentLoaded", fetchTotalRequests);
