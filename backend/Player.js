const {v4: uuidv4} = require("uuid");

function Player(socket, session) {
    this.socket = socket;
    this.session = session;
    this.id = uuidv4();
    this.name = '';
    this.socket.on('join', user => {
        this.join(user);
    });
    this.buzzed = null;
}
Player.prototype.join = function(name) {
    this.name = name;
    this.socket.join(this.session.title, () => {
        this.socket.emit('joined', this.session.title);
        this.session.nsp.emit('players', this.session.getPlayers());
        this.socket.on('buzz', time => {
            this.buzzed = time;
            this.session.buzz();
            this.session.nsp.emit('players', this.session.getPlayers());
        })
    });
}

module.exports = Player;