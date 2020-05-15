const Session = require('./Session');

const sessions = {};

function newSession(title, io) {
    const session = new Session(title, io);
    const id = session.id;
    sessions[id] = session;
    return id
}

async function requestNSP(sessionId) {
    if (!sessions[sessionId]) {
        return false
    }
    return sessions[sessionId].nspToken
}

module.exports = {newSession, requestNSP};