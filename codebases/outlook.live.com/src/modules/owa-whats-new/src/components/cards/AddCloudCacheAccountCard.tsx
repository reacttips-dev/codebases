import {
    whatsNew_Card_AddCloudCacheAccount_Body,
    whatsNew_Card_TryIt_Button,
    whatsNew_Card_AddCloudCacheAccount_Title,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { logUsage } from 'owa-analytics';
import { logWhatsNewCardShown, logWhatsNewCardButtonClicked } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import {
    getModuleUrlForNewAccount,
    store as cloudCacheStore,
} from 'owa-cloud-cache-accounts-option';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import { ControlIcons } from 'owa-control-icons';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';

function onAddCloudCacheAccountClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();
    logUsage('addCloudCacheAccountClicked', null, { isCore: true });
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.AddCloudCacheAccount);

    window.open(getModuleUrlForNewAccount(WebSessionType.GMail), '_blank');
}

export const AddCloudCacheAccountCard = observer(function AddCloudCacheAccountCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.AddCloudCacheAccount);
    }, []);

    return (
        <>
            <div tabIndex={0}>{loc(whatsNew_Card_AddCloudCacheAccount_Body)}</div>
            <WhatsNewActionLink
                onClick={onAddCloudCacheAccountClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.AddCloudCacheAccount}
                whatsNewActionText={loc(whatsNew_Card_TryIt_Button)}
            />
        </>
    );
});

function addCloudCacheAccountCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.AddCloudCacheAccount,
        title: loc(whatsNew_Card_AddCloudCacheAccount_Title),
        iconName: ControlIcons.NewMail,
        body: <AddCloudCacheAccountCard />,
        isHidden: hasCloudCacheMailbox,
    };
}

function hasCloudCacheMailbox(): Promise<boolean> {
    return Promise.resolve(cloudCacheStore.cloudCacheConfigItem.emailAddress != null);
}

export default addCloudCacheAccountCardProps;
