// Render a dynamic list in a given container
export function renderDynamicList(containerId, listId, buttonId, initialItems = [], bloom) {
    const container = document.getElementById(containerId);
    if(!container)
    {
        console.log(`Container with id "${container}" not found.`);
        return;
    }

    container.innerHTML = '';
    const listDiv = document.createElement('div');
    listDiv.id = listId;
    listDiv.className = 'list-elements';
    container.appendChild(listDiv);

    // Input box for item value
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter item value';
    input.maxLength = 20;
    input.style.display = 'block';
    input.style.marginBottom = '8px';
    container.appendChild(input);

    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = 'Add Element';
    container.appendChild(button);

    let items = [...initialItems];
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
    function addItem() {
        const value = input.value.trim();
        if (value) {
            items.push(value);
            renderList();
            input.value = '';
        }
    }
    button.addEventListener('click', addItem);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            addItem();
        }
    });
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

export function checkItemInBloomFilter(containerId, bloom) {
    const container = document.getElementById(containerId);
    if(!container)
    {
        console.log(`Container with id "${containerId}" not found.`);
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

    //create result div
    const resultDiv = document.createElement('div');
    resultDiv.style.marginTop = '8px';
    container.appendChild(resultDiv);

    function checkItem() {
        const value = input.value.trim();
        if (value) {
            let contains = true;

            for (let i = 1; i <= bloom.hashCount; i++) {
                const pos = bloom.hash(value, i);
                console.log(`pos: ${pos}`);
                if (!bloom.bits[pos]) {
                    contains = false;
                    break;
                }
            }

            resultDiv.textContent = contains ? `"${value}" is possibly in the set.` : `"${value}" is definitely not in the set.`;
            input.value = '';
        }
    }

    button.addEventListener('click', checkItem);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            checkItem();
        }
    });
}