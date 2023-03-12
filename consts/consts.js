export const RegLookup = {
  '000': { W0: 'al', W1: 'ax' },
  '001': { W0: 'cl', W1: 'cx' },
  '010': { W0: 'dl', W1: 'dx' },
  '011': { W0: 'bl', W1: 'bx' },
  '100': { W0: 'ah', W1: 'sp' },
  '101': { W0: 'ch', W1: 'bp' },
  '110': { W0: 'dh', W1: 'si' },
  '111': { W0: 'bh', W1: 'di' }
};

// the key is r/m:
export const AddressCalcLookup = {
  '000': 'bx + si',
  '001': 'bx + di',
  '010': 'bp + si',
  '011': 'bp + di',
  '100': 'si',
  '101': 'di',
  '110': 'bp',
  '111': 'bx',
};
export const MovTypes = {
  RegMemToFromRegMem: '100010',
  ImmedToReg: '1011',
};
export const ArithmeticTypes = {
  Add: ['000000', '100000', '0000010'],
  Sub: ['001010', '100000', '0010110']
};

