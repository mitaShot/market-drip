/**
 * Table sorting functionality for the earnings calendar.
 * n = column index
 */
function sortTable(tableId, n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById(tableId);
    if (!table) return;

    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        // i starts at 1 to skip the header row
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            let xVal = (x.textContent || x.innerText).trim();
            let yVal = (y.textContent || y.innerText).trim();

            // Numerical sort for EPS and Revenue columns (indices 2, 3, 4, 5 after removing Time)
            if (n >= 2 && n <= 5) {
                const xNum = parseFloat(xVal.replace(/[^0-9.-]/g, "")) || 0;
                const yNum = parseFloat(yVal.replace(/[^0-9.-]/g, "")) || 0;

                if (dir == "asc") {
                    if (xNum > yNum) { shouldSwitch = true; break; }
                } else if (dir == "desc") {
                    if (xNum < yNum) { shouldSwitch = true; break; }
                }
            } else {
                if (dir == "asc") {
                    if (xVal.toLowerCase() > yVal.toLowerCase()) { shouldSwitch = true; break; }
                } else if (dir == "desc") {
                    if (xVal.toLowerCase() < yVal.toLowerCase()) { shouldSwitch = true; break; }
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }

    // Re-apply zebra striping after sort
    for (i = 1; i < rows.length; i++) {
        const bgColor = (i % 2 === 0) ? '#fff' : '#f8fafc';
        rows[i].style.background = bgColor;
        rows[i].setAttribute('onmouseout', "this.style.background='" + bgColor + "'");
    }
}

/**
 * Filter table rows by month and date
 */
function filterEarningsTable(tableId, trigger) {
    const monthEl = document.getElementById('filter-month');
    const dateEl = document.getElementById('filter-date');

    if (trigger === 'month') {
        dateEl.value = "";
    } else if (trigger === 'date') {
        monthEl.value = "";
    }

    const monthVal = monthEl.value;
    const dateVal = dateEl.value;
    const table = document.getElementById(tableId);
    if (!table) return;
    const rows = table.getElementsByClassName('earnings-row');

    for (let i = 0; i < rows.length; i++) {
        const rowDate = rows[i].getAttribute('data-date');
        const rowMonth = rowDate.substring(0, 7);

        let show = true;
        if (monthVal && rowMonth !== monthVal) show = false;
        if (dateVal && rowDate !== dateVal) show = false;

        rows[i].style.display = show ? "" : "none";
    }
}

/**
 * Show company information modal
 */
function showCompanyModal(ticker, name, desc, website, sector) {
    const modal = document.getElementById('company-modal');
    if (!modal) return;

    document.getElementById('modal-title').innerText = name;
    document.getElementById('modal-ticker-badge').innerText = ticker;

    const sectorLabel = document.getElementById('modal-sector');
    if (sectorLabel) {
        sectorLabel.innerText = sector || "N/A";
        sectorLabel.style.display = sector ? "inline-block" : "none";
    }

    document.getElementById('modal-desc').innerText = desc || "No description available.";

    const webLink = document.getElementById('modal-website');
    if (website && website !== '') {
        webLink.href = website;
        webLink.style.display = "inline-flex";
    } else {
        webLink.style.display = "none";
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Prevent background scroll
}

/**
 * Close company information modal
 */
function closeCompanyModal() {
    const modal = document.getElementById('company-modal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Close modal when clicking outside of it
window.addEventListener('click', function (event) {
    const modal = document.getElementById('company-modal');
    if (event.target == modal) {
        closeCompanyModal();
    }
});

/**
 * Scroll the earnings table to the first unannounced row and center it
 */
function scrollToToday(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const wrapper = table.closest('.earnings-calendar-wrapper');
    if (!wrapper) return;

    // Find the first unannounced row
    const targetRow = table.querySelector('.unannounced-row');
    if (targetRow) {
        const wrapperHeight = wrapper.offsetHeight;
        const rowTop = targetRow.offsetTop;
        const rowHeight = targetRow.offsetHeight;

        // Calculate scroll position to center the row
        const scrollPos = rowTop - (wrapperHeight / 2) + (rowHeight / 2);
        wrapper.scrollTop = scrollPos;
    }
}
