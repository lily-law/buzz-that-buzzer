const {v4: uuidv4} = require("uuid");
const Player = require('./Player');

function Session(title, io) {
    this.title = title;
    this.players = {};
    this.id = uuidv4();
    this.nspToken = uuidv4();
    this.nsp = io.of('/'+this.nspToken);
    this.buzzTimeout = null;
    this.syncStart = null;
    this.syncCount = 0;
    this.nsp.on('connection', (socket) => {
        socket.emit('players', this.getPlayers());
        this.players[socket.id] = new Player(socket, this);
        socket.on('disconnect', () => {
            delete this.players[socket.id];
            this.nsp.emit('players', this.getPlayers());
            this.dieIfInactive();
        });
        socket.on('sync', () => {
            console.log(this.syncCount)
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
    setTimeout(this.dieIfInactive, 1000*60*5);
    this.dieIfInactive = this.dieIfInactive.bind(this);
}
Session.prototype.getPlayers = function() {
    return Object.values(this.players).map(({name, id, buzzed}) => ({name, id, buzzed}));
}
Session.prototype.buzz = function() {
    console.log(Math.max(...Object.values(this.players).map(p => p.avarageDelay)));
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
    this.getPlayers().length <= 0 && this.killSelf();
}

module.exports = Session;