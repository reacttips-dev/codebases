import multitracker from 'js/app/multitrackerSingleton';
import userJson from 'bundles/user-account/common/user';
import { UserData } from 'js/lib/user';

const SCHEMA = 'up.asset_admin';
// values below were the only ones seen, please extend as needed
type Actions = 'upload';
type StatusKey = 'failed';
type Data = { assetType: string | undefined };
type Callback = () => void;

const AssetAdminTracking = {
  track(action: Actions, key: StatusKey, data: Data, callback?: Callback) {
    const eventString = `${SCHEMA}.${action}.${key}`;
    const userDataJson = userJson as UserData; // userJson type is {} | UserData which causes issue with id accessor below

    /* eslint-disable-next-line camelcase */
    const newData = Object.assign({ user_id: userDataJson.id }, data);

    if (callback) {
      multitracker.pushV2([eventString, newData, callback]);
    } else {
      multitracker.pushV2([eventString, newData]);
    }
  },
};

export default AssetAdminTracking;

export const { track } = AssetAdminTracking;
