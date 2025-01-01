document.addEventListener("DOMContentLoaded", function () {
    const editButtons = document.querySelectorAll(".btn.edit");
    const popupEditKonser = document.getElementById("popupEditKonser");
    const formEditKonser = document.getElementById("formEditKonser");
    const tableBody = document.getElementById("konserTableBody");

    editButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const row = button.closest("tr");
            const cells = row.querySelectorAll("td");

            document.getElementById("editTanggal").value = cells[1].textContent.trim();
            document.getElementById("editNamaKonser").value = cells[2].textContent.trim();
            document.getElementById("editLokasi").value = cells[3].textContent.trim();
            document.getElementById("editJumlahTiket").value = cells[4].textContent.replace(",", "").trim();
            document.getElementById("editHarga").value = cells[5].textContent.replace(",", "").trim();
            document.getElementById("editPenyelenggara").value = cells[6].textContent.trim();
            document.getElementById("editStatus").value = cells[7].textContent.trim();

            popupEditKonser.style.display = "block";
        });
    });

    document.getElementById("btnBatalEdit").addEventListener("click", () => {
        popupEditKonser.style.display = "none";
    });

    formEditKonser.addEventListener("submit", function (e) {
        e.preventDefault();
        popupEditKonser.style.display = "none";
    });
});
