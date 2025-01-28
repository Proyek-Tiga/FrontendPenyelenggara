document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert('Token tidak ditemukan. Harap login terlebih dahulu');
        window.location.href = "proyek-tiga.github.io"; // Sesuaikan dengan halaman login
        return;
    }

    function getUserIdFromToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Decoded Token:", payload); // Debugging
            return payload.user_id;
        } catch (error) {
            console.error("Gagal decode token:", error);
            return null;
        }
    }

    // Fungsi untuk mengambil tiket dan memperbarui tabel
    async function fetchTiket() {
        try {
            const userId = getUserIdFromToken(token);
            const response = await fetch(`http://localhost:5000/api/tiket-penyelenggara?user_id=${userId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            const tableBody = document.querySelector(".data-table tbody");
            tableBody.innerHTML = "";

            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='5'>Tidak ada tiket ditemukan</td></tr>";
                return;
            }

            data.forEach((tiket, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${tiket.nama_tiket}</td>
                    <td>${tiket.jumlah_tiket}</td>
                    <td>Rp ${tiket.harga.toLocaleString()}</td>
                    <td>${tiket.nama_konser}</td>
                    <td>
                    <button class="btn-edit" onclick="openEditPopup('${tiket.tiket_id}', '${tiket.konser_id}', '${tiket.nama_tiket}', '${tiket.harga}', '${tiket.jumlah_tiket}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="openDeletePopup('${tiket.tiket_id}')">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error mengambil data tiket:", error);
            alert("Gagal mengambil data tiket. Silakan coba lagi.");
        }
    }

    // Fungsi untuk membuka popup
    window.openPopup = function () {
        document.getElementById("popup").style.display = "flex";
        fetchKonser();
    };

    // Fungsi untuk menutup popup
    window.closePopup = function () {
        document.getElementById("popup").style.display = "none";
    };

    // Fungsi untuk mengambil konser berdasarkan user_id dari token
    async function fetchKonser() {
        try {
            const userId = getUserIdFromToken(token);
            const response = await fetch("https://tiket-backend-theta.vercel.app/api/konser", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            let konserList = await response.json();
            console.log("Semua konser:", konserList); // Debugging

            // Filter konser berdasarkan user_id
            konserList = konserList.filter(konser => konser.user_id === userId);
            console.log("Konser setelah filter:", konserList); // Debugging

            const konserDropdown = document.getElementById("konser");
            konserDropdown.innerHTML = '<option value="">-- Pilih Konser --</option>';

            konserList.forEach(konser => {
                const option = document.createElement("option");
                option.value = konser.konser_id;
                option.textContent = konser.nama_konser;
                konserDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Error mengambil konser:", error);
            alert("Gagal mengambil konser. Silakan coba lagi.");
        }
    }

    // Fungsi untuk menambahkan tiket
    document.querySelector(".btn-submit").addEventListener("click", async function (event) {
        event.preventDefault();

        const konserDropdown = document.getElementById("konser");
        const konserId = konserDropdown.value.trim(); // Ambil ID konser yang dipilih
        const namaTiket = document.getElementById("nama-tiket").value.trim();
        const harga = parseInt(document.getElementById("harga").value);
        const jumlahTiket = parseInt(document.getElementById("jumlah").value);

        if (!konserId || !namaTiket || isNaN(harga) || isNaN(jumlahTiket)) {
            alert("Harap isi semua data dengan benar!");
            return;
        }

        console.log("konserId:", konserId); // Debugging untuk melihat konser_id sebelum dikirim

        const tiketData = JSON.stringify({
            konser_id: konserId,
            nama_tiket: namaTiket,
            harga: harga,
            jumlah_tiket: jumlahTiket
        });

        console.log("Data yang dikirim:", tiketData); // Debugging

        try {
            const response = await fetch("https://tiket-backend-theta.vercel.app/api/tiket", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: tiketData
            });

            const responseText = await response.text();
            console.log("Response dari server:", responseText); // Debugging

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${responseText}`);
            }

            alert("Tiket berhasil ditambahkan!");
            closePopup();
            fetchTiket();
        } catch (error) {
            console.error("Error menambahkan tiket:", error);
            alert("Gagal menambahkan tiket. Silakan coba lagi.");
        }
    });

    // Fungsi untuk membuka popup edit dengan data yang sudah ada
    window.openEditPopup = async function (tiketId, konserId, namaTiket, harga, jumlahTiket) {
        document.getElementById("edit-popup").style.display = "flex";

        // Pastikan input teks terisi dengan benar
        document.getElementById("edit-nama-tiket").value = namaTiket;
        document.getElementById("edit-harga").value = harga;
        document.getElementById("edit-jumlah").value = jumlahTiket;

        // Simpan tiketId ke atribut data agar bisa digunakan saat menyimpan perubahan
        document.getElementById("edit-popup").setAttribute("data-tiket-id", tiketId);

        try {
            const userId = getUserIdFromToken(token);
            const response = await fetch("https://tiket-backend-theta.vercel.app/api/konser", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            let konserList = await response.json();
            konserList = konserList.filter(konser => konser.user_id === userId);

            const konserDropdown = document.getElementById("edit-konser");
            konserDropdown.innerHTML = '<option value="">-- Pilih Konser --</option>';

            konserList.forEach(konser => {
                const option = document.createElement("option");
                option.value = konser.konser_id;
                option.textContent = konser.nama_konser;
                konserDropdown.appendChild(option);
            });

            // Setelah dropdown terisi, pilih konser sesuai dengan konser tiket
            konserDropdown.value = konserId;
        } catch (error) {
            console.error("Error mengambil konser untuk edit:", error);
            alert("Gagal mengambil konser. Silakan coba lagi.");
        }
    };

    // Fungsi untuk menutup popup edit
    window.closeEditPopup = function () {
        document.getElementById("edit-popup").style.display = "none";
    };

    // Fungsi untuk menyimpan perubahan tiket
    document.querySelector("#edit-popup .btn-submit").addEventListener("click", async function (event) {
        event.preventDefault();

        const tiketId = document.getElementById("edit-popup").getAttribute("data-tiket-id");
        const konserId = document.getElementById("edit-konser").value.trim();
        const namaTiket = document.getElementById("edit-nama-tiket").value.trim();
        const harga = parseInt(document.getElementById("edit-harga").value);
        const jumlahTiket = parseInt(document.getElementById("edit-jumlah").value);

        if (!konserId || !namaTiket || isNaN(harga) || isNaN(jumlahTiket)) {
            alert("Harap isi semua data dengan benar!");
            return;
        }

        try {
            const response = await fetch(`https://tiket-backend-theta.vercel.app/api/tiket/${tiketId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    konser_id: konserId,
                    nama_tiket: namaTiket,
                    harga: harga,
                    jumlah_tiket: jumlahTiket
                })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            alert("Tiket berhasil diperbarui!");
            closeEditPopup();
            fetchTiket();  // Perbarui daftar tiket setelah edit
        } catch (error) {
            console.error("Error memperbarui tiket:", error);
            alert("Gagal memperbarui tiket. Silakan coba lagi.");
        }
    });

    // Fungsi untuk membuka popup konfirmasi hapus
    function openDeletePopup(tiketId) {
        document.getElementById("delete-popup").style.display = "flex";
        document.getElementById("delete-popup").setAttribute("data-tiket-id", tiketId);
    }

    // Fungsi untuk menutup popup hapus
    function closeDeletePopup() {
        document.getElementById("delete-popup").style.display = "none";
    }

    // Fungsi untuk menghapus tiket
    async function confirmDelete() {
        const tiketId = document.getElementById("delete-popup").getAttribute("data-tiket-id");

        try {
            const response = await fetch(`https://tiket-backend-theta.vercel.app/api/tiket/${tiketId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            alert("Tiket berhasil dihapus!");
            closeDeletePopup();
            fetchTiket();
        } catch (error) {
            console.error("Error menghapus tiket:", error);
            alert("Gagal menghapus tiket. Silakan coba lagi.");
        }
    }

    // Panggil fetchTiket saat halaman dimuat
    fetchTiket();

});