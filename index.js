import { renderDynamicList, renderBloomFilterBits, checkItemInBloomFilter, addItemToDynamicList } from './src/list.js';
import { BloomFilter } from './src/bloomFilter.js';

const bloomSize = 10;
const hashCount = 2;
const bloom = new BloomFilter(bloomSize, hashCount);
const listItems = ['UFPB'];


function refreshUI () {
    renderDynamicList(listItems, bloom);
    renderBloomFilterBits('bloom-filter-container', bloom);
    checkItemInBloomFilter(bloom);
}

document.addEventListener('refreshUI', () => {
    refreshUI();
});

document.addEventListener('DOMContentLoaded', () => {
    addItemToDynamicList(listItems);
    refreshUI();
});