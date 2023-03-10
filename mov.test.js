import assert from 'assert';
// import { movImmedToReg } from './index.js';
import { movImmedToReg } from './mov.js';

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
describe('movImmedToReg', function () {
  it('should return correct instructions from binary', function () {
    const tests = [
      {
        bytes: ['10110001', '00001100'],
        expected: 'mov cl, 12'
      }
    ];
    tests.forEach(t => {
      const insObj = movImmedToReg(t.bytes[0]);
      t.bytes.slice(1).forEach(b => { insObj.pushByte(b) });
      assert.equal(insObj.insComplete(), true);
      assert.equal(insObj.getIns(), t.expected);
    });
  });
});