import { renderDynamicList,
         renderBloomFilterBits,
         checkItemInBloomFilter, 
         addItemToDynamicList } from './src/list.js';

import { BloomFilter } from './src/bloomFilter.js';
import { draw } from './src/draw.js';

const bloomSize = 10;
const hashCount = 2;
const bloom = new BloomFilter(bloomSize, hashCount);
const listItems = ['UFPB'];
const debugSearch = '';

function refreshUI () {
    renderDynamicList(listItems, bloom);
    renderBloomFilterBits('bloom-filter-container', bloom);
    checkItemInBloomFilter(bloom, debugSearch);
}

document.addEventListener('refreshUI', () => {
    refreshUI();
});

document.addEventListener('DOMContentLoaded', () => {
    addItemToDynamicList(listItems);
    refreshUI();
});