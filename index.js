import { MovTypes, RegLookup } from './consts/consts.js';
import { movImmedToReg } from './mov.js';
import fs from 'fs';

const fileName = process.argv[2];
if (!fileName) {
  console.error('Please supply a file');
}
const buf = fs.readFileSync(fileName);
const instructionsInBuffer = getInstructionsFromBuffer(buf);
instructionsInBuffer.forEach(ins => console.log(ins));


function getInstructionsFromBuffer(buf) {
  let currentIns = null;
  const instructions = ['bits 16'];

  for (const insByte of buf) {
    const currentByte = insByte.toString(2).padStart(8, '0');
    // console.log(currentByte);
    if (currentIns) {
      currentIns.pushByte(currentByte);
      if (currentIns.insComplete()) {
        instructions.push(currentIns.getIns());
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
  return instructions;
}

export function movRegMemToFromRegMem(b) {
  const bytes = [b];
  function getIns() {
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
  return { getIns, insComplete, pushByte };
}