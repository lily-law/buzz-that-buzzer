async function readFromStore(name) {
    const data = await localStorage.getItem(name);
    if (data) {
      return JSON.parse(data)
    }
    return null
  }
  
async function writeToStore(name, data) {
    const stored = await readFromStore(name);
    if (typeof data !== "object") {
        throw "writeToStore data must be of type Array or Object!"
    }
    if (stored) { // append to store[name]
        const newData = Array.isArray(data) ? [...data, ...stored] : {...data, ...stored};
        await localStorage.setItem(name, JSON.stringify(newData));
    }
    else { // create store[name]
        await localStorage.setItem(name, JSON.stringify(data));
    }
    return true
}

async function replaceStore(name, data) {
    await localStorage.setItem(name, JSON.stringify(data));
    return true
}

export {readFromStore, writeToStore, replaceStore}