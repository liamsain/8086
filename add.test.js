import assert from 'assert';
import { getInstructionsFromBuffer } from './decoder.js';

describe('arithmetic adds', function () {
  it('returns correct instructions for binary add instructions', function () {
    const tests = [
      {
        hex: '0318',
        ex: ['add bx, [bx + si]']
      },
      {
        hex: '035e00',
        ex: ['add bx, [bp]']
      }
    ];
    tests.forEach(t => {
      const buffer = Buffer.from(t.hex, 'hex');
      const instructions = getInstructionsFromBuffer(buffer);
      t.ex.forEach((ins, insI) => assert.equal(instructions[insI], ins));
    });

  })
});