const Discord = require('discord.js');
const Colors = require('colors');
const { Player } = require('./playerClass.js')
const config = require('./config.json');
globalThis.trackedPlayers = [];

const client = new Discord.Client({
    intents: [
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_PRESENCES',
    ],
    partials: ['USER']
});

client.on('presenceUpdate', async (oldPress, newPress) => {
    if (newPress.guild.id !== config.guildID) return;
    if (config.exceptRoles.length > 0) {
        let tieneRoles = 0;
        config.exceptRoles.forEach(exceptRol => {
            tieneRoles += newPress.member.roles.cache.some(role => role.id === exceptRol) ? 1 : 0;
        });
        if (config.whitelistMode && tieneRoles == 0) {
            return;
        } else if (!config.whitelistMode && tieneRoles > 0) {
            return;
        }
    }

    let test = newPress.activities?.find(nombre => config.trackGames.includes(nombre.name.toLowerCase()));
    let test2 = oldPress?.activities?.find(nombre => config.trackGames.includes(nombre.name.toLowerCase()));

    if (test && !test2) {
        //console.log('true on: '.magenta + newPress.user.tag)
        let estePlayer = trackedPlayers.find(playerx => playerx.id == newPress.userId && playerx.game == test.name);
        if (!estePlayer) {
            let player = new Player(newPress.userId, newPress.user, test.name);
            trackedPlayers.push(player);
            return;
        }

        estePlayer.goOnline();
    } else if (!test && test2) {
        //console.log('true offline: '.magenta + newPress.user.tag)
        let estePlayer = trackedPlayers.find(playerx => playerx.id == newPress.userId && playerx.game == test2.name);

        if (estePlayer) {
            estePlayer.goOffline();
        }
    }
});

client.once('ready', async () => {
    console.log('Online como', client.user.tag);
    try {
        let guild = await client.guilds.fetch(config.guildID);
        console.log('Tracker activo en:', guild.name);
    } catch (error) {
        console.log(`Error, no se encontro el discord ${config.guildID}`);
        process.exit(1);
    }
})

client.login(config.TOKEN);