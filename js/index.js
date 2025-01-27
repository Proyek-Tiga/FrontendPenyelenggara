const token = localStorage.getItem("authToken");
if (!token) {
    alert('Token tidak ditemukan. Harap login terlebih dahulu');
    window.location.href = "proyek-tiga.github.io/login"; // Ganti dengan halaman login
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

// Fungsi untuk mengambil dan menghitung total konser sesuai user_id
async function fetchTotalKonser() {
    const userId = getUserIdFromToken();
    if (!userId) {
        console.error("User ID tidak ditemukan dalam token");
        return;
    }

    try {
        const response = await fetch("https://tiket-backend-theta.vercel.app/api/konser", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Gagal mengambil data konser. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data konser dari API:", data); // Debugging

        if (!Array.isArray(data)) {
            console.error("Data API konser bukan array:", data);
            return;
        }

        const userKonser = data.filter(konser => String(konser.user_id) === String(userId));
        console.log("Jumlah konser sesuai user:", userKonser.length); // Debugging

        const konserElements = document.querySelectorAll(".cards-container .card .card-info p strong");
        if (konserElements.length > 1) {
            konserElements[1].textContent = userKonser.length; // Ubah jumlah konser pada card kedua
            console.log("Jumlah konser berhasil diperbarui di UI");
        }

    } catch (error) {
        console.error("Error fetching konser:", error);
    }
}

// Fungsi untuk mengambil dan menghitung total transaksi sesuai user_id
async function fetchTotalTransaksi() {
    const userId = getUserIdFromToken();
    if (!userId) {
        console.error("User ID tidak ditemukan dalam token");
        return;
    }

    try {
        const response = await fetch("https://tiket-backend-theta.vercel.app/api/transaksi", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Gagal mengambil data transaksi. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data transaksi dari API:", data); // Debugging

        if (!Array.isArray(data)) {
            console.error("Data API transaksi bukan array:", data);
            return;
        }

        const userTransaksi = data.filter(transaksi => String(transaksi.user_id) === String(userId));
        console.log("Jumlah transaksi sesuai user:", userTransaksi.length); // Debugging

        const transaksiElements = document.querySelectorAll(".cards-container .card .card-info p strong");
        if (transaksiElements.length > 2) {
            const totalTransaksi = userTransaksi.reduce((acc, transaksi) => acc + transaksi.amount, 0); // Total transaksi
            transaksiElements[2].textContent = `Rp. ${totalTransaksi.toLocaleString()}`; // Ubah total transaksi pada card ketiga
            console.log("Jumlah transaksi berhasil diperbarui di UI");
        }

    } catch (error) {
        console.error("Error fetching transaksi:", error);
    }
}

// Panggil fungsi untuk memperbarui jumlah permintaan, konser, dan transaksi di dashboard
document.addEventListener("DOMContentLoaded", () => {
    fetchTotalRequests();
    fetchTotalKonser();
    fetchTotalTransaksi();
});
