const fs = require('fs');
const path = require('path');
const Word = require("../Codenames/Word.js");

class Words extends Array {
    constructor(...items) {
        super(...items);
    }

    random(amount = 1, willDelete = false) {
        amount = Math.min(this.length, amount);
        if (willDelete) return Words.from({ length: amount }, () => this.splice(Math.floor(Math.random() * this.length), 1)[0]);
        else {
            const arr = this.slice();
            return Words.from({ length: amount }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
        }
    }

    fromWhich(num, type) {
        const which = this.random(num, true);
        const res = new Words();
        for (let i = 0; i < which.length; i++) {
            const word = new Word(which[i], { type: type });
            res.push(word);
            this[this.indexOf(word.word)] = word;
        }
        return res;
    }

    shuffle() {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }

    remove(word) {
        this.splice(this.indexOf(word), 1);
    }

    replace(amount, replacements = [], start = 0) {
        this.splice(start, amount, ...replacements)
    }

    red() {
        return this.filter(w => w.type == 'red' && w.guessedBy);
    }

    blue() {
        return this.filter(w => w.type == 'blue' && w.guessedBy);
    }

    assassin() {
        return this.filter(w => w.type == 'assassin' && w.guessedBy);
    }

    neutral() {
        return this.filter(w => w.type == 'neutral' && w.guessedBy);
    }

    unguessed() {
        return this.filter(w => !w.guessedBy);
    }

}

class Wordlist extends Words {
    validWordsFilename = true;
    availableWordLists = [];
    wordsFilename = null;

    constructor(customWords) {
        super();
        if (customWords.length && customWords.length == 1 && customWords[0].startsWith("words_")) {
            this.wordsFilename = customWords[0];
        }
        if (typeof (this.wordsFilename) != "string") this.wordsFilename = "Words";
        if (!this.checkValidWordsFilename(this.wordsFilename)) {
            this.wordsFilename = "Words.txt";
            this.validWordsFilename = false;
            this.availableWordLists = Wordlist.getAvailableWordLists();
        }
        else {
            this.wordsFilename += ".txt";
            if (!fs.existsSync("./assets/" + this.wordsFilename)) {
                this.wordsFilename = "Words.txt";
                this.validWordsFilename = false;
                this.availableWordLists = Wordlist.getAvailableWordLists();
            }
        }
        const data = fs.readFileSync("./assets/" + this.wordsFilename, { encoding: 'utf8' });
        let arr = data.split("\r\n").map(w => w.toLowerCase()).filter(w => w.length > 1);
        if (arr.length == 1) arr = data.split("\n").map(w => w.toLowerCase()).filter(w => w.length > 1);
        this.push(...arr);
    }

    static getAvailableWordLists() {
        let availableWordLists = [];
        let assetFiles = fs.readdirSync("./assets/", { encoding: 'utf8' });
        assetFiles.forEach(file => {
            if (file.startsWith("words_") && file.endsWith(".txt") && !fs.lstatSync(path.resolve("./assets/", file)).isDirectory())
                availableWordLists.push(file.slice(0, -4));
        });
        return availableWordLists;
    }

    checkValidWordsFilename(str) {
        return !/[~`!.#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(str);
    }
}

module.exports = {
    Words: Words,
    Wordlist: Wordlist,
}