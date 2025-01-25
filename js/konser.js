document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://tiket-backend-theta.vercel.app/api/konser';
    const API_LOKASI = 'https://tiket-backend-theta.vercel.app/api/lokasi';
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login terlebih dahulu');
        window.location.href = "proyek-tiga.github.io";
        return;
    }
    // Ambil elemen
    const addConcertBtn = document.getElementById("btnTambahKonser");
    const addConcertModal = document.getElementById("add-concert-modal");
    const closeModal = addConcertModal.querySelector(".close");
    const addConcertForm = document.getElementById("add-concert-form");
    const lokasiDropdown = document.getElementById("concert-location");
    const tbody = document.querySelector('.data-table tbody');

    // Fungsi untuk decode token dan mendapatkan user_id
    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }

    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.user_id) {
        alert("User ID tidak ditemukan dalam token.");
        return;
    }

    const currentUserId = decodedToken.user_id;

    async function fetchConcerts() {
        try {
            const response = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const concerts = await response.json();

            // Filter konser berdasarkan user_id
            const userConcerts = concerts.filter(concert => concert.user_id === currentUserId);

            // Kosongkan tbody sebelum memasukkan data baru
            tbody.innerHTML = '';

            if (userConcerts.length === 0) {
                // Jika tidak ada konser, tampilkan pesan di dalam tbody
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 10px; font-weight: bold;">
                            Belum ada konser yang ditambahkan.
                        </td>
                    </tr>
                `;
                return;
            }

            userConcerts.forEach((concert, index) => {
                const formattedDate = new Date(concert.tanggal_konser).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });

                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><img src="${concert.image}" alt="Gambar konser ${concert.nama_konser}" width="80"></td>
                    <td>${formattedDate}</td>
                    <td>${concert.nama_konser}</td>
                    <td>${concert.lokasi_name}</td>
                    <td>${concert.jumlah_tiket}</td>
                    <td>Rp ${concert.harga.toLocaleString('id-ID')}</td>
                    <td>${concert.status}</td>
                <td>
                    <button class="btn edit" data-id="${concert.id}">Detail</button>
                </td>
                `;

                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error fetching concert data:', error);
            alert('Gagal memuat data konser.');
        }
    }

    // Tampilkan popup tambah konser
    addConcertBtn.addEventListener("click", () => {
        addConcertModal.classList.add("show");
        loadLokasi(); // Load lokasi saat popup dibuka
    });

    // Tutup popup
    closeModal.addEventListener("click", () => {
        addConcertModal.style.display = "none";
    });

    // Tutup modal jika klik di luar modal
    window.addEventListener("click", (event) => {
        if (event.target === addConcertModal) {
            addConcertModal.style.display = "none";
        }
    });

    // Close modal on clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === addConcertModal) {
            addConcertModal.style.display = "none";
        }
    });

    // Fungsi untuk load lokasi konser
    async function loadLokasi() {
        try {
            const response = await fetch(API_LOKASI, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`Gagal mengambil lokasi`);

            const lokasiData = await response.json();
            console.log("Data Lokasi:", lokasiData); // Debugging

            // Ambil elemen dropdown lokasi
            const lokasiDropdown = document.getElementById("concert-location");
            if (!lokasiDropdown) {
                console.error("Dropdown lokasi tidak ditemukan.");
                return;
            }

            // Reset dropdown sebelum menambahkan opsi baru
            lokasiDropdown.innerHTML = `<option value="" disabled selected>Pilih Lokasi</option>`;
            lokasiData.forEach(lokasi => {
                const option = document.createElement("option");
                option.value = lokasi.lokasi_id;
                option.textContent = `${lokasi.lokasi} (Tiket: ${lokasi.tiket})`; // Sesuaikan dengan admin
                lokasiDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Error memuat lokasi:", error);
        }
    }

    // Fungsi untuk menambah konser
    addConcertForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const namaKonser = document.getElementById("concert-name").value;
        const tanggalKonser = document.getElementById("concert-date").value;
        const lokasiDropdown = document.getElementById("concert-location"); // Pastikan ada
        const lokasiId = lokasiDropdown ? lokasiDropdown.value : null;
        const hargaTiket = document.getElementById("ticket-price").value;
        const konserImage = document.getElementById("concert-image").files[0];

        if (!konserImage) {
            alert("Harap unggah gambar konser.");
            return;
        }

        const formData = new FormData();
        formData.append("user_id", currentUserId);
        formData.append("lokasi_id", lokasiId);
        formData.append("nama_konser", namaKonser);
        formData.append("tanggal_konser", tanggalKonser);
        formData.append("harga", hargaTiket);
        formData.append("image", konserImage);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) throw new Error(`Gagal menambahkan konser`);

            alert("Konser berhasil ditambahkan!");
            document.getElementById("add-concert-form").reset();
            document.getElementById("add-concert-modal").style.display = "none";
            loadLokasi(); // Perbarui dropdown lokasi
            fetchConcerts(); // Refresh daftar konser
        } catch (error) {
            console.error("Error menambahkan konser:", error);
            alert("Terjadi kesalahan saat menambahkan konser.");
        }
    });

    fetchConcerts();
});
