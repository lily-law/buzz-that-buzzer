const Session = require('./Session');

const sessions = {};

function newSession(title, io, token) {
    const session = new Session(title, io, token);
    const nspToken = session.nspToken;
    session.killSelf = () => {
        console.log('removed: '+nspToken)
        delete sessions[nspToken];
    } 
    sessions[nspToken] = session;
    console.log(session.nspToken+' created!');
    return {nspToken, title}
}

function requestNSP(socket, nspToken, title, io) {
    let nsp = false;
    if (sessions[nspToken]) {
        nsp = {token: sessions[nspToken].nspToken, title: sessions[nspToken].title};
        if (sessions[nspToken].getPlayers().length <= 0) { // if there are players session will dieIfInactive when they disconnect
            sessions[nspToken].selfTimeOut = setTimeout(() => {
                sessions[nspToken].dieIfInactive();
                socket.disconnect();
            }, 1000*60*30);
        }
    }
    else {
        console.log('reviving: '+nspToken);
        nsp = newSession(title, io, nspToken).nspToken;
    }
    socket.emit('nsp', nsp);
}

module.exports = {newSession, requestNSP};