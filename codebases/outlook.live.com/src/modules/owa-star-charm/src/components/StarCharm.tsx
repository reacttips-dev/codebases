import { observer } from 'mobx-react-lite';
import { ActionButton } from '@fluentui/react/lib/Button';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import { AriaProperties, generateDomPropertiesForAria } from 'owa-accessibility';
import StarRegular from 'owa-fluent-icons-svg/lib/icons/StarRegular';
import StarFilled from 'owa-fluent-icons-svg/lib/icons/StarFilled';
import * as React from 'react';

import styles from './StarCharm.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface StarCharmProps {
    isStarred: boolean;
    onClick: (evt?: React.MouseEvent<unknown>) => void;
    isClickDisabled?: boolean;
    ariaLabelText?: string;
    tooltip?: { starred: string; unstarred: string };
    animate?: boolean;
    iconStyles?: string;
    buttonStyles?: string;
    tooltipStyles?: string;
    spinnerStyles?: string;
    showOnlyOnHover?: boolean;
    isInFolderPane?: boolean;
}

export default observer(function StarCharm(props: StarCharmProps) {
    props = {
        tooltip: { starred: '', unstarred: '' },
        iconStyles: styles.starIcon,
        ...props,
    };
    const starIcon = props.isStarred ? StarFilled : StarRegular;
    const starIconClassNames = classNames(
        props.iconStyles,
        styles.starIconBase,
        props.animate && props.isStarred ? styles.saved : undefined,
        props.animate && styles.noTextAnimation
    );
    const tooltip = props.isStarred ? props.tooltip.starred : props.tooltip.unstarred;
    const ariaProps: AriaProperties = {
        role: undefined,
        label: props.ariaLabelText,
    };
    const buttonClassNames = classNames(
        props.showOnlyOnHover && styles.showOnlyOnHover,
        styles.container,
        props.buttonStyles,
        props.isClickDisabled && styles.clickDisabled
    );
    const onClick = (evt: React.MouseEvent<unknown>) => {
        if (props.isInFolderPane) {
            evt.stopPropagation();
            evt.preventDefault();
        }
        props.onClick(evt);
    };

    return props.isClickDisabled ? (
        <div className={props.spinnerStyles}>
            <Spinner size={SpinnerSize.small} />
        </div>
    ) : (
        <TooltipHost content={tooltip} hostClassName={props.tooltipStyles}>
            <ActionButton
                className={buttonClassNames}
                checked={props.isStarred}
                toggle={true}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                iconProps={{
                    iconName: starIcon,
                    styles: {
                        root: starIconClassNames,
                    },
                }}
                {...generateDomPropertiesForAria(ariaProps)}
            />
        </TooltipHost>
    );
});

function onDoubleClick(evt: React.MouseEvent<unknown>) {
    evt.stopPropagation();
    evt.preventDefault();
}
