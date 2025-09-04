export class BloomFilter {
    constructor(size = 10, hashCount = 3) {
        this.size = size;
        this.hashCount = hashCount;
        this.bits = new Array(size).fill(false);
    }

    hash(str, seed) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * seed + str.charCodeAt(i)) % this.size;
        }
        return hash;
    }

    add(item) {
        for (let i = 1; i <= this.hashCount; i++) {
            const pos = this.hash(item, i);
            this.bits[pos] = true;
        }
    }

    contains(item) {
        for (let i = 1; i <= this.hashCount; i++) {
            const pos = this.hash(item, i);
            if (!this.bits[pos]) return false;
        }
        return true;
    }
}
