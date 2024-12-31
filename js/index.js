// Referensi elemen
const btnTambahKonser = document.getElementById('btnTambahKonser');
const popupTambahKonser = document.getElementById('popupTambahKonser');
const btnBatalTambah = document.getElementById('btnBatalTambah');
const formTambahKonser = document.getElementById('formTambahKonser');
const tabelBody = document.querySelector('.data-table tbody');

// Event untuk menampilkan popup tambah konser
btnTambahKonser.addEventListener('click', () => {
    popupTambahKonser.style.display = 'flex';
});

// Event untuk menutup popup tambah konser
btnBatalTambah.addEventListener('click', () => {
    popupTambahKonser.style.display = 'none';
});

// Event untuk form submit (menambah data konser ke tabel)
formTambahKonser.addEventListener('submit', (event) => {
    event.preventDefault();

    const kapasitas = document.getElementById('kapasitas').value;
    const lokasi = document.getElementById('lokasi').value;
    const harga = document.getElementById('harga').value.trim();

    if (!kapasitas || !lokasi || !harga) {
        Swal.fire('Gagal!', 'Semua kolom wajib diisi!', 'error');
        return;
    }

    const rowCount = tabelBody.rows.length + 1;
    const newRow = `
        <tr>
            <td>${rowCount}</td>
            <td>${kapasitas}</td>
            <td>${lokasi}</td>
            <td>${harga.replace(/\n/g, '<br>')}</td>
            <td>
                <button class="btn edit">Edit</button>
                <button class="btn delete">Hapus</button>
            </td>
        </tr>
    `;
    tabelBody.insertAdjacentHTML('beforeend', newRow);

    formTambahKonser.reset();
    popupTambahKonser.style.display = 'none';

    Swal.fire('Berhasil!', 'Data konser berhasil ditambahkan.', 'success');
});

// Event untuk menghapus atau mengedit data
tabelBody.addEventListener('click', (event) => {
    const target = event.target;

    // Menghapus data konser
    if (target.classList.contains('delete')) {
        const row = target.closest('tr');
        const lokasi = row.cells[2].textContent;

        Swal.fire({
            title: `Hapus konser di ${lokasi}?`,
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
                // Mengupdate nomor urut
                [...tabelBody.rows].forEach((row, index) => {
                    row.cells[0].textContent = index + 1;
                });
                Swal.fire('Terhapus!', 'Data konser berhasil dihapus.', 'success');
            }
        });
    }

    // Mengedit data konser (hanya mengubah Kapasitas, Lokasi, dan Harga Tiket)
    if (target.classList.contains('edit')) {
        const row = target.closest('tr');
        const kapasitas = row.cells[1].textContent;
        const lokasi = row.cells[2].textContent;
        const harga = row.cells[3].innerHTML.replace(/<br>/g, '\n');

        Swal.fire({
            title: 'Edit Data Konser',
            html: `
                <label for="swalKapasitas">Kapasitas Orang:</label>
                <input type="number" id="swalKapasitas" class="swal2-input" value="${kapasitas}">
                
                <label for="swalLokasi">Lokasi:</label>
                <input type="text" id="swalLokasi" class="swal2-input" value="${lokasi}">
                
                <label for="swalHarga">Harga Tiket (Tingkatan):</label>
                <textarea id="swalHarga" class="swal2-textarea">${harga}</textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const newKapasitas = document.getElementById('swalKapasitas').value.trim();
                const newLokasi = document.getElementById('swalLokasi').value.trim();
                const newHarga = document.getElementById('swalHarga').value.trim();

                if (!newKapasitas || !newLokasi || !newHarga) {
                    Swal.showValidationMessage('Semua kolom wajib diisi!');
                }

                return { newKapasitas, newLokasi, newHarga };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { newKapasitas, newLokasi, newHarga } = result.value;
                row.cells[1].textContent = newKapasitas;
                row.cells[2].textContent = newLokasi;
                row.cells[3].innerHTML = newHarga.replace(/\n/g, '<br>');

                Swal.fire('Berhasil!', 'Data konser berhasil diperbarui.', 'success');
            }
        });
    }
});
