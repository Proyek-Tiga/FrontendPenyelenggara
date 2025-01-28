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
        const konserId = konserDropdown.value.trim();
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

            const responseText = await response.text(); // Ambil respons sebagai teks

            if (!response.ok) {
                if (response.status === 400 && responseText.includes("Jumlah tiket melebihi kapasitas konser")) {
                    alert("Gagal menambahkan tiket: Jumlah tiket melebihi kapasitas konser!");
                } else {
                    throw new Error(`HTTP error! Status: ${response.status} - ${responseText}`);
                }
                return;
            }

            try {
                const responseData = JSON.parse(responseText); // Coba parse ke JSON jika memungkinkan
                alert("Tiket berhasil ditambahkan!");
                closePopup();
                fetchTiket();
            } catch (jsonError) {
                console.warn("Respons bukan JSON, tetapi teks biasa:", responseText);
                alert("Tiket berhasil ditambahkan!");
                closePopup();
                fetchTiket();
            }
        } catch (error) {
            console.error("Error menambahkan tiket:", error);
            alert("Gagal menambahkan tiket. Silakan coba lagi.");
        }
    });

    // Panggil fetchTiket saat halaman dimuat
    fetchTiket();

});