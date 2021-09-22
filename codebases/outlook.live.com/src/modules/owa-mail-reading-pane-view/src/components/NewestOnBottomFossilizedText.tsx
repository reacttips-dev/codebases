import { observer } from 'mobx-react-lite';
import { hideMessageHistoryText, showMessageHistoryText } from '../strings.locstring.json';
import loc from 'owa-localize';
import { ActionButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { WideContentHost } from 'owa-controls-content-handler';
import { MailIcons } from 'owa-mail-icons';
import expandCollapseNewestOnBottomFossilizedText from 'owa-mail-reading-pane-store/lib/actions/expandCollapseNewestOnBottomFossilizedText';

import * as React from 'react';

import styles from './FossilizedTextAndQuotedBody.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface NewestOnBottomFossilizedTextProps {
    conversationId: string;
    nodeId: string;
    isExpanded: boolean;
    firstQuotedBody: JSX.Element;
    quotedBodies: JSX.Element;
    collapsedCallback: (fossilizedTextOffsetTop: number) => void;
    isFocused: boolean;
}

export default observer(function NewestOnBottomFossilizedText(
    props: NewestOnBottomFossilizedTextProps
) {
    const previousIsExpanded = React.useRef<boolean>();
    const fossilizedTextContainer = React.useRef<HTMLDivElement>();
    React.useEffect(() => {
        previousIsExpanded.current = props.isExpanded;
    }, []);

    React.useEffect(() => {
        if (props.isFocused || previousIsExpanded.current != props.isExpanded) {
            fossilizedTextContainer.current.focus();
        }
    }, [props.isFocused, props.isExpanded]);

    React.useEffect(() => {
        if (previousIsExpanded.current != props.isExpanded) {
            previousIsExpanded.current = props.isExpanded;

            if (!props.isExpanded && fossilizedTextContainer.current) {
                props.collapsedCallback(
                    fossilizedTextContainer.current.getBoundingClientRect().top
                );
            }
        }
    }, [props.isExpanded]);

    const setFossilizedTextContainer = (ref: HTMLDivElement) => {
        fossilizedTextContainer.current = ref;
    };
    const renderHideHistoryButton = (isClickFromTopTarget: boolean) => {
        return (
            <ActionButton
                className={classNames(
                    styles.showHideMessageHistoryButton,
                    !isClickFromTopTarget && styles.bottomHideMessageHistoryButton,
                    styles.hideMessageHistoryButton
                )}
                onClick={onToggleExpandCollapseNewestOnBottomFossilizedText}
                text={loc(hideMessageHistoryText)}
                iconProps={{
                    iconName: isClickFromTopTarget
                        ? MailIcons.ChevronDownSmall
                        : MailIcons.ChevronUpSmall,
                    styles: { root: styles.showHideMessageHistoryButtonIcon },
                }}
                styles={{
                    label: styles.showHideMessageHistoryButtonText,
                }}
            />
        );
    };
    const onToggleExpandCollapseNewestOnBottomFossilizedText = () => {
        expandCollapseNewestOnBottomFossilizedText(
            props.conversationId,
            props.nodeId,
            props.isExpanded
        );
    };
    const expandedNewestOnBottomFossilizedText = (
        <div className={styles.expandedNewestOnBottomFossilizedText}>
            {renderHideHistoryButton(true /* isClickFromTopTarget */)}
            {props.quotedBodies}
            {renderHideHistoryButton(false /* isClickFromTopTarget */)}
        </div>
    );
    const collapsedNewestOnBottomFossilizedText = (
        /* VSO:19160: Should switch over to use one of Fabric's Button controls, but it will require rework of the styling. */
        <div
            className={styles.collapsedFossilizedText}
            onClick={onToggleExpandCollapseNewestOnBottomFossilizedText}>
            <div className={classNames(styles.showHideMessageHistoryButton)}>
                <Icon
                    className={styles.showHideMessageHistoryButtonIcon}
                    iconName={MailIcons.ChevronRightSmall}
                />
                <span className={styles.showHideMessageHistoryButtonText}>
                    {loc(showMessageHistoryText)}
                </span>
            </div>
            <div className={styles.collapsedNewestOnBottomFossilizedText}>
                {/** In collapsed state, render the first quoted body only*/}
                {props.firstQuotedBody}
            </div>
        </div>
    );
    return (
        <WideContentHost>
            <div
                ref={setFossilizedTextContainer}
                tabIndex={-1}
                className={classNames(styles.newestOnBottomFossilizedText, {
                    isFocused: props.isFocused,
                })}>
                {props.isExpanded
                    ? expandedNewestOnBottomFossilizedText
                    : collapsedNewestOnBottomFossilizedText}
                <div className={styles.newestOnBottomFossilizedTextBottomBorder} />
            </div>
        </WideContentHost>
    );
});
