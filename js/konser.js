// Seleksi elemen-elemen yang diperlukan
const btnTambahKonser = document.getElementById('btnTambahKonser');
const btnBatalTambah = document.getElementById('btnBatalTambah');
const popupTambahKonser = document.getElementById('popupTambahKonser');
const formTambahKonser = document.getElementById('formTambahKonser');
const tableBody = document.querySelector('.data-table tbody');
const btnEditKonser = document.querySelector('.btn.edit');
const btnDeleteKonser = document.querySelector('.btn.delete');

// Fungsi untuk menambah konser
btnTambahKonser.addEventListener('click', function () {
    popupTambahKonser.style.display = 'block';
});

// Fungsi untuk membatalkan tambah konser
btnBatalTambah.addEventListener('click', function () {
    popupTambahKonser.style.display = 'none';
});

// Fungsi untuk menyimpan konser baru
formTambahKonser.addEventListener('submit', function (e) {
    e.preventDefault();

    const tanggal = document.getElementById('tanggal').value;
    const namaKonser = document.getElementById('namaKonser').value;
    const lokasi = document.getElementById('lokasi').value;
    const jumlahTiket = document.getElementById('jumlahTiket').value;
    const harga = document.getElementById('harga').value;
    const penyelenggara = document.getElementById('penyelenggara').value;
    const status = document.getElementById('status').value;

    // Menambahkan data konser baru ke dalam tabel
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${tableBody.rows.length + 1}</td>
        <td>${tanggal}</td>
        <td>${namaKonser}</td>
        <td>${lokasi}</td>
        <td>${jumlahTiket}</td>
        <td>${harga}</td>
        <td>${penyelenggara}</td>
        <td>${status}</td>
        <td>
            <button class="btn edit">Edit</button>
            <button class="btn delete">Hapus</button>
        </td>
    `;
    tableBody.appendChild(row);

    // Menutup form popup setelah menambah konser
    popupTambahKonser.style.display = 'none';

    // Reset form
    formTambahKonser.reset();
});

// Fungsi untuk menghapus konser
tableBody.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete')) {
        const row = e.target.closest('tr');
        row.remove();
    }

    // Fungsi untuk mengedit konser
    if (e.target.classList.contains('edit')) {
        const row = e.target.closest('tr');
        const cells = row.getElementsByTagName('td');

        // Menampilkan data konser yang akan diedit pada form
        document.getElementById('tanggal').value = cells[1].textContent;
        document.getElementById('namaKonser').value = cells[2].textContent;
        document.getElementById('lokasi').value = cells[3].textContent;
        document.getElementById('jumlahTiket').value = cells[4].textContent;
        document.getElementById('harga').value = cells[5].textContent;
        document.getElementById('penyelenggara').value = cells[6].textContent;

        // Menampilkan popup untuk edit konser
        document.getElementById('popupEditKonser').style.display = 'block';
    }
});

// Fungsi untuk menyimpan perubahan konser
const formEditKonser = document.getElementById('formEditKonser');
formEditKonser.addEventListener('submit', function (e) {
    e.preventDefault();

    const tanggal = document.getElementById('tanggal').value;
    const namaKonser = document.getElementById('namaKonser').value;
    const lokasi = document.getElementById('lokasi').value;
    const jumlahTiket = document.getElementById('jumlahTiket').value;
    const harga = document.getElementById('harga').value;
    const penyelenggara = document.getElementById('penyelenggara').value;

    // Menyimpan perubahan ke dalam tabel
    const row = document.querySelector('.data-table tbody tr.editing');
    row.cells[1].textContent = tanggal;
    row.cells[2].textContent = namaKonser;
    row.cells[3].textContent = lokasi;
    row.cells[4].textContent = jumlahTiket;
    row.cells[5].textContent = harga;
    row.cells[6].textContent = penyelenggara;

    // Menutup popup edit setelah perubahan disimpan
    document.getElementById('popupEditKonser').style.display = 'none';
});

// Fungsi untuk membatalkan edit konser
const btnBatalEdit = document.getElementById('btnBatalEdit');
btnBatalEdit.addEventListener('click', function () {
    document.getElementById('popupEditKonser').style.display = 'none';
});
