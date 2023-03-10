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

// the key is r/m
export const AddressCalcLookup = {
  '000' : {Mod00: 'bx + si'},
  '001' : {Mod00: 'bx + di'},
  '010' : {Mod00: 'bp + si'},
  '011' : {Mod00: 'bp + di'},
  '100' : {Mod00: 'si'},
  '101' : {Mod00: 'di'},
  '110' : {Mod00: 'direct displacement'},
  '111' : {Mod00: 'bx'},
};