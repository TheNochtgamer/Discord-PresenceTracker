const Discord = require('discord.js');
const Colors = require('colors');
const config = require('./config.json');

class Player {
    id = '';
    game = '';
    online = false;
    //
    actualTicksEnd = config.limitMinTicksToEnd * 60;
    actualTicksErased = config.limitMinTicksToErased * 60;
    //

    /**
     * @param {String} userId 
     * @param {Discord.User} user 
     * @param {String} game 
     */
    constructor(userId, user, game) {
        this.id = userId;
        this.user = user;
        this.game = game;
        this.goOnline();
        this.ticker(config.tickerTick * 1000);
    }

    /**
     * @param {Boolean} erased 
     */
    async end(erased) {
        trackedPlayers.forEach((playerx, index) => {
            if (playerx.id == this.id && playerx.game == this.game) {
                trackedPlayers.splice(index, 1);
            }
        });
        clearInterval(this.intervalId);
        if (erased) {
            console.log('Limite borrado'.bgWhite.green + ' | ' + 'user:'.bgWhite.green, this.user.tag, 'game:'.bgWhite.green, this.game);
            return;
        }
        console.log('Limite superado'.bgWhite.red + ' | ' + 'user:'.bgWhite.red, this.user.tag, 'game:'.bgWhite.red, this.game);
        //
        //Si queres que al finalizar el contador banee al usuario, descomentar lo siguiente:
        // let member = await this.user.client.guilds.cache.get(config.guildID).members.fetch(this.id);
        // try {
        //     await member.ban({ reason: `Jugo al ${this.game} por mucho tiempo` });
        //     console.log(`El miembro ${this.user.tag.magenta} a sido baneado.`);
        // } catch (error) {
        //     console.log(`No se pudo banear al miembro ${this.user.tag.magenta}:`, error);
        // }



        //
    }

    goOnline() {
        console.log(Colors.green(`${this.user.tag} [${this.id}] empezo a jugar ${this.game} || t:${this.actualTicksEnd} - t1: ${this.actualTicksErased}`));
        this.online = true;
        this.actualTicksErased = config.limitMinTicksToErased * 60;
    }
    goOffline() {
        console.log(Colors.red(`${this.user.tag} [${this.id}] dejo de jugar ${this.game} || t:${this.actualTicksEnd} - t1: ${this.actualTicksErased}`));
        this.online = false;
    }


    ticker(interval) {
        this.intervalId = setInterval(async () => {
            if (this.actualTicksEnd <= 0) {
                this.end(false);
                return;
            } else if (this.actualTicksErased <= 0) {
                this.end(true);
                return;
            }

            if (this.online) {
                this.actualTicksEnd -= config.tickerTick;
            } else {
                this.actualTicksErased -= config.tickerTick;
            }
        }, interval);
    }
}

module.exports = { Player: Player };