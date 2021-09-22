import { coachmarksStore } from 'store';
import createCoachmarksApi from 'api/coachmarks';
import createSetupMethod from 'api/setup';

export const { Coachmark, clearCoachmarksQueue, suppressCoachmarks } = createCoachmarksApi(coachmarksStore);
export const setup = createSetupMethod([coachmarksStore]);
