import assert from 'assert';
import { getInstructionsFromBuffer } from './decoder.js';

describe('getInstructionsFromBuffer', function () {
  it('should return correct instructions from binary', function () {
    const tests = [
      {
        // reg to reg
        hex: '89de88c6',
        expected: ['mov si, bx', 'mov dh, al']
      },
      {
        // 8 bit immed to reg
        hex: 'b10cb5f4',
        expected: ['mov cl, 12', 'mov ch, -12']
      },
      {
        // 16 bit immed to reg
        hex: 'b90c00b9f4ffba6c0fba94f0', 
        expected: ['mov cx, 12', 'mov cx, -12', 'mov dx, 3948', 'mov dx, -3948']
      },
      {
        
      }
    ];
    tests.forEach(t => {
      const buffer = Buffer.from(t.hex, 'hex');
      const instructions = getInstructionsFromBuffer(buffer);
      t.expected.forEach((ins, insI) => assert.equal(instructions[insI], ins));
    });
  });
});