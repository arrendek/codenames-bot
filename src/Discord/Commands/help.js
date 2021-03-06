const { MessageEmbed } = require("discord.js");
const Util = require("../../Util/Util.js");

module.exports = {
    name: "help",
    description: "Get help!",
    exe(message, args, handler) {
        if (!args.length) {
            //            \`\`\`ml
            //*'Command' "List"\`\`\`
            message.channel.send(`
Use \`-help [command]\` to get more information on a command.

**1. Information -** \`help\`, \`game\`, \`tutorial\`, \`invite\`, \`gamemode\`, \`wordlists\`
**2. Game -**  \`clue\`, \`guess\`, \`endturn\`
**3. Lobby -**  \`configure\`, \`join\`, \`leave\`, \`spymaster\`, \`start\`, \`stop\`, \`rng\`, \`givemaster\`

**Please message arrendek with any issues. Github: https://github.com/arrendek/codenames-bot/.**
**This Codenames Discord bot is a fork of GoogleFeud's bot from here: https://github.com/GoogleFeud/codenames-bot/.**
**If you see missing words on the board, you'll have to do \`-end\` and then \`-configure\` again!**
`)
        } else {
            const command = handler.findCommand(args[0]);
            if (!command) return message.channel.send("**✖ | This command doesn't exist!**");
            let restrictions = '';
            const embed = new MessageEmbed();
            embed.setAuthor(message.author.username, message.author.displayAvatarURL());
            embed.setTitle(command.name);
            embed.setColor("RANDOM");
            embed.setDescription(command.description);
            if (command.usage) embed.addField("Usage", command.usage);
            if (command.aliases) embed.addField("Aliases", command.aliases);
            if (command.permissions) {
                if (Util.perm(command.permissions, Util.permissions.requiresGame)) restrictions += '- A game needs to be configured on this channel\n';
                if (Util.perm(command.permissions, Util.permissions.requiresTurn)) restrictions += '- It must be your team\'s turn\n';
                if (Util.perm(command.permissions, Util.permissions.requiresSpymaster)) restrictions += '- You must be the spymaster\n'
                if (Util.perm(command.permissions, Util.permissions.requiresGameMaster)) restrictions += '- You must be the game master\n'
                embed.addField("Restrictions", restrictions);
            }
            message.channel.send(embed);
        }
    }
}