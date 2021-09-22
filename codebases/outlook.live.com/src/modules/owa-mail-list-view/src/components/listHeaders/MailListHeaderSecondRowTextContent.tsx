import * as React from 'react';
import { ToggleFavoriteButton } from 'owa-favorites';
import { getDensityModeString } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './MailListHeaderSecondRow.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailListHeaderSecondRowTextContentProps {
    text: string;
    containerCssClass?: string;
    showFavoriteToggle?: boolean;
    onFavoriteToggleClick?: (evt: React.MouseEvent<unknown>) => void;
    isInFavorites?: boolean;
}

export default function MailListHeaderSecondRowTextContent(
    props: MailListHeaderSecondRowTextContentProps
) {
    return (
        <div
            className={classNames(styles.customTextContainer, props.containerCssClass)}
            role="heading"
            aria-level={2}>
            <span
                className={classNames(
                    styles.customHeaderText,
                    props.showFavoriteToggle && styles.customHeaderTextWithFavorite,
                    isFeatureEnabled('mon-densities') && getDensityModeString()
                )}>
                {props.text}
            </span>
            {props.showFavoriteToggle && (
                <ToggleFavoriteButton
                    isInFavorites={props.isInFavorites}
                    onClick={props.onFavoriteToggleClick}
                    tooltipStyles={styles.toggleFavoriteTooltip}
                />
            )}
        </div>
    );
}
