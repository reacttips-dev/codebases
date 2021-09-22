import { gettingStartedStore, gettingStartedHistory } from 'store';
import createGettingStartedApi from 'api/gettingStarted';
import createSetupMethod from 'api/setup';

export const GettingStartedV2 = createGettingStartedApi(gettingStartedStore, gettingStartedHistory);
export const setup = createSetupMethod([gettingStartedStore]);
