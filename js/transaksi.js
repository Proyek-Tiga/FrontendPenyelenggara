document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login terlebih dahulu');
        window.location.href = "proyek-tiga.github.io";
        return;
    }

    fetch("http://localhost:5000/api/transaksi-penyelenggara", {
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
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat mengambil data transaksi");
    });
});
