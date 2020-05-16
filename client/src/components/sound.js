const context = new AudioContext();

let oscillators;
let active = false;

const beep = () => {
    oscillators = [new Oscil("triangle", 300), new Oscil("sawtooth", 200), new Oscil("square", 400)];
    if (!active) {
        oscillators.forEach(o => o.oscillator.start(0));
        active = true;
    }
}
const stop = () => {
    if (active) {
        oscillators.forEach(o => o.oscillator.stop(0));
        active = false;
    }
}

module.exports = {beep, stop};

function Oscil(type, freq) {
    this.oscillator = context.createOscillator();
    this.oscillator.type = type;
    this.oscillator.frequency.value = freq;
    const gainNode = context.createGain();
    this.oscillator.connect(gainNode);
    gainNode.connect(context.destination);
}