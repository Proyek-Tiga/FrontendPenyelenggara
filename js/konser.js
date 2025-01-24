document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://tiket-backend-theta.vercel.app/api/konser';
    const API_LOKASI = 'https://tiket-backend-theta.vercel.app/api/lokasi';
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login terlebih dahulu');
        window.location.href = "proyek-tiga.github.io";
        return;
    }
    // const addConcertBtn = document.getElementById("add-concert-btn");
    // const addConcertModal = document.getElementById("add-concert-modal");
    // const closeModal = document.querySelector("#add-concert-modal .close");
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

            userConcerts.forEach((concert, index) => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td><img src="${concert.image}" alt="Gambar konser ${concert.nama_konser}" width="80"></td>
                    <td>${concert.nama_konser}</td>
                    <td>${concert.lokasi_name}</td>
                    <td>${concert.jumlah_tiket}</td>
                    <td>Rp ${concert.harga.toLocaleString('id-ID')}</td>
                    <td>${concert.status}</td>
                `;

                tbody.appendChild(row);
            });

        } catch (error) {
            console.error('Error fetching concert data:', error);
            alert('Gagal memuat data konser.');
        }
    }

    fetchConcerts();
});
