import { UIBuilder } from './src/UIBuilder.js';

import { BloomFilter } from './src/bloomFilter.js';
import { draw } from './src/draw.js';

const bloom = new BloomFilter(20, 2);
const uiBuilder = new UIBuilder(draw, bloom, ['potato', 'tomato'], 'potato');

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