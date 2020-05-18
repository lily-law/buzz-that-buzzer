

let oscillators;
let active = false;
let release;

const beep = () => {
    const ctx = new AudioContext();
    oscillators = [new Oscil("triangle", 300, ctx), new Oscil("sawtooth", 200, ctx), new Oscil("square", 400, ctx)];
    if (!active) {
        oscillators.forEach(o => o.oscillator.start(0));
        window && window.navigator.vibrate(10000);
        active = true;
    }
    release = new Promise(resolve => {
        setTimeout(resolve, 500);
    });
}

const stop = async () => {
    if (release) {
        await release;
    }
    if (active) {
        release = null;
        oscillators.forEach(o => o.oscillator.stop(0));
        window && window.navigator.vibrate(0);
        active = false;
    }
}

module.exports = {beep, stop};

function Oscil(type, freq, context) {
    this.oscillator = context.createOscillator();
    this.oscillator.type = type;
    this.oscillator.frequency.value = freq;
    const gainNode = context.createGain();
    this.oscillator.connect(gainNode);
    gainNode.connect(context.destination);
}