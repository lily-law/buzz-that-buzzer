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
    this.offset = 0;
    this.avarageDelay = 0;
}
Player.prototype.join = function(name) {
    this.name = name;
    this.socket.join(this.session.title, () => {
        this.socket.emit('joined', this.id);
        this.socket.on('sync', userTime => {
            const start = this.session.syncStart;
            this.session.syncCount++;
            if (start) {
                const recieved = Date.now();
                this.avarageDelay = (recieved - start)/2;
                this.offset = (start+this.avarageDelay) - (userTime-this.avarageDelay);
            }
        })
        this.session.nsp.emit('players', this.session.getPlayers());
        this.socket.on('buzz', time => {
            if (!this.buzzed) {
                this.buzzed = time+this.offset;
                this.session.buzz();
                this.session.nsp.emit('players', this.session.getPlayers());
            }
        })
    });
}

module.exports = Player;