const Words = require("../../Util/Words.js");

module.exports = {
    name: "wordlists",
    description: "Get the available wordlists!",
    //usage: "-wordlists",
    exe(message, args, handler) {
        let availableWordLists = Words.Wordlist.getAvailableWordLists();
        message.channel.send("**Available word lists: **\n```\n" + availableWordLists.join("\n") + "```");
    }
}