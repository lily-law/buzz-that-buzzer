const {v4: uuidv4} = require("uuid");
const Player = require('./Player');

function Session(title, io, token) {
    this.title = title;
    this.players = {};
    this.entered = [];
    this.nspToken = token || uuidv4();
    this.nsp = io.of('/'+this.nspToken);
    this.buzzTimeout = null;
    this.syncStart = null;
    this.syncCount = 0;
    this.nsp.on('connection', (socket) => {
        socket.emit('players', this.getPlayers());
        this.players[socket.id] = new Player(socket, this);
        if (this.selfTimeOut) {
            clearTimeout(this.selfTimeOut);
        }
        socket.on('disconnect', () => {
            delete this.players[socket.id];
            const players = this.getPlayers();
            console.log(players.length);
            if (players.length > 0) {
                this.nsp.emit('players', players);
            }
            else {
                this.selfTimeOut = setTimeout(() => {
                    this.dieIfInactive();
                }, 1000*60*15);
            }
        });
        socket.on('sync', () => {
            if (this.syncCount >= Object.keys(this.players).length - 1) {
                const winner = Object.values(this.players).filter(p => p.buzzed).sort((a, b) => a.buzzed - b.buzzed);
                winner.length > 0 && this.nsp.emit('winner', winner[0].id);
                setTimeout(() => {
                    this.syncStart = null;
                    Object.values(this.players).forEach(p => {
                        p.buzzed = null;
                    });
                    this.buzzTimeout = null;
                    this.nsp.emit('winner', '');
                }, 2000);
            }
        });
    });
    this.dieIfInactive = this.dieIfInactive.bind(this);
    this.getPlayers = this.getPlayers.bind(this);
}
Session.prototype.getPlayers = function() {
    return Object.values(this.players).map(({name, id, buzzed}) => ({name, id, buzzed}));
}
Session.prototype.buzz = function() {
    if (!this.syncStart) {
        this.sync();
    }
}
Session.prototype.sync = function() {
    this.nsp.emit('sync', '');
    this.syncStart = Date.now();
    this.syncCount = 0;
    setTimeout(() => {
        this.syncStart = null;
    }, 10000)
}
Session.prototype.dieIfInactive = function() {
    console.log('Dying if no players...');
    if (this.nspToken && this.getPlayers().length <= 0) {
        this.entered.forEach(socket => socket && socket.disconnect());
        this.killSelf();
    }
}

module.exports = Session;