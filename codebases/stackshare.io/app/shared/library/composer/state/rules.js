import {STRUCTURE_FREEFORM, STRUCTURES} from '../constants';

export const passToolsCheck = (numTools, structure) => {
  if (structure === STRUCTURE_FREEFORM) {
    return true;
  }
  return Boolean(STRUCTURES.find(s => s.key === structure && numTools >= s.minToolLength));
};
