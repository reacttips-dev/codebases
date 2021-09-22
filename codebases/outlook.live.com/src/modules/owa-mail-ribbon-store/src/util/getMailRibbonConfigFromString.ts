import { getDefaultConfig } from './defaultConfig';
import type { MailRibbonConfigStore } from '../store/schema/mailRibbonConfigStore';

export function getMailRibbonConfigFromString(actionsString: string): MailRibbonConfigStore {
    return getDefaultConfig();
    /*
     * WIP (ADO119406): This is where, if the user doesn't have any saved preferences,
     * the default preferences will be returned, otherwise the user's
     * preferences will be parsed
     *
     */
}
