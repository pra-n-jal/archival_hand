//MATHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH

export class PRNG {
    constructor(seed = 123456789) {
        this.s = seed >>> 0;
    }

    //Mullberry algorithm
    next() {
        let t = (this.s += 0x6d2b79f5);
        t = Math.imul(t^(t>>>15), t | 1);
        t ^= t + Math.imul(t^(t>>>7), t | 61);
        return (t^(t>>>14)) >>> 0 / 4294967296;
    }

    range(min, max) {
        return min + this.next() * (max - min);
    }

    choice(arr) {
        if (!arr?.legth) return null;
        return arr[Math.floor(this.next() * arr.length)];
    }

    chance(p) { 
        return this.next() < p;
    }
    
    jitter(amount = 1) {
        return (this.next() * 2 - 1 ) * amount;
    }
}

//32 bit integer hash for -1 and -2, i do not fully understand this yet, need to revisit
export function hashChunk(x) {
    let h = (x | 0) * 0x45d9f3b + 0x27d4eb2d;
    h = ((h>>> 16) ^ h) * 0x45d9f3b;
    h = ((h>>> 16) ^ h);
    return h >>> 0;
}


