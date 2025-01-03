document.addEventListener('DOMContentLoaded', () => {
    const btnTambahKonser = document.getElementById('btnTambahKonser');
    const popupTambahKonser = document.getElementById('popupTambahKonser');
    const formTambahKonser = document.getElementById('formTambahKonser');
    const btnBatalTambah = document.querySelectorAll('.btn.cancel');
    const popupEditKonser = document.getElementById('popupEditKonser');
    const formEditKonser = document.getElementById('formEditKonser');
    const dataTable = document.querySelector('.data-table tbody');

    // Fungsi untuk menyimpan data ke LocalStorage
    const saveDataToLocalStorage = () => {
        const rows = Array.from(dataTable.querySelectorAll('tr'));
        const data = rows.map(row => {
            const cells = row.querySelectorAll('td');
            return {
                tanggal: cells[1].innerText,
                namaKonser: cells[2].innerText,
                lokasi: cells[3].innerText,
                jumlahTiket: cells[4].innerText,
                harga: cells[5].innerText,
                penyelenggara: cells[6].innerText,
                status: cells[7].innerText,
            };
        });
        localStorage.setItem('konserData', JSON.stringify(data));
    };

    // Fungsi untuk memuat data dari LocalStorage
    const loadDataFromLocalStorage = () => {
        const data = JSON.parse(localStorage.getItem('konserData')) || [];
        data.forEach(item => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${dataTable.rows.length + 1}</td>
                <td>${item.tanggal}</td>
                <td>${item.namaKonser}</td>
                <td>${item.lokasi}</td>
                <td>${item.jumlahTiket}</td>
                <td>${item.harga}</td>
                <td>${item.penyelenggara}</td>
                <td>${item.status}</td>
                <td>
                    <button class="btn edit">Edit</button>
                    <button class="btn delete">Hapus</button>
                </td>
            `;
            dataTable.appendChild(newRow);
        });
    };

    // Fungsi untuk memperbarui nomor urut tabel
    const updateRowNumbers = () => {
        const rows = dataTable.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.querySelector('td:first-child').innerText = index + 1;
        });
    };

    // Memuat data saat halaman di-refresh
    loadDataFromLocalStorage();

    // Menampilkan popup tambah konser
    btnTambahKonser.addEventListener('click', () => {
        popupTambahKonser.style.display = 'block';
    });

    // Menutup popup
    btnBatalTambah.forEach(button => {
        button.addEventListener('click', () => {
            popupTambahKonser.style.display = 'none';
            popupEditKonser.style.display = 'none';
        });
    });

    // Menyimpan data konser
    formTambahKonser.addEventListener('submit', (e) => {
        e.preventDefault();
        const newRow = document.createElement('tr');
        const formData = new FormData(formTambahKonser);

        const rowHTML = `
            <td>${dataTable.rows.length + 1}</td>
            <td>${formData.get('tanggal')}</td>
            <td>${formData.get('namaKonser')}</td>
            <td>${formData.get('lokasi')}</td>
            <td>${formData.get('jumlahTiket')}</td>
            <td>${formData.get('harga')}</td>
            <td>${formData.get('penyelenggara')}</td>
            <td>Belum di ACC</td>
            <td>
                <button class="btn edit">Edit</button>
                <button class="btn delete">Hapus</button>
            </td>
        `;
        newRow.innerHTML = rowHTML;
        dataTable.appendChild(newRow);
        popupTambahKonser.style.display = 'none';
        formTambahKonser.reset();

        // Simpan data ke LocalStorage
        saveDataToLocalStorage();

        Swal.fire('Berhasil!', 'Data konser berhasil disimpan.', 'success');
    });

    // Event delegation untuk tombol edit dan delete
    dataTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) {
            // Menampilkan popup edit dengan data yang sudah ada
            const row = e.target.closest('tr');
            const cells = row.querySelectorAll('td');

            formEditKonser['tanggal'].value = cells[1].innerText;
            formEditKonser['namaKonser'].value = cells[2].innerText;
            formEditKonser['lokasi'].value = cells[3].innerText;
            formEditKonser['jumlahTiket'].value = cells[4].innerText.replace(/,/g, '');
            formEditKonser['harga'].value = cells[5].innerText.replace(/,/g, '');
            formEditKonser['penyelenggara'].value = cells[6].innerText;

            popupEditKonser.style.display = 'block';

            // Menyimpan perubahan data konser
            formEditKonser.onsubmit = (ev) => {
                ev.preventDefault();
                cells[1].innerText = formEditKonser['tanggal'].value;
                cells[2].innerText = formEditKonser['namaKonser'].value;
                cells[3].innerText = formEditKonser['lokasi'].value;
                cells[4].innerText = parseInt(formEditKonser['jumlahTiket'].value).toLocaleString();
                cells[5].innerText = parseInt(formEditKonser['harga'].value).toLocaleString();
                cells[6].innerText = formEditKonser['penyelenggara'].value;

                popupEditKonser.style.display = 'none';
                saveDataToLocalStorage();
                Swal.fire('Berhasil!', 'Data konser berhasil diperbarui.', 'success');
            };
        } else if (e.target.classList.contains('delete')) {
            // Menampilkan konfirmasi sebelum menghapus
            Swal.fire({
                title: 'Apakah Anda yakin?',
                text: 'Data konser ini akan dihapus secara permanen!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Hapus data jika dikonfirmasi
                    const row = e.target.closest('tr');
                    row.remove();

                    // Perbarui nomor urut setelah penghapusan
                    updateRowNumbers();

                    // Simpan perubahan ke LocalStorage
                    saveDataToLocalStorage();

                    Swal.fire('Dihapus!', 'Data konser berhasil dihapus.', 'success');
                }
            });
        }
    });
});
