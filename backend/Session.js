const {v4: uuidv4} = require("uuid");
const Player = require('./Player');

function Session(title, io) {
    this.title = title;
    this.players = {};
    this.id = uuidv4();
    this.nspToken = uuidv4();
    this.nsp = io.of('/'+this.nspToken);
    this.nsp.on('connection', (socket) => {
        socket.emit('players', this.getPlayers());
        this.players[socket.id] = new Player(socket, this);
        socket.on('disconnect', () => {
            delete this.players[socket.id];
            this.nsp.emit('players', this.getPlayers());
        });
    });
    this.buzzTimeout = null;
}
Session.prototype.getPlayers = function() {
    return Object.values(this.players).map(({name, id, buzzed}) => ({name, id, buzzed}));
}
Session.prototype.buzz = function() {
    if (!this.buzzTimeout) {
        this.buzzTimeout = setTimeout(() => {
            const winner = Object.values(this.players).filter(p => p.buzzed).sort((a, b) => a.buzzed - b.buzzed);
            winner.length > 0 && this.nsp.emit('winner', winner[0].id);
            Object.values(this.players).forEach(p => p.buzzed = null);
            setTimeout(() => {
                this.buzzTimeout = null;
                this.nsp.emit('winner', '');
            }, 2000);
        }, 1000);
    }
}

module.exports = Session;