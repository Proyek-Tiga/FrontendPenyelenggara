document.addEventListener('DOMContentLoaded', function () {
    const btnTambahKonser = document.getElementById('btnTambahKonser');
    const popupTambahKonser = document.getElementById('popupTambahKonser');
    const btnBatalTambah = document.getElementById('btnBatalTambah');
    const formTambahKonser = document.getElementById('formTambahKonser');
    const tableBody = document.querySelector('.data-table tbody');
    
    // Menampilkan popup ketika tombol tambah diklik
    btnTambahKonser.addEventListener('click', function () {
        popupTambahKonser.style.display = 'block';
    });

    // Menutup popup ketika tombol batal diklik
    btnBatalTambah.addEventListener('click', function () {
        popupTambahKonser.style.display = 'none';
    });

    // Menambahkan tiket baru
    const btnTambahTiket = document.getElementById('btnTambahTiket');
    btnTambahTiket.addEventListener('click', function () {
        const tiketContainer = document.getElementById('pilihanTiketContainer');
        const newTiketRow = document.createElement('div');
        newTiketRow.classList.add('tiket-row');
        newTiketRow.innerHTML = `
            <input type="text" name="tingkatan_tiket[]" placeholder="Masukkan tingkatan tiket (contoh: VIP)" required>
            <input type="number" name="harga_tiket[]" placeholder="Masukkan harga tiket (contoh: 500000)" required>
        `;
        tiketContainer.appendChild(newTiketRow);
    });

    // Menyimpan data tabel ke localStorage
    const saveTableData = () => {
        const rows = [];
        tableBody.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            rows.push({
                no: cells[0].innerText,
                kapasitas: cells[1].innerText,
                lokasi: cells[2].innerText,
                harga: cells[3].innerText
            });
        });
        localStorage.setItem('tableData', JSON.stringify(rows));
    };

    // Memuat data tabel dari localStorage
    const loadTableData = () => {
        const savedTableData = JSON.parse(localStorage.getItem('tableData'));
        if (savedTableData) {
            savedTableData.forEach(data => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${data.no}</td>
                    <td>${data.kapasitas}</td>
                    <td>${data.lokasi}</td>
                    <td>${data.harga}</td>
                    <td>
                        <button class="btn edit">Edit</button>
                        <button class="btn delete">Hapus</button>
                    </td>
                `;
                tableBody.appendChild(newRow);
            });
        }
    };

    // Menyimpan data ketika form disubmit
    formTambahKonser.addEventListener('submit', function (event) {
        event.preventDefault(); // Menghindari refresh halaman

        const kapasitas = document.getElementById('kapasitas').value;
        const lokasi = document.getElementById('lokasi').value;
        const jenisBank = document.getElementById('jenisBank').value;

        const tingkatanTiket = [];
        const hargaTiket = [];

        // Mengambil data tiket
        const tiketRows = document.querySelectorAll('.tiket-row');
        tiketRows.forEach(row => {
            const tingkatan = row.querySelector('input[name="tingkatan_tiket[]"]').value;
            const harga = row.querySelector('input[name="harga_tiket[]"]').value;
            tingkatanTiket.push(tingkatan);
            hargaTiket.push(harga);
        });

        // Menambahkan baris baru ke tabel
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${tableBody.rows.length + 1}</td>
            <td>${kapasitas}</td>
            <td>${lokasi}</td>
            <td>Rp ${hargaTiket.join(', ')}</td>
            <td>
                <button class="btn edit">Edit</button>
                <button class="btn delete">Hapus</button>
            </td>
        `;
        tableBody.appendChild(newRow);

        // Menyimpan data tabel ke localStorage
        saveTableData();

        // Menutup popup setelah data disimpan
        popupTambahKonser.style.display = 'none';

        // Menampilkan pesan sukses menggunakan SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Data Request Berhasil Disimpan',
            text: 'Klik OK untuk melanjutkan.',
            confirmButtonText: 'OK',
            showConfirmButton: true,
        });

        // Reset form
        formTambahKonser.reset();
    });

    // Muat data tabel saat halaman dimuat
    loadTableData();
});
document.addEventListener("DOMContentLoaded", function () {
    // Ambil semua tombol Edit
    const editButtons = document.querySelectorAll(".btn.edit");
    const deleteButtons = document.querySelectorAll(".btn.delete");

    // Ambil elemen popup edit (buat jika belum ada)
    const popupEdit = document.createElement("div");
    popupEdit.classList.add("popup");
    popupEdit.id = "popupEdit";
    popupEdit.style.display = "none";
    popupEdit.innerHTML = `
        <div class="popup-content">
            <h3>Edit Data Request</h3>
            <form id="formEditKonser">
                <label for="editKapasitas">Kapasitas Orang:</label>
                <input type="number" id="editKapasitas" name="kapasitas" required>

                <label for="editLokasi">Lokasi:</label>
                <input type="text" id="editLokasi" name="lokasi" required>

                <label for="editHarga">Harga Tiket:</label>
                <input type="number" id="editHarga" name="harga_tiket" required>

                <div class="popup-actions">
                    <button type="submit" class="btn save">Simpan</button>
                    <button type="button" class="btn cancel" id="btnBatalEdit">Batal</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(popupEdit);

    const formEdit = document.getElementById("formEditKonser");

    // Event untuk tombol Edit
    editButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            const row = button.closest("tr");
            const kapasitas = row.children[1].textContent.trim();
            const lokasi = row.children[2].textContent.trim();
            const harga = row.children[3].textContent.trim().replace("Rp ", "").replace(",", "");

            document.getElementById("editKapasitas").value = kapasitas;
            document.getElementById("editLokasi").value = lokasi;
            document.getElementById("editHarga").value = harga;

            popupEdit.style.display = "block";

            // Simpan perubahan
            formEdit.onsubmit = function (e) {
                e.preventDefault();
                row.children[1].textContent = formEdit.kapasitas.value;
                row.children[2].textContent = formEdit.lokasi.value;
                row.children[3].textContent = `Rp ${parseInt(formEdit.harga_tiket.value).toLocaleString()}`;
                popupEdit.style.display = "none";
            };
        });
    });

    // Event untuk tombol Hapus
    deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const row = button.closest("tr");
            Swal.fire({
                title: "Apakah Anda yakin?",
                text: "Data ini akan dihapus secara permanen.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Ya, Hapus!",
                cancelButtonText: "Batal",
            }).then((result) => {
                if (result.isConfirmed) {
                    row.remove();
                    Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
                }
            });
        });
    });

    // Event untuk tombol batal di popup Edit
    document.getElementById("btnBatalEdit").addEventListener("click", function () {
        popupEdit.style.display = "none";
    });
});
