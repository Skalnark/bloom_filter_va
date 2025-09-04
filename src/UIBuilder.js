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

    renderBits() {
        this.bitsDiv.innerHTML = '';
        this.bloom.bits.forEach((bit, i) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'bit-item';
            itemDiv.textContent = bit ? '1' : '0';
            itemDiv.title = `Bit ${i}`;
            itemDiv.id = 'bit-' + i;
            this.bitsDiv.appendChild(itemDiv);
        });
    }

    initializeDebug(initialItems = [], debugSearch = '') {
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
        this.inputCheckField.value = '';
        if (value) {
            let contains = true;
            this.inputWordDiv.textContent = value;
            this.inputWordDiv.style.opacity = '1';
            for (let i = 1; i <= this.bloom.hashCount; i++) {
                const pos = this.bloom.hash(value, i);
                const bitDiv = document.getElementById('bit-' + pos);
                let color = '#14ce43ff';
                if (!this.bloom.bits[pos]) {
                    contains = false;
                    color = '#c93030ff';
                }

                if (bitDiv) {
                    this.draw.drawCheckLine(this.inputWordDiv, bitDiv, color);
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
            const itemDiv = document.createElement('div');
            itemDiv.className = 'list-item';
            itemDiv.textContent = value;
            itemDiv.id = 'item-' + value;
            this.listDiv.appendChild(itemDiv);
            const color = this.#stringToColor(value);

            this.bloom.add(value);
            this.inputItemField.value = '';

            for (let i = 1; i <= this.bloom.hashCount; i++) {
                const pos = this.bloom.hash(value, i);
                const bitDiv = document.getElementById('bit-' + pos);

                if (bitDiv) {
                    this.draw.drawItemLine(itemDiv, bitDiv, color);
                }
            }
            this.checkItem();
        }
    }

    #stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            const value = (hash >> (i * 8)) & 0xFF;
            color += value.toString(16).padStart(2, '0');
        }
        return color;
    }

    initializeAddItemInputContainer() {
        const addItemInputContainer = document.getElementById('add-item-input-container');
        this.inputItemField = document.createElement('input');
        this.inputItemField.type = 'text';
        this.inputItemField.placeholder = 'Enter item value';
        this.inputItemField.maxLength = 20;
        this.inputItemField.className = 'input-field';
        addItemInputContainer.appendChild(this.inputItemField);

        this.inputItemButton = document.createElement('button');
        this.inputItemButton.id = 'add-item-btn';
        this.inputItemButton.textContent = 'Add Element';
        this.inputItemButton.className = 'input-button';
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

    initializeBloomFilterContainer() {
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
        this.inputCheckField.className = 'input-field';
        checkItemInputContainer.appendChild(this.inputCheckField);

        this.inputCheckButton = document.createElement('button');
        this.inputCheckButton.textContent = 'Check Item';
        this.inputCheckButton.className = 'input-button';
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