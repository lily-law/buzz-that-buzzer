const Session = require('./Session');

const sessions = {};

function newSession(title, io) {
    const session = new Session(title, io);
    const id = session.id;
    session.killSelf = () => {
        delete sessions[id];
    } 
    sessions[id] = session;
    return id
}

function requestNSP(socket, sessionId, io) {
    let nsp = false;
    if (sessions[sessionId]) {
        nsp = {token: sessions[sessionId].nspToken, title: sessions[sessionId].title};
    }
    socket.emit('nsp', nsp);
}

module.exports = {newSession, requestNSP};