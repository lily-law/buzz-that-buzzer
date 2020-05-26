![U Buzz Tap](./client/src/images/logo.svg)

## Simple buzzer PWA for multiple remote players 

### Features
- Accounts for differences in clients connection speeds
    1. When client taps buzzer client device time is noted
    2. Sever ends round when it recieves a buzzed in time or ping response from all players 
    3. Server calculates win with time differences and connection delays
- Link sharing
    - Native navigator sharing in supported devices
    - Copy to clipboard on other devices
- Sessions auto revive using id and title from link

### Devolpment Info

#### Setup 
1. clone repo
2. `$ npm install`
3. `$ cd client/`
4. `$ npm install`

#### Run 
1. cd into root directory 
2. `$ npm run dev`

#### Dependancies
- [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- [express](http://expressjs.com/)
- [socket.io](https://socket.io/)
- [socket.io-client](https://www.npmjs.com/package/socket.io-client)
- [uuid](https://www.npmjs.com/package/uuid)
