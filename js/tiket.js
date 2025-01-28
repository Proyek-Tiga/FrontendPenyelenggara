document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken");

    if (!token) {
        alert('Token tidak ditemukan. Harap login terlebih dahulu');
        window.location.href = "proyek-tiga.github.io"; // Sesuaikan dengan halaman login
        return;
    }

    // Fungsi untuk mengambil tiket dan memperbarui tabel
    async function fetchTiket() {
        try {
            const response = await fetch("http://localhost:5000/api/tiket-penyelenggara", {
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
                        <button class='btn-edit' data-tiket-id="${tiket.tiket_id}">
                            <i class='fas fa-edit'></i> Edit
                        </button>
                        <button class='btn-delete' onclick="openDeletePopup('${tiket.id}')">
                            <i class='fas fa-trash-alt'></i> Hapus
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Menambahkan event listener pada tombol Edit
            const editButtons = document.querySelectorAll('.btn-edit');
            editButtons.forEach(button => {
                button.addEventListener('click', function () {
                    openEditPopup(button.getAttribute('data-tiket-id'));
                });
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
            const response = await fetch("https://tiket-backend-theta.vercel.app/api/konser", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const konserList = await response.json();
            const konserDropdown = document.getElementById("konser");
            konserDropdown.innerHTML = '<option value="">-- Pilih Konser --</option>';

            // Filter konser berdasarkan user_id (pastikan konser punya user_id yang sama dengan token)
            const userId = decodeToken(token).user_id; // Misal, menggunakan fungsi decodeToken untuk mengambil user_id
            const filteredKonserList = konserList.filter(konser => konser.user_id === userId);

            filteredKonserList.forEach(konser => {
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

    // Fungsi untuk membuka popup edit dengan data tiket yang sudah ada
    async function openEditPopup(tiketId) {
        try {
            const response = await fetch(`https://tiket-backend-theta.vercel.app/api/tiket/${tiketId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const tiket = await response.json();

            if (!tiket || !tiket.konser_id) {
                alert("Data tiket tidak ditemukan!");
                return;
            }

            // Isi form dengan data tiket yang akan diedit
            document.getElementById("edit-nama-tiket").value = tiket.nama_tiket;
            document.getElementById("edit-harga").value = tiket.harga;
            document.getElementById("edit-jumlah").value = tiket.jumlah_tiket;

            // Ambil data konser dan set dropdown
            await fetchKonser(); // Memastikan konser terambil terlebih dahulu
            document.getElementById("edit-konser").value = tiket.konser_id; // Pilih konser yang sesuai

            // Simpan ID tiket yang sedang diedit
            document.getElementById("edit-popup").dataset.tiketId = tiketId;

            // Tampilkan popup edit
            document.getElementById("edit-popup").style.display = "flex";
        } catch (error) {
            console.error("Error mengambil data tiket untuk diedit:", error);
            alert("Gagal mengambil data tiket. Silakan coba lagi.");
        }
    }

    // Fungsi untuk menyimpan perubahan setelah diedit
    document.querySelector(".btn-submit").addEventListener("click", async function (event) {
        event.preventDefault();

        const editPopup = document.getElementById("edit-popup");
        if (!editPopup) {
            console.error("Popup edit tidak ditemukan.");
            return;
        }

        const tiketId = editPopup.dataset.tiketId;
        const konserId = document.getElementById("edit-konser").value;
        const namaTiket = document.getElementById("edit-nama-tiket").value.trim();
        const harga = parseInt(document.getElementById("edit-harga").value);
        const jumlahTiket = parseInt(document.getElementById("edit-jumlah").value);

        if (!konserId || !namaTiket || isNaN(harga) || isNaN(jumlahTiket)) {
            alert("Harap isi semua data dengan benar!");
            return;
        }

        const tiketData = JSON.stringify({
            konser_id: konserId,
            nama_tiket: namaTiket,
            harga: harga,
            jumlah_tiket: jumlahTiket
        });

        try {
            const response = await fetch(`https://tiket-backend-theta.vercel.app/api/tiket/${tiketId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: tiketData
            });

            const result = await response.json();
            console.log("Response API:", result);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert("Tiket berhasil diperbarui!");
            closeEditPopup();
            fetchTiket(); // Perbarui tabel tiket setelah edit
        } catch (error) {
            console.error("Error mengupdate tiket:", error);
            alert("Gagal mengupdate tiket. Silakan coba lagi.");
        }
    });

    // Fungsi untuk menutup popup edit
    function closeEditPopup() {
        const editPopup = document.getElementById("edit-popup");
        if (editPopup) {
            editPopup.style.display = "none";
        }
    }

    // Fungsi untuk membuka konfirmasi hapus
    function openDeletePopup(tiketId) {
        document.getElementById("delete-popup").style.display = "flex";
        window.tiketToDelete = tiketId;
    }

    function closeDeletePopup() {
        document.getElementById("delete-popup").style.display = "none";
    }

    function confirmDelete() {
        alert("Tiket dengan ID " + window.tiketToDelete + " telah dihapus.");
        closeDeletePopup();
    }

    // Panggil fetchTiket saat halaman dimuat
    fetchTiket();

});