document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector(".data-table tbody");
    const apiUrl = "https://tiket-backend-theta.vercel.app/api/request";

    const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login terlebih dahulu');
        window.location.href = "proyek-tiga.github.io";
        return;
    }

    const popupForm = document.getElementById("popupForm");
    const requestBtn = document.getElementById("requestBtn");
    const closeBtn = document.getElementById("closeBtn");
    const submitBtn = document.getElementById("submitBtn");
    const locationInput = document.getElementById("location");
    const capacityInput = document.getElementById("capacity");

    // Sembunyikan popup form saat halaman dimuat
    popupForm.style.display = "none";

    // Fungsi untuk menampilkan popup
    requestBtn.addEventListener("click", function () {
        popupForm.style.display = "flex";
    });

    // Fungsi untuk menutup popup
    closeBtn.addEventListener("click", function () {
        popupForm.style.display = "none";
    });

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
                    "Authorization": `Bearer ${token}` // Pastikan token dikirim jika dibutuhkan
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

    // Fungsi untuk mengirim request lokasi (POST)
    async function submitRequest() {
        const userId = getUserIdFromToken();
        if (!userId) {
            alert("User ID tidak ditemukan, silakan login ulang.");
            return;
        }

        const requestData = {
            user_id: userId,
            nama_lokasi: locationInput.value.trim(),
            kapasitas: parseInt(capacityInput.value, 10)
        };

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error("Gagal mengirim permintaan lokasi.");
            }

            alert("Permintaan lokasi berhasil dikirim!");
            popupForm.style.display = "none"; // Tutup popup setelah berhasil
            fetchRequests(); // Refresh data tabel
        } catch (error) {
            console.error("Error submitting request:", error);
            alert("Terjadi kesalahan saat mengirim permintaan.");
        }
    }

    // Event listener untuk tombol submit
    submitBtn.addEventListener("click", submitRequest);

    // Panggil fungsi untuk mengambil dan menampilkan data
    fetchRequests();
});
