document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert('Token tidak ditemukan. Harap login terlebih dahulu');
        window.location.href = "proyek-tiga.github.io"; // Sesuaikan dengan halaman login
        return;
    }

    // Panggil API untuk mendapatkan tiket berdasarkan user yang login
    fetch("http://localhost:5000/api/tiket-penyelenggara", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Pastikan elemen tabel ada
            const tableBody = document.querySelector(".data-table tbody");
            if (!tableBody) {
                console.error("Elemen tbody tidak ditemukan.");
                return;
            }

            // Kosongkan isi tabel sebelum menambahkan data
            tableBody.innerHTML = "";

            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='5'>Tidak ada tiket ditemukan</td></tr>";
                return;
            }

            // Looping data tiket dan menambahkannya ke tabel
            data.forEach((tiket, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${tiket.nama_tiket}</td>
                <td>${tiket.jumlah_tiket}</td>
                <td>Rp ${tiket.harga.toLocaleString()}</td>
                <td>${tiket.nama_konser}</td>
            `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error mengambil data tiket:", error);
            alert("Gagal mengambil data tiket. Silakan coba lagi.");
        });

    // Fungsi untuk membuka popup
    function openPopup() {
        document.getElementById("popup").style.display = "flex";
    }

    // Fungsi untuk menutup popup
    function closePopup() {
        document.getElementById("popup").style.display = "none";
    }

});
