function randomHexColour(darkest = "0000AA", lightest = "FF0000") {
    const randomN = getRandomInt(parseInt(darkest, 16), parseInt(lightest, 16));
    const hexValue = randomN.toString(16);
    const colourValue = "0".repeat(6 - hexValue.length)+hexValue;
    return "#"+colourValue
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = randomHexColour;