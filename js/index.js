// Referensi elemen
const btnTambahRequest = document.getElementById('btnTambahRequest');
const popupTambahRequest = document.getElementById('popupTambahRequest');
const btnBatalTambahRequest = document.getElementById('btnBatalTambahRequest');
const formTambahRequest = document.getElementById('formTambahRequest');
const tabelBody = document.querySelector('.data-table tbody');

// Event untuk menampilkan popup tambah request
btnTambahRequest.addEventListener('click', () => {
    popupTambahRequest.style.display = 'flex';
});

// Event untuk menutup popup tambah request
btnBatalTambahRequest.addEventListener('click', () => {
    popupTambahRequest.style.display = 'none';
});

// Event untuk form submit (menambah data request ke tabel)
formTambahRequest.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const no = document.getElementById('no').value;
    const tanggal = document.getElementById('tanggal').value;
    const kapasitas = document.getElementById('kapasitas').value;
    const lokasi = document.getElementById('lokasi').value;
    const harga = document.getElementById('harga').value;
    const kategori = document.getElementById('kategori').value;

    console.log({ no, tanggal, kapasitas, lokasi, harga, kategori }); // Debugging line

    if (!no || !tanggal || !kapasitas || !lokasi || !harga || !kategori) {
        Swal.fire('Gagal!', 'Semua kolom wajib diisi!', 'error');
        return;
    }

    // Menambahkan row ke tabel
    const rowCount = tabelBody.rows.length + 1;
    const newRow = `
        <tr>
            <td>${rowCount}</td>
            <td>${tanggal}</td>
            <td>${kapasitas}</td>
            <td>${lokasi}</td>
            <td>${harga}</td>
            <td>${kategori}</td>
            <td>
                <button class="btn edit">Edit</button>
                <button class="btn delete">Hapus</button>
            </td>
        </tr>
    `;
    tabelBody.insertAdjacentHTML('beforeend', newRow);

    formTambahRequest.reset();
    popupTambahRequest.style.display = 'none';

    Swal.fire('Berhasil!', 'Data request berhasil ditambahkan.', 'success');
});

// Event untuk menghapus atau mengedit data
tabelBody.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('delete')) {
        const row = target.closest('tr');
        const tanggal = row.cells[1].textContent;

        Swal.fire({
            title: `Hapus request pada tanggal ${tanggal}?`,
            text: 'Data ini akan dihapus secara permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                tabelBody.removeChild(row);
                [...tabelBody.rows].forEach((row, index) => {
                    row.cells[0].textContent = index + 1;
                });
                Swal.fire('Terhapus!', 'Data request berhasil dihapus.', 'success');
            }
        });
    }

    if (target.classList.contains('edit')) {
        const row = target.closest('tr');
        const tanggal = row.cells[1].textContent;
        const kapasitas = row.cells[2].textContent;
        const lokasi = row.cells[3].textContent;
        const harga = row.cells[4].textContent;
        const kategori = row.cells[5].textContent;

        Swal.fire({
            title: 'Edit Data Request',
            html: `
                <label for="swalTanggal">Tanggal:</label>
                <input type="date" id="swalTanggal" class="swal2-input" value="${tanggal}">
                <label for="swalKapasitas">Kapasitas Orang:</label>
                <input type="number" id="swalKapasitas" class="swal2-input" value="${kapasitas}">
                <label for="swalLokasi">Lokasi:</label>
                <input type="text" id="swalLokasi" class="swal2-input" value="${lokasi}">
                <label for="swalHarga">Harga Tiket:</label>
                <select id="swalHarga" class="swal2-input">
                    <option value="early_bird" ${harga === 'early_bird' ? 'selected' : ''}>Early Bird</option>
                    <option value="presale_1" ${harga === 'presale_1' ? 'selected' : ''}>Presale 1</option>
                    <option value="presale_2" ${harga === 'presale_2' ? 'selected' : ''}>Presale 2</option>
                </select>
                <label for="swalKategori">Kategori:</label>
                <select id="swalKategori" class="swal2-input">
                    <option value="anak-anak" ${kategori === 'anak-anak' ? 'selected' : ''}>Anak-anak</option>
                    <option value="dewasa" ${kategori === 'dewasa' ? 'selected' : ''}>Dewasa</option>
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const newTanggal = document.getElementById('swalTanggal').value;
                const newKapasitas = document.getElementById('swalKapasitas').value;
                const newLokasi = document.getElementById('swalLokasi').value;
                const newHarga = document.getElementById('swalHarga').value;
                const newKategori = document.getElementById('swalKategori').value;

                if (!newTanggal || !newKapasitas || !newLokasi || !newHarga || !newKategori) {
                    Swal.showValidationMessage('Semua kolom wajib diisi!');
                }

                return { newTanggal, newKapasitas, newLokasi, newHarga, newKategori };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { newTanggal, newKapasitas, newLokasi, newHarga, newKategori } = result.value;
                row.cells[1].textContent = newTanggal;
                row.cells[2].textContent = newKapasitas;
                row.cells[3].textContent = newLokasi;
                row.cells[4].textContent = newHarga;
                row.cells[5].textContent = newKategori;

                Swal.fire('Berhasil!', 'Data request berhasil diperbarui.', 'success');
            }
        });
    }
});
