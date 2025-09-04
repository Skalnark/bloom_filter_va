import { renderDynamicList,
         renderBloomFilterBits,
         checkItemInBloomFilter, 
         addItemToDynamicList } from './src/list.js';

import { initializeSVG } from './src/connectDivs.js';
import { BloomFilter } from './src/bloomFilter.js';

const bloomSize = 10;
const hashCount = 2;
const bloom = new BloomFilter(bloomSize, hashCount);
const listItems = ['UFPB'];
const debugSearch = '';

// Graphics
const svg = initializeSVG();
const listLines = [];
const checkLines = [];

function refreshUI () {
    renderDynamicList(listItems, bloom);
    renderBloomFilterBits('bloom-filter-container', bloom);
    checkItemInBloomFilter(bloom, debugSearch, checkLines, svg);
}

document.addEventListener('refreshUI', () => {
    refreshUI();
});

document.addEventListener('DOMContentLoaded', () => {
    addItemToDynamicList(listItems);
    refreshUI();
});