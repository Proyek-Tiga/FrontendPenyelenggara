const token = localStorage.getItem("authToken");
if (!token) {
    alert('Token tidak ditemukan. Harap login terlebih dahulu');
    window.location.href = "proyek-tiga.github.io";
    return;
}

document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector(".data-table tbody");
    const apiUrl = "https://tiket-backend-theta.vercel.app/api/request";

    // Fungsi untuk mendapatkan user_id dari token
    function getUserIdFromToken() {
        const token = localStorage.getItem("token"); // Ambil token dari localStorage (sesuaikan dengan penyimpanan kamu)
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1])); // Dekode token JWT
            return payload.user_id;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    }

    async function fetchRequests() {
        const userId = getUserIdFromToken();
        if (!userId) {
            console.error("User ID tidak ditemukan dalam token");
            return;
        }

        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // Pastikan token dikirim jika dibutuhkan
                }
            });

            if (!response.ok) {
                throw new Error("Gagal mengambil data request");
            }

            const data = await response.json();

            // Filter data berdasarkan user_id
            const filteredRequests = data.filter(request => request.user_id === userId);

            // Kosongkan tabel sebelum mengisi data baru
            tableBody.innerHTML = "";

            if (filteredRequests.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='4'>Tidak ada permintaan lokasi</td></tr>";
                return;
            }

            filteredRequests.forEach((request, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${request.nama_lokasi}</td>
                        <td>${request.kapasitas}</td>
                        <td>${request.status}</td>
                    `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    }

    // Panggil fungsi untuk mengambil dan menampilkan data
    fetchRequests();
});
