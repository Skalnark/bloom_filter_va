export class BloomFilter {

    desiredFalsePositiveRate = 0.1;
    desiredNumElements = 10.0;
    desiredNumHashCount = 3.0;
    desiredSize = 10.0;


    constructor(size = 10, hashCount = 3) {
        this.hashCount = hashCount;
        this.desiredNumHashCount = hashCount;
        this.desiredSize = size;
        this.size = size;
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
        const indexes = [];
        for (let i = 1; i <= this.hashCount; i++) {
            const pos = this.hash(item, i);
            this.bits[pos] = true;
            indexes.push(pos);
        }
        return indexes;
    }

    contains(item) {
        for (let i = 1; i <= this.hashCount; i++) {
            const pos = this.hash(item, i);
            if (!this.bits[pos]) return false;
        }
        return true;
    }

    // All thrash. Delete this later
    falsePositiveRate(numElements) {
        //console.log('p = pow(1 - exp(-k / (m / n)), k)');
        //console.log(`p = pow(1 - exp(-${this.hashCount} / (${this.size} / ${parseFloat(numElements)})), ${this.hashCount})`);
        return Math.pow(1.0 - Math.exp(-this.hashCount / (this.size / parseFloat(numElements))), this.hashCount);
    }

    calculateOptimalSize(numElements) {
        //console.log('ceil((n * log(p)) / log(1 / pow(2, log(2))))');
        //console.log(`ceil((${numElements} * log(${this.desiredFalsePositiveRate})) / log(1 / pow(2, log(2))))`);
        return Math.ceil((this.desiredNumElements * Math.log(this.desiredFalsePositiveRate)) / Math.log(1.0 / Math.pow(2.0, Math.log(2.0))));
    }
    
    calculateOptimalHashCount(numElements) {
        //console.log('round((m / n) * log(2))');
        //console.log(`round((${this.size} / ${numElements}) * log(2))`);
        return Math.round((this.size / numElements) * Math.log(2));
    }
}
