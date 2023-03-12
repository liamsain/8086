import { MovTypes } from './consts/consts.js';
import { movRegMemToFromRegMem, movImmedToReg } from './mov.js';
export function getInstructionsFromBuffer(buf) {
  let currentIns = null;
  const instructions = [];

  for (const insByte of buf) {
    const currentByte = insByte.toString(2).padStart(8, '0');
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