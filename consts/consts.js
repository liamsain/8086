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
export const MovTypes = {
  RegMemToFromRegMem: '100010',
  ImmedToReg: '1011'
};