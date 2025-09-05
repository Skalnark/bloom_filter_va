import { BloomFilter } from './BloomFilter.js';

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
    currentElements = [];

    constructor(draw, bloom) {
        this.draw = draw;
        this.bitsRendered = false;
        this.bloom = bloom;
        this.initializeAddItemInputContainer();
        this.initializeAddItemContainer();
        this.initializeBloomFilterContainer();
        this.initializeCheckItemContainer();
        this.initializeDisplayContainer();
        this.initializeStartingParamsUI();

        const items = ['apple', 'banana', 'grape', 'orange'];
        this.initializeDebug(items, 'teste');
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

            if(contains){
                this.captionDiv.textContent = `"${value}" is possibly in the set.`;
                this.captionAlertDiv.textContent = '(true positive)';
                this.captionAlertDiv.style.color = '#14ce43ff';
                if(!this.currentElements.includes(value)){
                    this.captionAlertDiv.textContent = '(false positive)';
                    this.captionAlertDiv.style.color = '#ff7b00ff';
                }
            }
            else{
                this.captionDiv.textContent = `"${value}" is definitely not in the set.`;
                this.captionAlertDiv.textContent = '(true negative)';
                this.captionAlertDiv.style.color = '#c93030ff';
            }
        }
        else {
            this.inputWordDiv.style.opacity = '0';
            this.captionDiv.textContent = '';
            this.captionAlertDiv.textContent = '';
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
            this.currentElements.push(value);
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
        this.displayContainer = document.getElementById('check-item-container');
        this.displayContainer.innerHTML = '';

        this.inputWordDiv = document.createElement('div');
        this.inputWordDiv.id = 'right-list';
        this.inputWordDiv.className = 'list-item';
        this.displayContainer.appendChild(this.inputWordDiv);
        this.inputWordDiv.style.opacity = '0';

        this.captionDiv = document.createElement('div');
        this.captionDiv.id = 'caption';
        this.captionDiv.className = 'caption';
        this.displayContainer.appendChild(this.captionDiv);

        this.captionAlertDiv = document.createElement('div');
        this.captionAlertDiv.id = 'caption-alert';
        this.captionAlertDiv.className = 'caption';
        this.displayContainer.appendChild(this.captionAlertDiv);
    }

    initializeStartingParamsUI() {

        const startingParamsContainer = document.getElementById('starting-params-container');
        startingParamsContainer.innerHTML = '';

        const sizeGroup = document.createElement('div');
        sizeGroup.style.display = 'flex';
        sizeGroup.style.alignItems = 'center';
        sizeGroup.style.marginBottom = '12px';

        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Bloom filter size:';
        sizeLabel.setAttribute('for', 'bloom-size-input');
        sizeLabel.style.marginRight = '8px';
        sizeLabel.style.minWidth = '140px';
        sizeLabel.style.textAlign = 'right';
        sizeGroup.appendChild(sizeLabel);

        const sizeInput = document.createElement('input');
        sizeInput.type = 'number';
        sizeInput.placeholder = 'Bloom filter size';
        sizeInput.className = 'input-field';
        sizeInput.value = this.bloom.size;
        sizeInput.id = 'bloom-size-input';
        sizeGroup.appendChild(sizeInput);

        startingParamsContainer.appendChild(sizeGroup);

        const hashGroup = document.createElement('div');
        hashGroup.style.display = 'flex';
        hashGroup.style.alignItems = 'center';
        hashGroup.style.marginBottom = '12px';

        const hashCountLabel = document.createElement('label');
        hashCountLabel.textContent = 'Number of hash functions:';
        hashCountLabel.setAttribute('for', 'bloom-hashcount-input');
        hashCountLabel.style.marginRight = '8px';
        hashCountLabel.style.minWidth = '140px';
        hashCountLabel.style.textAlign = 'right';
        hashGroup.appendChild(hashCountLabel);

        const hashCountInput = document.createElement('input');
        hashCountInput.type = 'number';
        hashCountInput.placeholder = 'Number of hash functions';
        hashCountInput.className = 'input-field';
        hashCountInput.value = this.bloom.hashCount;
        hashCountInput.id = 'bloom-hashcount-input';
        hashGroup.appendChild(hashCountInput);

        startingParamsContainer.appendChild(hashGroup);

        const setParamsButton = document.createElement('button');
        setParamsButton.textContent = 'Set Parameters';
        setParamsButton.className = 'input-button';
        startingParamsContainer.appendChild(setParamsButton);

        const dummyDataLabel = document.createElement('label');
        dummyDataLabel.textContent = 'Enable dummy data:';
        dummyDataLabel.setAttribute('for', 'dummy-data-checkbox');
        dummyDataLabel.style.marginRight = '8px';
        dummyDataLabel.style.minWidth = '140px';
        dummyDataLabel.style.textAlign = 'right';
        startingParamsContainer.appendChild(dummyDataLabel);

        const dummyDataCheckbox = document.createElement('input');
        dummyDataCheckbox.type = 'checkbox';
        dummyDataCheckbox.id = 'dummy-data-checkbox';
        dummyDataCheckbox.style.transform = 'scale(1.4)';
        dummyDataCheckbox.checked = true;
        this.initializeWithDummyData = true;
        startingParamsContainer.appendChild(dummyDataCheckbox);

        dummyDataCheckbox.addEventListener('change', () => {
            const isChecked = dummyDataCheckbox.checked;
            if (isChecked) {
                this.initializeWithDummyData = true;
            }
        });

        setParamsButton.addEventListener('click', () => {
            const size = parseInt(sizeInput.value);
            const hashCount = parseInt(hashCountInput.value);
            if (!isNaN(size) && !isNaN(hashCount)) {
                this.bloom = new BloomFilter(size, hashCount);
                this.currentElements = [];
                this.draw.clearAllLines();
                this.listDiv.innerHTML = '';
                this.inputCheckField.value = '';
                
                this.checkItem();
                if(this.initializeWithDummyData){
                    const items = ['apple', 'banana', 'grape', 'orange'];
                    this.initializeDebug(items, 'teste');
                }

            }
        });
    }
}

export { UIBuilder };