import { acceptLgpdOptIn, manageLgpdAdsOptions } from '../actions/internalActions';
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
    explanation_lgpd_Text,
    privacyStatement_lgpd_Text,
    manage_lgpd_0_button,
    manage_lgpd_1_button,
    manage_lgpd_2_button,
    accept_lgpd_0_button,
    accept_lgpd_1_button,
    accept_lgpd_2_button,
    accept_lgpd_3_button,
    accept_lgpd_4_button,
} from './TargetedAdsLgpdPrompt.locstring.json';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './TargetedAdsLgpdPrompt.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export default function TargetedLgpdAdsPrompt() {
    const lid: LightningId = LightningId.LgpdAds;
    return <LightableTargetedAdsPrompt lid={lid} when={lightUpTargetedAdsPrompt} />;
}

const LightableTargetedAdsPrompt = lightable(
    observer(function LightableTargetedAdsPrompt(props: LightningProps) {
        const manageStrings = [
            loc(manage_lgpd_0_button),
            loc(manage_lgpd_1_button),
            loc(manage_lgpd_1_button),
            loc(manage_lgpd_1_button),
            loc(manage_lgpd_1_button),
            loc(manage_lgpd_2_button),
            loc(manage_lgpd_2_button),
            loc(manage_lgpd_2_button),
            loc(manage_lgpd_2_button),
        ];

        const acceptStrings = [
            loc(accept_lgpd_0_button),
            loc(accept_lgpd_1_button),
            loc(accept_lgpd_2_button),
            loc(accept_lgpd_3_button),
            loc(accept_lgpd_4_button),
            loc(accept_lgpd_1_button),
            loc(accept_lgpd_2_button),
            loc(accept_lgpd_3_button),
            loc(accept_lgpd_4_button),
        ];

        // 0 is the control string. There will be a same string in the experiment strings
        // We have to keep a duplicate string as we cannot graduate the control string as the winner
        let buttonStringVersion = 0;

        if (isFeatureEnabled('adsexp-Lgpd-buttonstring-0')) {
            buttonStringVersion = 0;
        } else if (isFeatureEnabled('adsexp-Lgpd-buttonstring-1')) {
            buttonStringVersion = 1;
        } else if (isFeatureEnabled('adsexp-Lgpd-buttonstring-2')) {
            buttonStringVersion = 2;
        } else if (isFeatureEnabled('adsexp-Lgpd-buttonstring-3')) {
            buttonStringVersion = 3;
        } else if (isFeatureEnabled('adsexp-Lgpd-buttonstring-4')) {
            buttonStringVersion = 4;
        } else if (isFeatureEnabled('adsexp-Lgpd-buttonstring-5')) {
            buttonStringVersion = 5;
        } else if (isFeatureEnabled('adsexp-Lgpd-buttonstring-6')) {
            buttonStringVersion = 6;
        } else if (isFeatureEnabled('adsexp-Lgpd-buttonstring-7')) {
            buttonStringVersion = 7;
        } else if (isFeatureEnabled('adsexp-Lgpd-buttonstring-8')) {
            buttonStringVersion = 8;
        }

        const onManageButtonClicked = () => {
            lighted(props.lid);
            manageLgpdAdsOptions();
            logUsage('lgpdAdsManageClick' + buttonStringVersion, {}, { isCore: true });
        };

        const onAcceptClicked = () => {
            lighted(props.lid);
            acceptLgpdOptIn();
            logUsage('lgpdAdsAcceptClick' + buttonStringVersion, {}, { isCore: true });
        };

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
                                {loc(explanation_lgpd_Text)}{' '}
                                <Link href={privacyStatementUrl} target="_blank">
                                    {loc(privacyStatement_lgpd_Text)}
                                </Link>
                            </div>
                        </div>
                        <DialogFooter className={styles.dialogFooter}>
                            <DefaultButton
                                className={manageButtonClass}
                                onClick={onManageButtonClicked}
                                text={manageStrings[buttonStringVersion]}
                            />
                            <PrimaryButton
                                className={acceptButtonClass}
                                onClick={onAcceptClicked}
                                text={acceptStrings[buttonStringVersion]}
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
