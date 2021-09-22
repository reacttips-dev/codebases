import Q from 'q';
import API from 'js/lib/api';

const programSwitcherSelectionsAPI = API('/api/programSwitcherSelections.v1', {
  type: 'rest',
});

export const selectProgramHomepage = (userId: string, selectionType: string, programId?: string, degreeId?: string) => {
  const request = Object.assign({ selectionType }, programId && { programId }, degreeId && { degreeId });

  return Q(programSwitcherSelectionsAPI.put(String(userId), { data: request }));
};
