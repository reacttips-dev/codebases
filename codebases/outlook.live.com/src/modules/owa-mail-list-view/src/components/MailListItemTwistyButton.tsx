import { IconButton } from '@fluentui/react/lib/Button';
import * as React from 'react';
import { ControlIcons } from 'owa-control-icons';
import loc, { isCurrentCultureRightToLeft } from 'owa-localize';
import { twistyButtonExpandConversationLabel } from './MailListItemTwistyButton.locstring.json';
import { touchHandler } from 'owa-touch-handler';
import { isFeatureEnabled } from 'owa-feature-flags';
import { MailIcons } from 'owa-mail-icons';

import styles from './MailListItemTwistyButton.scss';
import classNames from 'classnames';

export interface MailListItemTwistyButtonProps {
    isSecondLevelExpanded: boolean;
    isFirstLevelExpanded: boolean;
    onClick: (evt: React.MouseEvent<unknown>) => void;
    className?: string;
    isSingleLine: boolean;
}

function MailListItemTwistyButton(props: MailListItemTwistyButtonProps) {
    const twistyImageClassNames = classNames(
        styles.twistyImage,
        props.isSecondLevelExpanded &&
            (isCurrentCultureRightToLeft() ? styles.expandedrtl : styles.expandedltr)
    );
    const hasHighTwisty = !props.isSingleLine && isFeatureEnabled('mon-tri-mailItemTwisty');

    const onDoubleClickHandler = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
    };

    return (
        <div
            className={classNames(hasHighTwisty && styles.highTwisty)}
            {...touchHandler({ onClick: props.onClick })}>
            <IconButton
                aria-expanded={props.isSecondLevelExpanded}
                aria-label={loc(twistyButtonExpandConversationLabel)}
                className={classNames(
                    props.className,
                    styles.button,
                    'flipForRtl',
                    hasHighTwisty &&
                        (props.isFirstLevelExpanded || props.isSecondLevelExpanded) &&
                        styles.highTwistyExpanded
                )}
                iconProps={{
                    iconName: hasHighTwisty
                        ? MailIcons.ChevronRightSmall
                        : ControlIcons.ChevronRightMed,
                    styles: {
                        root: twistyImageClassNames,
                    },
                }}
                tabIndex={-1}
                onClick={props.onClick}
                onDoubleClick={onDoubleClickHandler}
            />
        </div>
    );
}

export default MailListItemTwistyButton;
