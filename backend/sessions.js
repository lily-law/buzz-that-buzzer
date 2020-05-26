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
    return {token: nspToken, title}
}

function requestNSP(socket, nspToken, title, io) {
    let nsp = false;
    if (sessions[nspToken]) {
        nsp = {token: sessions[nspToken].nspToken, title: sessions[nspToken].title};
    }
    else {
        console.log('reviving: '+nspToken);
        nsp = newSession(title, io, nspToken);
    }
    if (sessions[nspToken]) {
        sessions[nspToken].entered.push(socket);
        sessions[nspToken].selfTimeOut = setTimeout(() => {
            sessions[nspToken] && sessions[nspToken].dieIfInactive();
        }, 1000*60*15);
    }
    socket.emit('nsp', nsp);
}

module.exports = {newSession, requestNSP};