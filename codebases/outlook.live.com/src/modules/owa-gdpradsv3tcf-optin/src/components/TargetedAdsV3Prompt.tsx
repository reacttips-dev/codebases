import { acceptTargetedAds, manageAdsOptions } from '../actions/internalActions';
import shouldPrompt from '../selectors/shouldPrompt';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { DialogFooter } from '@fluentui/react/lib/Dialog';
import { Link } from '@fluentui/react/lib/Link';
import { Modal } from '@fluentui/react/lib/Modal';
import { observer } from 'mobx-react-lite';
import { logUsage } from 'owa-analytics';
import { getCdnUrl } from 'owa-config';
import { lightable, lighted, LightningId, LightningProps } from 'owa-lightning-v2';
import loc from 'owa-localize';
import * as React from 'react';
import {
    explanation_adv3_new_Text,
    privacyStatement_adv3_Text,
    seeVendors_adv3_Text,
    accept_adv3_6_button,
    manage_gdpreprivacy_10_button,
} from './TargetedAdsPrompt.locstring.json';

import styles from './TargetedAdsPrompt.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export default function TargetedAdsV3Prompt() {
    const lid: LightningId = LightningId.GdprAdsV3ClearNull;
    return <LightableTargetedAdsPrompt lid={lid} when={lightUpTargetedAdsPrompt} />;
}

const LightableTargetedAdsPrompt = lightable(
    observer(function LightableTargetedAdsPrompt(props: LightningProps) {
        const onSeeVendorButtonClicked = () => {
            lighted(props.lid);
            manageAdsOptions(true);
            logUsage(
                'gdprAdV3TcfPromptSeeVendorClickE0',
                {},
                {
                    isCore: true,
                }
            );
        };

        const onManageButtonClicked = () => {
            lighted(props.lid);
            manageAdsOptions(false);
            logUsage('gdprAdV3TcfPromptManageClickE10', {}, { isCore: true });
        };

        const onAcceptClicked = () => {
            lighted(props.lid);
            acceptTargetedAds();
            logUsage('gdprAdV3TcfPromptAcceptClickE10', {}, { isCore: true });
        };

        const seeVendorButtonClass = classNames(
            styles.linkButton,
            styles.maxWidthButton,
            'displayNone'
        );

        const manageButtonClass = classNames(
            styles.maxWidthButton,
            styles.linkButton,
            styles.posManageButtonExp
        );

        const acceptButtonClass = classNames(styles.maxWidthButton);

        const imageUrl = `https:${getCdnUrl()}assets/mail/pwa/v1/svgs/Outlook_64x.svg`;
        const privacyStatementUrl = 'https://privacy.microsoft.com/privacystatement';

        return (
            <Modal isOpen={true}>
                <div className={styles.content}>
                    <div className={styles.imageWrapper}>
                        <img className={styles.image} src={imageUrl} />
                    </div>
                    <div className={styles.textAndButtons}>
                        <div className={styles.textSection}>
                            <div>
                                {loc(explanation_adv3_new_Text)}{' '}
                                <Link href={privacyStatementUrl} target="_blank">
                                    {loc(privacyStatement_adv3_Text)}
                                </Link>
                            </div>
                        </div>
                        <DialogFooter className={styles.dialogFooter}>
                            <DefaultButton
                                className={seeVendorButtonClass}
                                onClick={onSeeVendorButtonClicked}
                                text={loc(seeVendors_adv3_Text)}
                            />
                            <DefaultButton
                                className={manageButtonClass}
                                onClick={onManageButtonClicked}
                                text={loc(manage_gdpreprivacy_10_button)}
                            />
                            <PrimaryButton
                                className={acceptButtonClass}
                                onClick={onAcceptClicked}
                                text={loc(accept_adv3_6_button)}
                            />
                        </DialogFooter>
                    </div>
                </div>
            </Modal>
        );
    })
);

async function lightUpTargetedAdsPrompt(lightUp: () => void) {
    if (await shouldPrompt()) {
        lightUp();
    }
}
