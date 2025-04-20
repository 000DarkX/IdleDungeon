

class Shop {
    constructor() {
        this.items = ["potions"];
        /*addEventListener("Idle.unlock", e => {
            this.refresh();
        });*/
        this.framTime = undefined;
        this.refreshRate = 3;
        this.overlay = undefined;
        this.parent  = undefined;
        this.refresh();
    }

    tick(t) {
        if (this.framTime == undefined) this.framTime = t;
        const tt = t - this.framTime;
        if (tt >= (1000 * 60 * this.refreshRate)) {
            this.framTime = t;
            this.refresh();
        } else {
            document.getElementById("shopBtn").textContent =`Shop (${formatDuration(((1000 * 60 * this.refreshRate) - (t - this.framTime)) / 1000)})`;
        }
    }

    show() {
        if (this.overlay) this.overlay.remove();
        if (this.parent) this.parent.remove();
        const container = document.body;

        const overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.id = "overlay";

        const parent = document.createElement("div");
        parent.className = "dialog-parent";

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
            //parent.classList.remove("show");
            //dialog.classList.remove("show");
            //overlay.classList.remove("show");
        });

        // Create the dialog header
        const header = document.createElement("div");
        header.className = "dialog-header";
        header.textContent = "Shop";

        // Create the table
        const table = document.createElement("table");
        table.className = "table";

        // Create the table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        ["Image", "Name", "Desc", "Have", "Price", "Buy"].forEach((col) => {
            const th = document.createElement("th");
            th.className = "th";
            th.textContent = col;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create the table body
        const tbody = document.createElement("tbody");
        for (let i =0 ; i < this.items.length; ++i) {
            const id   = this.items[i];
            if (id == undefined) return;
            const item = $items[id];
            const row = document.createElement("tr");
            row.className = "tr";

            // Image column
            const imageCell = document.createElement("td");
            imageCell.className = "td";
            const img = document.createElement("canvas");
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

            // Name column
            const descCell = document.createElement("td");
            descCell.className = "td";
            descCell.textContent = item.desc;
            row.appendChild(descCell);

            // Amount column
            const amountCell = document.createElement("td");
            amountCell.className = "td";
            const eqhave = hero.equipCoundByID(id, item.type);
            amountCell.textContent = hero.items[id] ? hero.items[id].amount + eqhave : 0;
            row.appendChild(amountCell);

            // Name column
            const priceCell = document.createElement("td");
            priceCell.className = "td";
            priceCell.textContent = item.cost;
            row.appendChild(priceCell);

            // buy
            const buyCell = document.createElement("td");
            buyCell.className = "td";
            const buyBtn  = document.createElement("button");
            buyBtn.textContent = "Buy";
            buyBtn.onclick = e => {
                if (hero.gold >= item.cost) {
                    hero.give("gold", -item.cost);
                    hero.give(id, 1);
                    //if (item.type == "item")
                    //    item.use(hero, map);
                    this.items.splice(i, 1);
                    row.remove();
                }
            };
            buyCell.appendChild(buyBtn);
            row.appendChild(buyCell);

            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        // Append elements to the dialog
        dialog.appendChild(closeButton);
        dialog.appendChild(header);
        parent.appendChild(table);
        dialog.appendChild(parent);

        // Append dialog and overlay to the container
        container.appendChild(overlay);
        container.appendChild(dialog);

        // Show dialog and overlay
        dialog.classList.add("show");
        overlay.classList.add("show");

        // Close dialog when overlay is clicked
        overlay.addEventListener("click", () => {
            overlay.remove();
            dialog.remove();
            //parent.classList.remove("show");
            //dialog.classList.remove("show");
            //overlay.classList.remove("show");
        });

        this.overlay = overlay;
        this.parent = dialog;
    }

    buy(type) {
        switch (type) {
            case "life":
                const cost = hero.life[1] < 25 ? hero.life[1] * 5 : 
                             hero.life[1] < 30 ? hero.life[1] * 100 : 
                             hero.life[1] < 35 ? hero.life[1] * 200 : Infinity;
                const c = confirm(`Buy life for ${cost}G`);
                if (c && hero.gold >= cost) {
                    hero.updateStat("life", hero.life[0]+1, hero.life[1]+1);
                    hero.give("gold", cost);
                }
            break;
        }
    }

    refresh() {
        this.items = ["potions"];
        const items = Object.keys($items);
        for (let i = 0; i < 4; ++i) {
            const itemId = Chance.pick(items);
            const item   = $items[itemId];
            if (item.shop != false)
                this.items.push(itemId);
            else
                --i;
        }
    }
}