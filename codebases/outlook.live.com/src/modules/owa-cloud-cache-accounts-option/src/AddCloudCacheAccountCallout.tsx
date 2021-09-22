import {
    AddButtonText,
    NotNowButtonText,
    FeaturePromotionCalloutTitle,
    FeaturePromotionCalloutDescription,
} from './AddCloudCacheAccountCallout.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { lightable, lighted, LightningId, LightningProps } from 'owa-lightning-v2';

import type { IImageProps } from '@fluentui/react/lib/Image';
import { IButtonProps, ButtonType } from '@fluentui/react/lib/Button';
import { TeachingBubble } from '@fluentui/react/lib/TeachingBubble';
import { getModuleUrlForNewAccount } from './utils/getModuleUrl';
import WebSessionType from 'owa-service/lib/contract/WebSessionType';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { getOwaResourceImageUrl } from 'owa-resource-url';
import { logUsage } from 'owa-analytics';

import styles from './AddCloudCacheAccountCallout.scss';

const GmailIcon = 'cloudCache/gmailIllustrations-01.svg';
const GmailIconDarkMode = 'cloudCache/gmailIllustrations-02.svg';

export interface AddCloudCacheAccountCalloutProps extends LightningProps {
    lid: LightningId;
    target: () => HTMLElement;
}

export default lightable(
    observer(function AddCloudCacheAccountCallout(props: AddCloudCacheAccountCalloutProps) {
        const addAccount = (enabled: boolean) => {
            logUsage('addCloudCacheAccountClickedFromCallout', null, { isCore: true });
            window.open(getModuleUrlForNewAccount(WebSessionType.GMail), '_blank');
            onClose(true);
        };

        const onClose = (enabled: boolean) => {
            lighted(props.lid, enabled ? 'Primary' : 'Secondary');
        };

        const hideTeachingBubble = () => {
            onClose(false);
        };

        let addAccountButtonProps: IButtonProps = {
            buttonType: ButtonType.primary,
            children: loc(AddButtonText),
            onClick: () => addAccount(true),
        };

        let notNowButtonProps: IButtonProps = {
            buttonType: ButtonType.primary,
            children: loc(NotNowButtonText),
            onClick: () => onClose(false),
        };

        let imageProps: IImageProps = {
            src: getOwaResourceImageUrl(getIsDarkTheme() ? GmailIconDarkMode : GmailIcon),
        };

        return (
            <TeachingBubble
                calloutProps={{
                    beakWidth: 15,
                    preventDismissOnLostFocus: true,
                    preventDismissOnScroll: true,
                    className: styles.teachingBubble,
                }}
                illustrationImage={imageProps}
                targetElement={props.target()}
                hasCloseIcon={true}
                onDismiss={hideTeachingBubble}
                hasSmallHeadline={true}
                isWide={true}
                headline={loc(FeaturePromotionCalloutTitle)}
                primaryButtonProps={addAccountButtonProps}
                secondaryButtonProps={notNowButtonProps}>
                {loc(FeaturePromotionCalloutDescription)}
            </TeachingBubble>
        );
    })
);
