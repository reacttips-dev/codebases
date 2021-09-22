import store from '../store/store';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';

export default function isBusiness(): boolean {
    return (
        !!store.userConfiguration?.SessionSettings &&
        store.userConfiguration.SessionSettings.WebSessionType == WebSessionType.Business
    );
}
