import NewNotification from 'owa-service/lib/contract/NewNotification';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default () =>
    !!(getUserConfiguration().UserOptions.NewItemNotify & NewNotification.EMailToast);
