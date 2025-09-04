import { UIBuilder } from './src/UIBuilder.js';

import { BloomFilter } from './src/bloomFilter.js';
import { draw } from './src/draw.js';

const bloom = new BloomFilter(20, 2);
const uiBuilder = new UIBuilder(draw, bloom, ['potato', 'tomato'], 'potato');

function refreshUI () {
    uiBuilder.renderBits();
    draw.renderLines();
}

document.addEventListener('refreshUI', () => {
    refreshUI();
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
            document.dispatchEvent(new Event('refreshUI'));
        }, 100);
});

window.addEventListener('resize', () => {
    document.dispatchEvent(new Event('refreshUI'));
});

window.addEventListener('scroll', () => {
    document.dispatchEvent(new Event('refreshUI'));
});