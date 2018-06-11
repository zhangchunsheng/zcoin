const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block MINED: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock() {
        return new Block(0, "2018-01-01", "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for(let i = 1 ; i < this.chain.length ; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }
            if(currentBlock.previousHash != previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let zCoin = new Blockchain();
console.log("Mining block 1");
zCoin.addBlock(new Block(1, "2018-06-11", { amount: 4 }));
console.log("Mining block 2");
zCoin.addBlock(new Block(2, "2018-06-11", { amount: 8 }));

console.log('Blockchain valid? ' + zCoin.isChainValid());

zCoin.chain[1].data = { amount: 100 };

console.log("Blockchain valid? " + zCoin.isChainValid());

zCoin.chain[1].hash = zCoin.chain[1].calculateHash();
zCoin.chain[2].previousHash = zCoin.chain[1].hash;
zCoin.chain[2].hash = zCoin.chain[2].calculateHash();
console.log("Blockchain valid? " + zCoin.isChainValid());

console.log(JSON.stringify(zCoin, null, 4));