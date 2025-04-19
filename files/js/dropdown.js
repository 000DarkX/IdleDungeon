
/**
 * 
 * @param {*} containerId 
 * @param {*} imageList a object of ids of the spritesheet, key=name, value=id
 * @param {*} sprites spritesheet
 * @returns 
 */
/*function createImageDropdown(containerId, imageList, sprites) {
    const container = containerId instanceof HTMLElement ? containerId : document.getElementById(containerId);

    if (!container || !imageList) {
        console.error("Container not found or image list is empty");
        return;
    }

    // Create the dropdown
    const dropdown = document.createElement("select");
    dropdown.id = "imageDropdown";
    dropdown.innerHTML = `
        <option value="" selected>Select an image</option>
        ${ Object.keys(imageList).map(key => `<option value="${imageList[key]}">${key}</option>`).join()}
    `;
    //${imageList.map(image => `<option value="${image}">${image.split('/').pop()}</option>`).join('')}

    // Create the image display area
    const imageDisplay = document.createElement("div");
    imageDisplay.className = "image-display";

    const imgElement = document.createElement("canvas");
    imgElement.width = sprites.width;
    imgElement.height = sprites.height;
    imgElement.classList.add("img");
    imgElement.id = "selectedImage";
    imgElement.style.display = "none";
    imageDisplay.appendChild(imgElement);

    // Add event listener for dropdown change
    dropdown.addEventListener("change", () => {
        const selectedValue = dropdown.value;
        if (selectedValue != undefined) {
            sprites.drawByID(imgElement.getContext("2d"), selectedValue, 0, 0, sprites.width, sprites.height);
            imgElement.style.display = "block";
        } else {
            imgElement.style.display = "none";
        }
        dropdown.remove();
    });

    // Append elements to the container
    container.appendChild(dropdown);
    container.appendChild(imageDisplay);

    return {dropdown, imageDisplay};
}*/

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
