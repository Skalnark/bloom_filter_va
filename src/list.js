export function addItemToDynamicList(items = []) {
    const container = document.getElementById('add-item-input-container');
    if(!container)
    {
        console.log(`Input container with id "add-item-input-container" not found.`);
        return;
    }

    // Input box for item value
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter item value';
    input.maxLength = 20;
    input.style.display = 'block';
    input.style.marginBottom = '8px';
    container.appendChild(input);
    
    const button = document.createElement('button');
    button.id = 'add-item-btn';
    button.textContent = 'Add Element';
    container.appendChild(button);

    function addItem() {
        const value = input.value.trim();
        if (value) {
            items.push(value);
            input.value = '';
            document.dispatchEvent(new Event('refreshUI'));
        }
    }
    button.addEventListener('click', addItem);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addItem();
        }
    });

}

// Render a dynamic list in a given container
export function renderDynamicList(items = [], bloom) {
    const container = document.getElementById('add-item-container');
    if(!container)
    {
        console.log(`Container with id "add-item-container" not found.`);
        return;
    }

    container.innerHTML = '';
    const listDiv = document.createElement('div');
    listDiv.id = 'left-list';
    listDiv.className = 'list-elements';
    container.appendChild(listDiv);

    function renderList() {
        listDiv.innerHTML = '';
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'list-item';
            itemDiv.textContent = item;
            listDiv.appendChild(itemDiv);
            bloom.add(item);
        });
    }
    renderList();
}

// Render bloom filter bits in a given container
export function renderBloomFilterBits(containerId, bloom) {
    const container = document.getElementById(containerId);
    if(!container)
    {
        console.log(`Container with id "${container}" not found.`);
        return;
    }

    container.innerHTML = '';
    import('./bloomFilter.js').then(module => {
        const bitsDiv = document.createElement('div');
        bitsDiv.className = 'bloom-filter-elements';
        bloom.bits.forEach((bit, i) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'list-item';
            itemDiv.textContent = bit ? '1' : '0';
            itemDiv.title = `Bit ${i}`;
            bitsDiv.appendChild(itemDiv);
        });
        container.appendChild(bitsDiv);
    });
}

export function checkItemInBloomFilter(bloom) {
    const container = document.getElementById('check-item-input-container');
    if(!container)
    {
        console.log(`Container with id "check-item-input-container" not found.`);
        return;
    }
    
    const displayContainer = document.getElementById('check-item-container');
    if(!displayContainer)
    {
        console.log(`Container with id "check-item-container" not found.`);
        return;
    }

    container.innerHTML = '';

    //create input box
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter item to check';
    input.maxLength = 20;
    input.style.display = 'block';
    input.style.marginBottom = '8px';
    container.appendChild(input);
    
    //create check button
    const button = document.createElement('button');
    button.textContent = 'Check Item';
    container.appendChild(button);

    displayContainer.innerHTML = '';

    const inputWordDiv = document.createElement('div');
    inputWordDiv.id = 'right-list';
    inputWordDiv.className = 'list-item';
    displayContainer.appendChild(inputWordDiv);
    inputWordDiv.style.opacity = '0';

    const captionDiv = document.createElement('div');
    captionDiv.id = 'caption';
    captionDiv.className = 'caption';
    displayContainer.appendChild(captionDiv);

    function checkItem() {
        const value = input.value.trim();
        if (value) {
            let contains = true;
            inputWordDiv.textContent = value;
            inputWordDiv.style.opacity = '1';
            for (let i = 1; i <= bloom.hashCount; i++) {
                const pos = bloom.hash(value, i);
                console.log(`pos: ${pos}`);
                if (!bloom.bits[pos]) {
                    contains = false;
                    break;
                }
            }

            captionDiv.textContent = contains ? `"${value}" is possibly in the set.` : `"${value}" is definitely not in the set.`;
        }
        else {
            inputWordDiv.style.opacity = '0';
            captionDiv.textContent = '';
        }
    }

    button.addEventListener('click', checkItem);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkItem();
        }
    });
}