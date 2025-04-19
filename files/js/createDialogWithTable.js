function createDialogWithTable(containerId, dialogTitle, data) {
    const container = containerId == undefined ? document.body : containerId instanceof HTMLElement ?  containerId : document.getElementById(containerId);
    const keys = Object.keys(data);

    if (!container || !data || keys.length === 0) {
        console.error("Container not found or data is empty");
        return;
    }

    // Create the overlay
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.id = "overlay";

    // Create the dialog container
    const dialog = document.createElement("div");
    dialog.className = "dialog-container";
    dialog.id = "dialog";

    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.className = "dialog-close";
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => {
        dialog.remove();
        overlay.remove();
        //dialog.classList.remove("show");
        //overlay.classList.remove("show");
    });

    // Create the dialog header
    const header = document.createElement("div");
    header.className = "dialog-header";
    header.textContent = dialogTitle;

    // Create the table
    const table = document.createElement("table");

    // Create the table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Image", "Name", "Amount"].forEach((col) => {
        const th = document.createElement("th");
        th.className = "th";
        th.textContent = col;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement("tbody");

    let idx = 0;
    keys.forEach(id => {
        const dat = data[id];
        const item = $items[id];
        const row = document.createElement("tr");
        row.className = "tr";

        // Image column
        const imageCell = document.createElement("td");
        const img = document.createElement("canvas");
        imageCell.className = "td";
        img.width = sprites.cellWidth;
        img.height = sprites.cellHeight;
        img.alt = item.name;
        sprites.drawByID(img.getContext("2d"), item.graphicId, 0, 0, img.width, img.height);
        imageCell.appendChild(img);
        row.appendChild(imageCell);

        // Name column
        const nameCell = document.createElement("td");
        nameCell.className = "td";
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        // Amount column
        const amountCell = document.createElement("td");
        amountCell.className = "td";
        amountCell.textContent = dat.amount;
        row.appendChild(amountCell);

        tbody.appendChild(row);
        ++idx;
    });
    table.appendChild(tbody);

    // Append elements to the dialog
    dialog.appendChild(closeButton);
    dialog.appendChild(header);
    dialog.appendChild(table);

    // Append dialog and overlay to the container
    container.appendChild(overlay);
    container.appendChild(dialog);

    // Show dialog and overlay
    /*document.getElementById("showDialogButton").addEventListener("click", () => {
        dialog.classList.add("show");
        overlay.classList.add("show");
    });*/
    dialog.classList.add("show");
    overlay.classList.add("show");

    // Close dialog when overlay is clicked
    overlay.addEventListener("click", () => {
        dialog.remove();
        overlay.remove();
        //dialog.classList.remove("show");
        //overlay.classList.remove("show");
    });
}

// Example usage
/*const data = [
    { image: "https://via.placeholder.com/50", name: "Item 1", amount: 10 },
    { image: "https://via.placeholder.com/50", name: "Item 2", amount: 20 },
    { image: "https://via.placeholder.com/50", name: "Item 3", amount: 30 }
];

createDialogWithTable("app", "Item Details", data);*/