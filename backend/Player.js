const {v4: uuidv4} = require("uuid");
const randomHexColour = require("./randomHexColour");

function Player(socket, session) {
    this.socket = socket;
    this.session = session;
    this.socket.on('join', userData => {
        this.join(userData);
    });
    this.offset = 0;
    this.userData = {
        id: uuidv4(),
        buzzed: null
    };
}
Player.prototype.join = function({name, colour}) {
    this.userData.name = name;
    this.userData.colour = colour || randomHexColour();
    this.socket.join(this.session.title, () => {
        this.socket.emit('joined', this.userData.id);
        this.socket.on('sync', (userTime) => {
            const start = this.session.syncStart;
            if (start) {
                const recieved = Date.now();
                const userToServerDiff = recieved - userTime; // add this to server time
                const averageDelay = Math.round((recieved - start)/2);
                this.offset = userToServerDiff - averageDelay;
                this.session.syncCount++;
            }
        });
        this.session.nsp.emit('players', this.session.getPlayers());
        this.socket.on('buzz', time => {
            if (!this.userData.buzzed) {
                this.userData.buzzed = time;
                this.session.buzz();
            }
        });
        this.socket.on('updateUserData', data => {
            const newData = data;
            delete newData.buzzed;
            this.userData = {...this.userData, ...data};
            this.session.nsp.emit('players', this.session.getPlayers());
        });
    });
}

module.exports = Player;
