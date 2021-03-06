const { Collection } = require("discord.js");
const Word = require("./Word.js");
const Team = require("./Team.js");
const Words = require("../Util/Words.js");
const Canvas = require("../Util/Canvas.js");
const Player = require("./Player.js");

class Game {
    constructor(channel, id) {
        this.channel = channel;
        this.board = new Canvas();
        this.id = id;
        this.masterBoard = new Canvas();
        this.words = new Words.Words();
        this.players = new Collection();
        this.teams = {};
        this.lastAction = null;
        this.started = false;
        this.turn = null;
        this.clue = null;
    }

    addWord(word, data) {
        this.words.push(new Word(word, data));
    }

    addPlayer(user, team) {
        const pl = new Player(user, this.teams[team]);
        this.players.set(user.id, pl);
        return pl;
    }

    removePlayer(id) {
        this.players.delete(id);
    }

    addTeam(name, data) {
        this.teams[name] = new Team(name, { game: this, ...data });
    }

    mapTeams(fn) {
        const res = [];
        for (let team in this.teams) {
            team = this.teams[team];
            res.push(fn(team));
        }
        return res;
    }

    configure(customWords) {
        const fromDiskWordList = new Words.Wordlist(customWords);
        if (fromDiskWordList.wordsFilename && !fromDiskWordList.validWordsFilename) {
            this.channel.send("**✖ Invalid custom words filename, using default words. -end and try again if desired.**");
            this.channel.send("Available word lists: " + fromDiskWordList.availableWordLists.join(", "));
        }
        const words = fromDiskWordList.random(25);
        if (!fromDiskWordList.wordsFilename && customWords.length) words.replace(customWords.length, customWords.map(w => w.toLowerCase()));
        this.board.drawBoard(words);
        this.masterBoard.drawBoard(words);
        return words;
    }

    updateMasterBoard() {
        for (let word of this.words) {
            word.update(this.masterBoard, true);
        }
    }

    displayMasterBoard() {
        this.updateMasterBoard();
        this.masterBoard.sendAsMessage(this.turn.spymaster.user, `**${this.turn.emoji} | Your team: ${this.turn}**`)
    }

    displayMasterBoardFirst() {
        for (let word of this.words) {
            word.update(this.masterBoard, true);
        }
        for (let teamName in this.teams) {
            this.masterBoard.sendAsMessage(this.teams[teamName].spymaster.user, `**${this.teams[teamName].emoji} | Your team: ${teamName}**`)
        }
    }

}

module.exports = Game;
