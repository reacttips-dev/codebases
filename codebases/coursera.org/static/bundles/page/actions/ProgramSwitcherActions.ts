import { selectProgramHomepage as selectProgramHomepageUtil } from 'bundles/program-home/utils/ProgramSwitcherSelectionsAPIUtils';
import redirect from 'js/lib/coursera.redirect';

/* eslint-disable import/prefer-default-export */
export const selectProgramHomepage = (
  actionContext: $TSFixMe,
  { userId, selectionType, programId, degreeId, slug }: $TSFixMe
) => {
  selectProgramHomepageUtil(userId, selectionType, programId, degreeId)
    .then((response) => {
      actionContext.dispatch('SWITCHED_HOMEPAGE', { selectionType, programId });
      if (selectionType === 'PROGRAM' && slug) {
        redirect.setLocation('/programs/' + slug);
      } else if (selectionType === 'DEGREE' && slug) {
        redirect.setLocation('/degrees/' + slug + '/home/');
      } else {
        redirect.setLocation(slug || '/?skipBrowseRedirect=true');
      }
    })
    .done();
};
