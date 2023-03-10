const fs = require('fs');
const fileName = process.argv[2];
if (!fileName) {
  console.error('Please supply a file');
  return;
}
const buf = fs.readFileSync(fileName);

const RegLookup = {
  '000': { W0: 'al', W1: 'ax' },
  '001': { W0: 'cl', W1: 'cx' },
  '010': { W0: 'dl', W1: 'dx' },
  '011': { W0: 'bl', W1: 'bx' },
  '100': { W0: 'ah', W1: 'sp' },
  '101': { W0: 'ch', W1: 'bp' },
  '110': { W0: 'dh', W1: 'si' },
  '111': { W0: 'bh', W1: 'di' }
};

const MovTypes = {
  RegMemToFromRegMem: '100010',
  ImmedToReg: '1011'
};

let currentIns = null;

console.log('bits 16\n');
for (const insByte of buf) {
  const currentByte = insByte.toString(2).padStart(8, '0');
  console.log(currentByte);
  if (currentIns) {
    currentIns.pushByte(currentByte);
    if (currentIns.insComplete()) {
      console.log(currentIns.printIns());
      currentIns = null;
    }
  } else {
    if (currentByte.startsWith(MovTypes.RegMemToFromRegMem)) {
      currentIns = movRegMemToFromRegMem(currentByte);
    } else if (currentByte.startsWith(MovTypes.ImmedToReg)) {
      currentIns = movImmedToReg(currentByte);
    }

  }
}

function movImmedToReg(b) {
  const bytes = [b];
  function printIns() {
    if (bytes.length < 2) {
      console.error('Cannot get instruction. Not enough bytes');
      return;
    }
    const firstByte = bytes[0];
    const wField = firstByte[4];
    const binData = wField == 1 ? `${bytes[2]}${bytes[1]}` : bytes[1];
    const reg = firstByte.slice(5);
    const dest = wField == 1 ? RegLookup[reg].W1 : RegLookup[reg].W0;
    return `mov ${dest}, ${wField == 1 ? binToInt16(binData) : binToInt8(binData)}`;
  }
  function insComplete() {
    if (bytes.length < 2) {
      return false;
    }

    const wField = bytes[0][4];
    if (wField == 0) {
      return true;
    }
    return bytes.length === 3;
  }
  function pushByte(b) { bytes.push(b) }

  return { printIns, insComplete, pushByte };
}

function movRegMemToFromRegMem(b) {
  const bytes = [b];
  function printIns() {
    const firstByte = bytes[0];
    const secondByte = bytes[1];
    if (!secondByte.length) {
      console.error('Cannot get instruction. Second byte not present');
      return;
    }
    const dField = firstByte[6]; // 1 = reg field in second byte is dest, 0= reg field in second byte is src
    const wField = firstByte[7]; // 0 = byte op, 1 = word op
    // Mode: 00=memory mode no displacement, 01=mem mode 8-bit displacement, 10=mem mode 16 bit displacement, 11=reg mode(no displacement)
    const mod = secondByte.slice(0, 2);
    const reg = secondByte.slice(2, 5);
    const rm = secondByte.slice(5); // register/memory. when mod=11, rm idents second reg 
    const firstReg = `${wField == 1 ? RegLookup[reg].W1 : RegLookup[reg].W0}`
    const secondReg = `${wField == 1 ? RegLookup[rm].W1 : RegLookup[rm].W0}`

    const dest = dField == 1 ? firstReg : secondReg;
    const src = dField == 1 ? secondReg : firstReg;
    return `mov ${dest}, ${src}`;
  }
  function insComplete() {
    const secondByte = bytes[1];

    if (!secondByte) {
      return false;
    }
    const mod = secondByte.slice(0, 2); // Mode. 00=memory mode no displacement, 01=mem mode 8-bit displacement, 10=mem mode 16 bit displacement, 11=reg mode(no displacement)
    return mod == '11'; // no displacement, so don't expect a third byte!
  }
  function pushByte(b) {
    bytes.push(b);
  }
  return { printIns, insComplete, pushByte };
}

function binToInt8(b) {
  let num = parseInt(b, 2);
  if (num > 127) { 
    num = num - 256 
  }
  return num;
}
function binToInt16(b) {
  let num = parseInt(b, 2);
  if (num > 32767) { 
    num = num - 65536
  }
  return num;
}