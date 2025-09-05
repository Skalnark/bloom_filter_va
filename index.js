import { UIBuilder } from './src/UIBuilder.js';

import { BloomFilter } from './src/BloomFilter.js';
import { draw } from './src/draw.js';

const bloom = new BloomFilter(15, 3);
const uiBuilder = new UIBuilder(draw, bloom);

function refreshUI () {
    uiBuilder.renderBits();
    uiBuilder.renderInfoContainer();
    draw.renderLines();
}

document.addEventListener('refreshUI', () => {
    refreshUI();
});

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        refreshUI();
    }, 50);
});

window.addEventListener('resize', () => {
    document.dispatchEvent(new Event('refreshUI'));
});

window.addEventListener('scroll', () => {
    document.dispatchEvent(new Event('refreshUI'));
});