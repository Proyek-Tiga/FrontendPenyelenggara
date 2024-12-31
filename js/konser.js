// Referensi elemen
const btnTambahKonser = document.getElementById('btnTambahKonser');
const popupTambahKonser = document.getElementById('popupTambahKonser');
const popupEditKonser = document.getElementById('popupEditKonser');
const btnBatalTambah = document.getElementById('btnBatalTambah');
const btnBatalEdit = document.getElementById('btnBatalEdit');
const formTambahKonser = document.getElementById('formTambahKonser');
const formEditKonser = document.getElementById('formEditKonser');
const tabelBody = document.querySelector('.data-table tbody');

let editIndex = null; // Indeks data yang sedang diedit

// Fungsi untuk menyimpan data ke Local Storage
const saveToLocalStorage = (data) => {
    localStorage.setItem('konserData', JSON.stringify(data));
};

// Fungsi untuk mengambil data dari Local Storage
const loadFromLocalStorage = () => {
    const data = localStorage.getItem('konserData');
    return data ? JSON.parse(data) : [];
};

// Fungsi untuk merender data ke tabel
const renderTable = () => {
    const data = loadFromLocalStorage();
    tabelBody.innerHTML = '';
    data.forEach((item, index) => {
        const row = `
            <tr data-id="${index}">
                <td>${index + 1}</td>
                <td>${item.tanggal}</td>
                <td>${item.namaKonser}</td>
                <td>${item.lokasi}</td>
                <td>${item.jumlahTiket}</td>
                <td>${item.harga}</td>
                <td>${item.penyelenggara}</td>
                <td>${item.status}</td>
                <td>${item.tiketTerbeli}</td>
                <td>
                    <button class="btn edit" onclick="handleEdit(${index})">Edit</button>
                    <button class="btn delete" onclick="handleDelete(${index})">Hapus</button>
                </td>
            </tr>
        `;
        tabelBody.insertAdjacentHTML('beforeend', row);
    });
};

// Fungsi untuk menambah data konser
formTambahKonser.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = loadFromLocalStorage();
    const newKonser = {
        tanggal: document.getElementById('tanggal').value,
        namaKonser: document.getElementById('namaKonser').value,
        lokasi: document.getElementById('lokasi').value,
        jumlahTiket: document.getElementById('jumlahTiket').value,
        harga: document.getElementById('harga').value,
        penyelenggara: document.getElementById('penyelenggara').value,
        status: document.getElementById('status').value,
        tiketTerbeli: 0 // Default nilai tiket terbeli
    };

    data.push(newKonser);
    saveToLocalStorage(data);
    renderTable();
    popupTambahKonser.style.display = 'none';
});

// Fungsi untuk menangani edit data
const handleEdit = (index) => {
    const data = loadFromLocalStorage();
    const konser = data[index];

    editIndex = index; // Simpan indeks data yang sedang diedit
    document.getElementById('editTanggal').value = konser.tanggal;
    document.getElementById('editNamaKonser').value = konser.namaKonser;
    document.getElementById('editLokasi').value = konser.lokasi;
    document.getElementById('editJumlahTiket').value = konser.jumlahTiket;
    document.getElementById('editHarga').value = konser.harga;
    document.getElementById('editPenyelenggara').value = konser.penyelenggara;
    document.getElementById('editStatus').value = konser.status;

    popupEditKonser.style.display = 'flex';
};

// Fungsi untuk menyimpan hasil edit
formEditKonser.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = loadFromLocalStorage();
    const updatedKonser = {
        tanggal: document.getElementById('editTanggal').value,
        namaKonser: document.getElementById('editNamaKonser').value,
        lokasi: document.getElementById('editLokasi').value,
        jumlahTiket: document.getElementById('editJumlahTiket').value,
        harga: document.getElementById('editHarga').value,
        penyelenggara: document.getElementById('editPenyelenggara').value,
        status: document.getElementById('editStatus').value,
        tiketTerbeli: data[editIndex].tiketTerbeli // Tidak mengubah tiket terbeli
    };

    data[editIndex] = updatedKonser;
    saveToLocalStorage(data);
    renderTable();
    popupEditKonser.style.display = 'none';
});

// Fungsi untuk menghapus data
const handleDelete = (index) => {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: 'Data konser ini akan dihapus!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!'
    }).then((result) => {
        if (result.isConfirmed) {
            const data = loadFromLocalStorage();
            data.splice(index, 1);
            saveToLocalStorage(data);
            renderTable();
            Swal.fire('Terhapus!', 'Data konser telah dihapus.', 'success');
        }
    });
};

// Event untuk menutup popup tambah/edit
btnBatalTambah.addEventListener('click', () => {
    popupTambahKonser.style.display = 'none';
});

btnBatalEdit.addEventListener('click', () => {
    popupEditKonser.style.display = 'none';
});

// Render tabel saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderTable);
