import store from '../store/store';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import getUserConfigurationForUser from '../selectors/getUserConfigurationForUser';
/***
 * Function that checks whether the primary account of logged in user represents a consumer account
 */
export default function isConsumer(smtpAddress?: string): boolean {
    const userConfiguration = smtpAddress
        ? getUserConfigurationForUser(smtpAddress)
        : store.userConfiguration;
    return (
        !!userConfiguration?.SessionSettings &&
        userConfiguration.SessionSettings.WebSessionType !== WebSessionType.Business
    );
}
