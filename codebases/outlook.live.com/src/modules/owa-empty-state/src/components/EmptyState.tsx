import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ActionButton, IButtonStyles } from '@fluentui/react/lib/Button';
import { FontWeights } from '@fluentui/style-utilities';
import { getPalette } from 'owa-theme';

import styles from './EmptyState.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface EmptyStateProps {
    icon: string;
    mainMessage: string;
    detailMessage?: string;
    ctaMessage?: string; // 'Call to action' text. Text for an action button below the detail message
    onCtaClick?: () => void;
    classNames?: {
        container?: string;
        mainMessage?: string;
        detailsMessage?: string;
        button?: string;
    };
    iconSize?: number;
}

const EmptyState = observer(function EmptyState(props: EmptyStateProps) {
    const { icon, mainMessage, detailMessage, ctaMessage, onCtaClick, iconSize } = props;

    const {
        container: containerClassName,
        mainMessage: mainMessageClassName,
        detailsMessage: detailsMessageClassName,
        button: buttonClassName,
    } = props.classNames || { container: null, mainMessage: null };
    const imgSize = iconSize || 120;

    return (
        <div className={classNames(styles.emptyStateContainer, containerClassName)}>
            {icon && <img style={{ width: imgSize, height: imgSize }} src={icon} alt="" />}
            {mainMessage && (
                <span className={classNames(styles.mainMessageText, mainMessageClassName)}>
                    {mainMessage}
                </span>
            )}
            {detailMessage && (
                <span className={classNames(styles.detailsMessageText, detailsMessageClassName)}>
                    {detailMessage}
                </span>
            )}
            {ctaMessage && onCtaClick && (
                <ActionButton
                    className={buttonClassName}
                    styles={getButtonStyles()}
                    onClick={onCtaClick}>
                    {ctaMessage}
                </ActionButton>
            )}
        </div>
    );
});
export default EmptyState;

function getButtonStyles(): IButtonStyles {
    let defaultPalette = getPalette();

    return {
        root: {
            color: defaultPalette.themeDarkAlt,
        },
        rootHovered: {
            color: defaultPalette.themeDark,
        },
        rootPressed: {
            color: defaultPalette.themeDarker,
        },
        label: {
            fontWeight: FontWeights.semibold,
            fontSize: '12px',
        },
    };
}
