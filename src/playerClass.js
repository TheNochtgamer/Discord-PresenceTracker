const Discord = require('discord.js');
const Colors = require('colors');
const config = require('./config.json');

const barra = ' ' + '|'.white + ' ';
const barra2 = ' ' + '||'.white + ' ';

class Player {
    //
    defaultTicksEnd = config.limitMinTicksEnd * 60;
    defaultTicksErase = config.limitMinTicksErase * 60;
    actualTicksEnd = this.defaultTicksEnd;
    actualTicksErase = this.defaultTicksErase;
    //

    /**
     * @param {Discord.GuildMember} member 
     * @param {String} game 
     */
    constructor(member, game) {
        if (!member) return;
        this.member = member;
        this.game = game;
        this._game = ('"' + game + '"').reset;
        this.user = member.user;
        this.id = member.id;
        this.online = false;
        this.goOnline();
        this.#ticker(config.checkEverySeconds * 1000);
    }

    /**
     * @param {Boolean} erased 
     */
    async end(erased) {
        // trackedPlayers.forEach((playerx, index) => {
        //     if (playerx.id == this.id && playerx.game == this.game) {
        //         trackedPlayers.splice(index, 1);
        //     }
        // });
        let myIndex = trackedUsers.findIndex(player => player.isMe(this));
        if (myIndex > -1) trackedUsers.splice(myIndex, 1);

        clearInterval(this.interval);
        
        if (erased) {
            console.log('Limite borrado'.green + barra + 'user:'.green + ` [${this.user.id}] ${this.user.tag}` + barra + 'game:'.green, this._game);
            return;
        }
        this.member._tracked = config.limitPerUser;
        console.log('Limite superado'.red + barra + 'user:'.red + ` [${this.user.id}] ${this.user.tag}` + barra + 'game:'.red, this._game);
        require('./runMe')(this);
    }

    goOnline() {
        if (!this.online) console.log(Colors.red(`[${this.id}] ${this.user.tag} empezo a jugar ${this._game}${barra2}ts: ${this.actualTicksEnd}t - td: ${this.actualTicksErase}t`));
        this.online = true;
        this.actualTicksErase = this.defaultTicksErase;
    }
    goOffline() {
        if (this.online) console.log(Colors.green(`[${this.id}] ${this.user.tag} dejo de jugar ${this._game}${barra2}ts: ${this.actualTicksEnd}t - td: ${this.actualTicksErase}t`));
        this.online = false;
    }

    isMe(searchPlayer) {
        return searchPlayer?.id == this.id && searchPlayer?.game == this.game;
    }

    #ticker(interval) {
        this.interval = setInterval(async () => {
            if (this.actualTicksEnd <= 0) {
                this.end(false);
                return;
            } else if (this.actualTicksErase <= 0) {
                this.end(true);
                return;
            } else if (this.actualTicksEnd == (this.defaultTicksEnd / 100 * (config.alertPercent > 0 ? config.alertPercent : 101))) {
                console.log(Colors.red(`[${this.id}] ${this.user.tag} esta a punto de superar el limite de ${this._game}${barra2}ts: ${this.actualTicksEnd}t - td: ${this.actualTicksErase}t`));
            }

            if (this.online) {
                this.actualTicksEnd -= config.checkEverySeconds;
            } else {
                this.actualTicksErase -= config.checkEverySeconds;
            }
        }, interval);
    }
}

module.exports = Player;