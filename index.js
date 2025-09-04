import { UIBuilder } from './src/UIBuilder.js';

import { BloomFilter } from './src/bloomFilter.js';
import { draw } from './src/draw.js';

const bloomSize = 10;
const hashCount = 2;
const bloom = new BloomFilter(bloomSize, hashCount);
const uiBuilder = new UIBuilder(draw, bloom, ['potato', 'tomato', 'cucumber', 'onion', 'carrot'], 'potato');

function refreshUI () {
    uiBuilder.renderList();
    uiBuilder.renderBits();
}

document.addEventListener('refreshUI', () => {
    refreshUI();
});

document.addEventListener('DOMContentLoaded', () => {
    if (!uiBuilder) {
        // wait until uiBuilder is initialized
        setTimeout(() => {
            refreshUI();
        }, 50);
    } else {
        refreshUI();
    }
});

window.addEventListener('resize', () => {
    document.dispatchEvent(new Event('refreshUI'));
});