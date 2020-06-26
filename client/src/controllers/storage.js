async function readFromStore(name) {
    const data = await localStorage.getItem(name);
    if (data) {
      return JSON.parse(data)
    }
    return null
  }
  
async function writeToStore(name, data) {
    try {
        const stored = await readFromStore(name);
        if (stored) { // append to store[name]
            const newData = Array.isArray(data) ? [...data, ...stored] : {...stored, ...data};
            await localStorage.setItem(name, JSON.stringify(newData));
        }
        else { // create store[name]
            await localStorage.setItem(name, JSON.stringify(data));
        }
        return true
    } 
    catch (e) {
        console.error(e);
    } 
}

async function replaceStore(name, data) {
    await localStorage.setItem(name, JSON.stringify(data));
    return true
}

export {readFromStore, writeToStore, replaceStore}