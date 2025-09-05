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
    infoDivs = [];

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
        this.initializeInfoContainer();

        this.initializeWithDummyData = true;
        this.rebuildUI();
    }

    // create a new info div
    addInfoDiv(title, callback, sufix = '') {
        const group = document.createElement('div');
        group.className = 'info-group';
        const label = document.createElement('label');
        label.textContent = title + ': ';
        label.className = 'info-label';
        group.appendChild(label);
        const valueSpan = document.createElement('span');
        valueSpan.className = 'info-value';
        group.appendChild(valueSpan);

        document.addEventListener('refreshUI', () => {
            valueSpan.textContent = callback() + sufix;
        });

        this.infoDivs.push(group);
        valueSpan.textContent = callback();
    }

    initializeInfoContainer() {
        this.addInfoDiv('Filter Size', () => { return this.bloom.size });
        this.addInfoDiv('Hash Functions', () => { return this.bloom.hashCount });
        this.addInfoDiv('Elements Added', () => { return this.currentElements.length; });
        this.addInfoDiv('False Positive Rate', () => this.bloom.falsePositiveRate(this.currentElements.length).toFixed(4), ' %');
        //this.addInfoDiv('Optimal Size', () => this.bloom.calculateOptimalSize(this.currentElements.length), ' bits');
        //this.addInfoDiv('Optimal Hash Count', () => this.bloom.calculateOptimalHashCount(this.currentElements.length), ' functions');
    }

    renderInfoContainer() {
        const infoContainer = document.getElementById('info-container');
        infoContainer.innerHTML = '';

        for (const info of this.infoDivs) {
            infoContainer.appendChild(info);
        }
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

            if (contains) {
                this.captionDiv.textContent = `"${value}" is possibly in the set.`;
                this.captionAlertDiv.textContent = '(true positive)';
                this.captionAlertDiv.style.color = '#14ce43ff';
                if (!this.currentElements.includes(value)) {
                    this.captionAlertDiv.textContent = '(false positive)';
                    this.captionAlertDiv.style.color = '#ff7b00ff';
                }
            }
            else {
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
        this.inputItemField.className = 'text-input-field';
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
        this.inputCheckField.className = 'text-input-field';
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

        // Add False Positive Rate input label
        let group = document.createElement('div');
        /*group.className = 'input-group';
        const falsePositiveRateLabel = document.createElement('label');
        falsePositiveRateLabel.textContent = 'Desired FPR (%):';
        falsePositiveRateLabel.setAttribute('for', 'bloom-false-positive-rate-input');
        falsePositiveRateLabel.className = 'input-label';
        group.appendChild(falsePositiveRateLabel);

        const falsePositiveRateInput = document.createElement('input');
        falsePositiveRateInput.type = 'number';
        falsePositiveRateInput.placeholder = 'False Positive Rate';
        falsePositiveRateInput.className = 'input-field';
        falsePositiveRateInput.id = 'bloom-false-positive-rate-input';
        falsePositiveRateInput.value = this.bloom.desiredFalsePositiveRate;
        group.appendChild(falsePositiveRateInput);

        startingParamsContainer.appendChild(group);

        group = document.createElement('div');*/
        group.className = 'input-group';

        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Bloom filter size:';
        sizeLabel.setAttribute('for', 'bloom-size-input');
        sizeLabel.className = 'input-label';
        group.appendChild(sizeLabel);

        const sizeInput = document.createElement('input');
        sizeInput.className = 'input-field';
        sizeInput.type = 'number';
        sizeInput.value = this.bloom.size;
        group.appendChild(sizeInput);

        startingParamsContainer.appendChild(group);

        group = document.createElement('div');
        group.className = 'input-group';

        const hashCountLabel = document.createElement('label');
        hashCountLabel.textContent = 'Number of hash functions:';
        hashCountLabel.setAttribute('for', 'bloom-hashcount-input');
        hashCountLabel.className = 'input-label';
        group.appendChild(hashCountLabel);

        const hashCountInput = document.createElement('input');
        hashCountInput.type = 'number';
        hashCountInput.placeholder = 'Number of hash functions';
        hashCountInput.className = 'input-field';
        hashCountInput.value = this.bloom.hashCount;
        hashCountInput.id = 'bloom-hashcount-input';
        group.appendChild(hashCountInput);
        startingParamsContainer.appendChild(group);

        group = document.createElement('div');
        group.className = 'input-group';
        const dummyDataLabel = document.createElement('label');
        dummyDataLabel.textContent = 'Enable dummy data:';
        dummyDataLabel.setAttribute('for', 'dummy-data-checkbox');
        dummyDataLabel.className = 'input-label';
        group.appendChild(dummyDataLabel);

        const dummyDataCheckbox = document.createElement('input');
        dummyDataCheckbox.type = 'checkbox';
        dummyDataCheckbox.id = 'dummy-data-checkbox';
        dummyDataCheckbox.className = 'input-checkbox';
        dummyDataCheckbox.checked = true;
        this.initializeWithDummyData = true;
        group.appendChild(dummyDataCheckbox);
        startingParamsContainer.appendChild(group);

        group = document.createElement('div');
        group.className = 'input-group';
        const setParamsButton = document.createElement('button');
        setParamsButton.textContent = 'Set Parameters';
        setParamsButton.className = 'input-button';
        group.appendChild(setParamsButton);
        startingParamsContainer.appendChild(group);

        dummyDataCheckbox.addEventListener('change', () => {
            const isChecked = dummyDataCheckbox.checked;
            if (isChecked) {
                this.initializeWithDummyData = true;
            }
            else {
                this.initializeWithDummyData = false;
            }
        });

        sizeInput.addEventListener('change', () => {
            const newSize = parseInt(sizeInput.value);
            if (!isNaN(newSize) && newSize > 0) {
                this.bloom.desiredSize = newSize;
            }
        });

        hashCountInput.addEventListener('change', () => {
            const newHashCount = parseInt(hashCountInput.value);
            if (!isNaN(newHashCount) && newHashCount > 0) {
                this.bloom.desiredNumHashCount = newHashCount;
            }
        });

        setParamsButton.addEventListener('click', () => this.rebuildUI());
    }

    rebuildUI() {
        this.currentElements = [];
        this.draw.clearAllLines();
        this.listDiv.innerHTML = '';
        this.inputCheckField.value = '';

        if(this.bloom.desiredSize != this.bloom.size || this.bloom.desiredNumHashCount != this.bloom.hashCount) {
            this.bloom = new BloomFilter(this.bloom.desiredSize, this.bloom.desiredNumHashCount);
        }

        if (this.initializeWithDummyData) {
            const items = ['apple', 'banana', 'grape', 'orange'];

            items.forEach(item => {
                this.inputItemField.value = item;
                this.addItem();
            });

            this.inputCheckField.value = 'test';
        }
        this.checkItem();
    }
}

export { UIBuilder };