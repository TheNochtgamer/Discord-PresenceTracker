const Discord = require('discord.js');
const Colors = require('colors');
require('dotenv').config();
const Player = require('./playerClass.js');

let config = require('./config.json');
globalThis.trackedUsers = [new Player()];
globalThis.mostPlayed = [];
globalThis.updateConfig = () => {
    delete require.cache[require.resolve('./config.json')];
    config = require('./config.json');
    return config;
};
function intoRaw(str = '') {
    return str.toLowerCase().replace(/ /g, '');
}

const client = new Discord.Client({
    intents: [
        'Guilds',
        'GuildMembers',
        'GuildPresences'
    ],
    partials: ['USER'],
    // presence: { 'status': 'invisible' }
});

client.on('presenceUpdate', async (oldPres, newPres) => {
    if (newPres.guild?.id !== config.guildID || !newPres.guild || config.mode) return;

    let hasRole = newPres.member.roles.cache.some(role => config.filteredRoles.includes(role.id));
    if ((!hasRole && config.whiteListMode)
        || (hasRole && !config.whiteListMode)
        || newPres.member._tracked) return;

    // let hasAct1 = newPres.activities?.find(act => config.trackGames.includes(act.name.toLowerCase()));
    // let hasAct2 = oldPres?.activities?.find(act => config.trackGames.includes(act.name.toLowerCase()));
    let hasActNew = newPres.activities?.find(act => config.trackGames
        .some(tg => tg && intoRaw(act.name).includes(intoRaw(tg))));
    let hasActOld = oldPres?.activities?.find(act => config.trackGames
        .some(tg => tg && intoRaw(act.name).includes(intoRaw(tg))));

    let thisPlayer = trackedUsers.find(player => player
        .isMe({ id: newPres.userId, game: (hasActNew ? hasActNew.name : hasActOld?.name) }));
    if (hasActNew) {
        if (!thisPlayer) {
            let player = new Player(newPres.member, hasActNew.name);
            trackedUsers.push(player);
            return;
        }
        thisPlayer.goOnline();
    } else if (!hasActNew && hasActOld) {
        if (thisPlayer) {
            thisPlayer.goOffline();
        }
    }
});

client.on('presenceUpdate', async (oldPres, newPres) => {
    // Game tracking mode
    // 'config.json' => mode: 1,
    // Escribi en la consola de depuracion "mostPlayed" para ver resultados
    if (newPres.user?.bot || !config.mode) return;

    oldPres?.activities?.map(act => {
        if (newPres.activities?.every(act2 => act.name == act2.name)) {
            let mp = mostPlayed.find(mp => mp.rawName == intoRaw(act.name));
            mp?._now?.delete(newPres.userId);
        }
    });

    if (!newPres.activities.length) return;

    newPres.activities.map(act => {
        let mp = mostPlayed.find(mp => mp.rawName == intoRaw(act.name));
        if (mp && (oldPres?.activities?.every(act2 => act.name == act2.name) || !oldPres)) {
            mp?._now?.set(newPres.userId, newPres.user.tag);
        } else if (!mp) {
            let thisId = mostPlayed.length + 1;
            console.log(Colors.green(`New game registered "${act.name.gray}" by ${'user:'.gray
                + ' ' + `[${newPres.userId}] ${newPres.user.tag}`.red} with id ${Colors.cyan(thisId)}`));
            mostPlayed.push({
                now: 1,
                count: 1,
                id: thisId,
                name: act.name,
                rawName: intoRaw(act.name),
                _now: new Map([
                    [newPres.userId, newPres.user.tag]
                ]),
            });
            return;
        };

        mp.count++;
        mp.now = mp._now.size;
    });

    mostPlayed.sort((a, b) => (b.now !== a.now
        ? b.now - a.now
        : (b.count !== a.count
            ? b.count - a.count
            : a.id - b.id)));
});

client.once('ready', async () => {
    trackedUsers.pop();
    console.log(`Bot online como ${client.user.tag}`);
    try {
        let guild = await client.guilds.fetch(config.guildID);
        console.log('Tracker activo en:', guild.name);
    } catch (error) {
        console.log(`Error, no se encontro el guild ${config.guildID}`);
        process.exit(1);
    }
});

client.login(process.env.TOKEN);