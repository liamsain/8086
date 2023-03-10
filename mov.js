import { RegLookup } from './consts/consts.js';
import { binToInt16, binToInt8 } from './helpers.js';
export function movImmedToReg(b) {
  const bytes = [b];
  function getIns() {
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

  return { getIns, insComplete, pushByte };
}