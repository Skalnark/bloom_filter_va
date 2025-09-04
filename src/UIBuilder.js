class UIBuilder {

    draw = null;
    bitsRendered = false;
    inputCheckButton = null;
    inputItemButton = null;
    inputCheckField = null;
    inputItemField = null;
    inputWordDiv = null;
    captionDiv = null;
    bitsDiv = null;
    listDiv = null;
    bloom = null;
    itemList = [];

    constructor(draw, bloom, initialItems = [], debugSearch = '') {
        this.draw = draw;
        this.bitsRendered = false;
        this.bloom = bloom;
        this.initializeAddItemInputContainer();
        this.initializeAddItemContainer();
        this.initializeBloomFilterContainer();
        this.initializeCheckItemContainer();
        this.initializeDisplayContainer();

        this.initializeDebug(initialItems, debugSearch);
    }

    renderList() {
        this.listDiv.innerHTML = '';
        this.itemList.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'list-item';
            itemDiv.textContent = item;
            this.listDiv.appendChild(itemDiv);
        });
    }

    renderBits() {
        this.bitsDiv.innerHTML = '';
        this.bloom.bits.forEach((bit, i) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'list-item';
            itemDiv.textContent = bit ? '1' : '0';
            itemDiv.title = `Bit ${i}`;
            itemDiv.id = 'bit-' + i;
            this.bitsDiv.appendChild(itemDiv);
        });
    }

    initializeDebug(initialItems = [], debugSearch = '') {
        console.log('Initializing debug with items:', initialItems, 'and search:', debugSearch);
        initialItems.forEach(item => {
            this.inputItemField.value = item;
            this.addItem();
        });

        this.inputCheckField.value = debugSearch;
        this.checkItem();
    }

    checkItem() {
        this.draw.clearCheckLines();

        const value = this.inputCheckField.value.trim();
        if (value) {
            let contains = true;
            this.inputWordDiv.textContent = value;
            this.inputWordDiv.style.opacity = '1';
            for (let i = 1; i <= this.bloom.hashCount; i++) {
                const pos = this.bloom.hash(value, i);
                const bitDiv = document.getElementById('bit-' + pos);

                if (bitDiv) {
                    this.draw.drawCheckLine(this.inputWordDiv, bitDiv);
                }

                if (!this.bloom.bits[pos]) {
                    contains = false;
                }
            }

            this.captionDiv.textContent = contains ? `"${value}" is possibly in the set.` : `"${value}" is definitely not in the set.`;
        }
        else {
            this.inputWordDiv.style.opacity = '0';
            this.captionDiv.textContent = '';
        }

        document.dispatchEvent(new Event('refreshUI'));
    }

    addItem() {
        const value = this.inputItemField.value.trim();
        if (value) {
            this.itemList.push(value);
            this.bloom.add(value);
            this.inputItemField.value = '';
            document.dispatchEvent(new Event('refreshUI'));
        }
    }

    initializeAddItemInputContainer() {
        const addItemInputContainer = document.getElementById('add-item-input-container');
        this.inputItemField = document.createElement('input');
        this.inputItemField.type = 'text';
        this.inputItemField.placeholder = 'Enter item value';
        this.inputItemField.maxLength = 20;
        this.inputItemField.style.display = 'block';
        this.inputItemField.style.marginBottom = '8px';
        addItemInputContainer.appendChild(this.inputItemField);

        this.inputItemButton = document.createElement('button');
        this.inputItemButton.id = 'add-item-btn';
        this.inputItemButton.textContent = 'Add Element';
        addItemInputContainer.appendChild(this.inputItemButton);

        this.inputItemButton.addEventListener('click', () => this.addItem());
        this.inputItemField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.addItem();
            }
        });
    }

    initializeAddItemContainer() {
        const addItemContainer = document.getElementById('add-item-container');
        addItemContainer.innerHTML = '';
        this.listDiv = document.createElement('div');
        this.listDiv.id = 'left-list';
        this.listDiv.className = 'list-elements';
        addItemContainer.appendChild(this.listDiv);
    }

    initializeBloomFilterContainer()
    {
        const bloomFilterContainer = document.getElementById('bloom-filter-container');
        bloomFilterContainer.innerHTML = '';

        this.bitsDiv = document.createElement('div');
        this.bitsDiv.className = 'bloom-filter-elements';
        bloomFilterContainer.appendChild(this.bitsDiv);

        this.renderBits();
    }

    initializeCheckItemContainer() {
        const checkItemInputContainer = document.getElementById('check-item-input-container');

        checkItemInputContainer.innerHTML = '';
        this.inputCheckField = document.createElement('input');
        this.inputCheckField.type = 'text';
        this.inputCheckField.placeholder = 'Enter item to check';
        this.inputCheckField.maxLength = 20;
        this.inputCheckField.style.display = 'block';
        this.inputCheckField.style.marginBottom = '8px';
        checkItemInputContainer.appendChild(this.inputCheckField);

        this.inputCheckButton = document.createElement('button');
        this.inputCheckButton.textContent = 'Check Item';
        checkItemInputContainer.appendChild(this.inputCheckButton);

        this.inputCheckButton.addEventListener('click', () => this.checkItem());
        this.inputCheckField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.checkItem();
            }
        });
    }

    initializeDisplayContainer() {
        const displayContainer = document.getElementById('check-item-container');
        displayContainer.innerHTML = '';

        this.inputWordDiv = document.createElement('div');
        this.inputWordDiv.id = 'right-list';
        this.inputWordDiv.className = 'list-item';
        displayContainer.appendChild(this.inputWordDiv);
        this.inputWordDiv.style.opacity = '0';

        this.captionDiv = document.createElement('div');
        this.captionDiv.id = 'caption';
        this.captionDiv.className = 'caption';
        displayContainer.appendChild(this.captionDiv);
    }
}

export { UIBuilder };