document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login terlebih dahulu');
        window.location.href = "proyek-tiga.github.io";
        return;
    }

    fetch("https://tiket-backend-theta.vercel.app/api/transaksi-penyelenggara", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Gagal mengambil data transaksi");
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector(".data-table tbody");
            tbody.innerHTML = "";

            data.forEach((transaksi, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                <td>${index + 1}</td>
                <td>${transaksi.tiket_id}</td>
                <td>${new Date(transaksi.transaksi_date).toLocaleDateString()}</td>
                <td>${transaksi.konser_name}</td>
                <td>${transaksi.pembeli_name}</td>
                <td><img src="${transaksi.qr_code}" alt="QR Code" width="50"></td>
                <td>${transaksi.transaksi_status}</td>
                <td>
                    <button class="btn detail" data-id="${transaksi.transaksi_id}">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </td>
            `;
                tbody.appendChild(row);
            });
            // Tambahkan event listener ke semua tombol detail
            document.querySelectorAll(".btn.detail").forEach(button => {
                button.addEventListener("click", function () {
                    const transaksiId = this.getAttribute("data-id");
                    const transaksiDetail = data.find(t => t.transaksi_id === transaksiId);
                    if (transaksiDetail) {
                        showDetailModal(transaksiDetail);
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat mengambil data transaksi");
        });

    function showDetailModal(transaksi) {
        const modal = document.querySelector("#detailModal");
        const modalContent = document.querySelector("#modalContent");

        modalContent.innerHTML = `
            <h2>Detail Transaksi</h2>
            <div class="modal-content">
                <p><strong>No. Tiket:</strong></p> <p>${transaksi.tiket_id}</p>
                <p><strong>Nama Konser:</strong></p> <p>${transaksi.konser_name}</p>
                <p><strong>Penyelenggara:</strong></p> <p>${transaksi.penyelenggara_name}</p>
                <p><strong>Pembeli:</strong></p> <p>${transaksi.pembeli_name}</p>
                <p><strong>Tanggal:</strong></p> <p>${new Date(transaksi.transaksi_date).toLocaleString()}</p>
                <p><strong>Status:</strong></p> <p class="status ${transaksi.transaksi_status}">${transaksi.transaksi_status}</p>
            </div>
            <div class="qr-container">
                <p><strong>QR Code:</strong></p>
                <img src="${transaksi.qr_code}" alt="QR Code">
            </div>
            <button class="close-modal">Tutup</button>
            `;

        modal.style.display = "flex";

        // Close modal event
        document.querySelector(".close-modal").addEventListener("click", function () {
            modal.style.display = "none";
        });

        // Klik di luar modal untuk menutup
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    }
});
