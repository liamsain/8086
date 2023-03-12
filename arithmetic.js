import { RegLookup, AddressCalcLookup } from './consts/consts.js';
import { binToInt16, binToInt8 } from './helpers.js';
const AddTypes = {
  RegMemWithRegToEither: '000000',
  ImmedToRegMem: '100000',
  ImmedToAccum: '0000010'
};
export function arithmetic(b) {
  const bytes = [b];
  function getIns() {
    const firstByte = bytes[0];
    const secondByte = bytes[1];
    if (!secondByte.length) {
      console.error('Cannot get instruction. Second byte not present');
      return `error getting instructions for bytes ${bytes}`;
    }

    // dField: 1 = reg field in second byte is dest, 0= reg field in second byte is src
    const dField = firstByte[6];

    // wField: // 0 = byte op, 1 = word op
    const wField = firstByte[7];

    /* 00=mem mode no displacement, 01=mem mode 8-bit displacement,
       10=mem mode 16 bit displacement, 11=reg mode(no displacement)
    */
    const mod = secondByte.slice(0, 2);
    const reg = secondByte.slice(2, 5);
    const rm = secondByte.slice(5); // register/memory. when mod=11, rm idents second reg 
    let firstReg = '';
    let secondReg = '';
    if (mod == '00') {
      firstReg = `${wField == 1 ? RegLookup[reg].W1 : RegLookup[reg].W0}`;
      secondReg = `[${AddressCalcLookup[rm]}]`;
    } else if (mod == '01') {
      firstReg = `${wField == 1 ? RegLookup[reg].W1 : RegLookup[reg].W0}`
      const displacement = binToInt8(bytes[2]);
      const displacementText = displacement === 0 ? '' : ` + ${displacement}`;
      secondReg = `[${AddressCalcLookup[rm]}${displacementText}]`;
    }
    const dest = dField == 1 ? firstReg : secondReg;
    const src = dField == 1 ? secondReg : firstReg;
    return `add ${dest}, ${src}`;
  }
  function insComplete() {
    if (bytes.length < 2) {
      return false;
    }
    const secondByte = bytes[1];
    const mod = secondByte.slice(0, 2);
    if (mod == '00') {
      true;
    }
    if (mod == '01') {
      return bytes.length == 3;
    }
    if (mod == '10') {
      return bytes.length == 4;
    }
    return true;

  }
  function pushByte(b) {
    bytes.push(b);
  }
  return { getIns, insComplete, pushByte };
}