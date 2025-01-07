// Fungsi untuk memperbarui status berdasarkan pilihan dropdown
function updateStatus(id, status) {
    const statusCell = document.getElementById(`status-${id}`);
    const row = document.getElementById(`row-${id}`);

    // Update status di tabel
    statusCell.textContent = status;

    // Ubah warna baris sesuai status
    if (status === "Disetujui") {
        row.style.backgroundColor = "#d4edda"; // Hijau terang
    } else if (status === "Ditolak") {
        row.style.backgroundColor = "#f8d7da"; // Merah terang
    } else {
        row.style.backgroundColor = ""; // Default
    }

    // Tambahkan logika untuk menyimpan perubahan ke backend jika diperlukan
    alert(`Status permintaan ID ${id} telah diubah menjadi "${status}".`);
}

document.addEventListener("DOMContentLoaded", () => {
    const requestBtn = document.getElementById("requestBtn");
    const popupForm = document.getElementById("popupForm");
    const closeBtn = document.getElementById("closeBtn");
    const ticketContainer = document.getElementById("ticketContainer");
    const addTicketBtn = document.getElementById("addTicketBtn");
    const tableBody = document.querySelector(".data-table tbody");
    let ticketIdCounter = 0;
    let requestCounter = 2; // Mulai dari 2 karena tabel sudah memiliki 2 data

    // Show pop-up form
    requestBtn.addEventListener("click", () => {
        popupForm.style.display = "flex";
    });

    // Close pop-up form
    closeBtn.addEventListener("click", () => {
        popupForm.style.display = "none";
    });

    // Add ticket row
    addTicketBtn.addEventListener("click", () => {
        ticketIdCounter++;
        const ticketRow = document.createElement("div");
        ticketRow.className = "ticket-row";
        ticketRow.id = `ticket-row-${ticketIdCounter}`;

        ticketRow.innerHTML = `
            <input type="text" placeholder="Nama Pilihan Tiket" required />
            <input type="number" placeholder="Harga Tiket" required />
            <button type="button" class="remove-ticket-btn">
                <i class="fa fa-minus"></i>
            </button>
        `;

        // Remove ticket row
        ticketRow.querySelector(".remove-ticket-btn").addEventListener("click", () => {
            ticketContainer.removeChild(ticketRow);
        });

        ticketContainer.appendChild(ticketRow);
    });

    // Handle form submission
    document.getElementById("submitBtn").addEventListener("click", () => {
        const location = document.getElementById("location").value;
        const capacity = document.getElementById("capacity").value;

        const ticketRows = document.querySelectorAll(".ticket-row");
        const tickets = Array.from(ticketRows).map(row => {
            const name = row.children[0].value;
            const price = row.children[1].value;
            return { name, price };
        });

        console.log("Lokasi:", location);
        console.log("Kapasitas:", capacity);
        console.log("Pilihan Tiket:", tickets);

        if (!location || !capacity || tickets.length === 0) {
            alert("Semua kolom wajib diisi!");
            return;
        }

        // Increment request counter
        requestCounter++;

        // Create new table row
        const newRow = document.createElement("tr");
        newRow.id = `row-${requestCounter}`;
        newRow.innerHTML = `
            <td>${requestCounter}</td>
            <td>${location}</td>
            <td>${capacity}</td>
            <td>
                <ul>
                    ${tickets.map(ticket => `<li>${ticket.name} - Rp ${ticket.price}</li>`).join("")}
                </ul>
            </td>
            <td id="status-${requestCounter}">Ditunda</td>
        `;

        // Add new row to table
        tableBody.appendChild(newRow);

        // Clear form inputs
        document.getElementById("location").value = "";
        document.getElementById("capacity").value = "";
        ticketContainer.innerHTML = "";

        // Close popup
        popupForm.style.display = "none";

        alert("Data berhasil ditambahkan ke tabel!");
    });
});
