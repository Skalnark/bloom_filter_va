import { renderDynamicList, renderBloomFilterBits, checkItemInBloomFilter } from './src/list.js';
import { BloomFilter } from './src/bloomFilter.js';


document.addEventListener('DOMContentLoaded', () => {
    const bloomSize = 30;
    const hashCount = 3;
    const bloom = new BloomFilter(bloomSize, hashCount);

    renderDynamicList('add-item-container', 'left-list', 'left-add-btn', ['teste'], bloom);
    renderBloomFilterBits('bloom-filter-container', bloom);
    checkItemInBloomFilter('check-item-container', bloom);
});