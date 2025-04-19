
/**
 * 
 * @param {*} containerId 
 * @param {*} imageList a object of ids of the spritesheet, key=name, value=id
 * @param {*} sprites spritesheet
 * @returns 
 */

function createImageDropdown(containerId, imageList, sprites, hero, type, slot) {
    const container = containerId instanceof HTMLElement ? containerId : document.getElementById(containerId);

    if (!container || !imageList /*|| imageList.length == 0*/) {
        console.error("Container not found or image list is empty");
        return;
    }

    // Create the dropdown container
    //const dropdownContainer = document.createElement("div");
    //dropdownContainer.className = "dropdown-container";

    // Create the dropdown button
    //const dropdownButton = document.createElement("button");
    //dropdownButton.className = "dropdown-button";
    //dropdownButton.textContent = "Select an Option";
    //dropdownContainer.appendChild(dropdownButton);

    // Create the dropdown list
    const dropdownList = document.createElement("div");
    dropdownList.className = "dropdown-list";

    const list = [
        {name: "None", graphicId: 0, desc: "Unequip item", key: "none"}
    ].concat(imageList);

    imageList = list;

    // Add each image and label to the dropdown
    for (let i = 0; i < imageList.length; ++i) 
    {
        const id = imageList[i];

        const item = typeof id == "string" ?$items[id] : id;
        const dropdownItem = document.createElement("a");
        dropdownItem.href = "#";
        dropdownItem.title = item.desc;

        const img = document.createElement("canvas");
        img.width = sprites.cellWidth;
        img.height = sprites.cellHeight;
        img.alt = item.name;
        sprites.drawByID(img.getContext("2d"), item.graphicId, 0, 0, img.width,img.height);

        dropdownItem.appendChild(img);
        dropdownItem.appendChild(document.createTextNode(item.name));
        dropdownList.appendChild(dropdownItem);
        dropdownItem.onclick = e => {
            if (item.key == "none") {
                hero.unequip(typeof id == "string" ? id : type, slot);
            } else {
                hero.equip(id, slot);
            }
            
            dropdownList.remove();
        };
    }

    container.appendChild(dropdownList);
    //dropdownContainer.appendChild(dropdownList);
    //container.appendChild(dropdownContainer);
}
