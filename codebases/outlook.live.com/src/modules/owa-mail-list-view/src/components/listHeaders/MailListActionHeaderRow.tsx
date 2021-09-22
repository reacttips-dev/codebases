import { observer } from 'mobx-react-lite';

import { Icon } from '@fluentui/react/lib/Icon';
import { Link } from '@fluentui/react/lib/Link';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import * as React from 'react';
import { getDensityModeString } from 'owa-fabric-theme';
import { isSingleLineListView } from 'owa-mail-layout';
export { default as ReactListViewType } from 'owa-service/lib/contract/ReactListViewType';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './MailListActionHeaderRow.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface MailListActionHeaderRowProps {
    containerCssClass?: string;
    text: string;
    onClick?: (evt?: React.MouseEvent<unknown>) => void;
    showBackArrow?: boolean;
    showLoadingSpinner?: boolean;
    alternativeIcon?: string;
    mailListHeaderStylesAsPerUserSettings?: string;
    isItemView: boolean;
}

export default observer(function MailListActionHeaderRow(props: MailListActionHeaderRowProps) {
    const { alternativeIcon, mailListHeaderStylesAsPerUserSettings, onClick } = props;
    const textStyle = classNames(
        styles.thirdRowTextWithWarning,
        isFeatureEnabled('mon-densities') && styles.thirdRowTextSize
    );

    const isSingleLineView = isSingleLineListView();
    const renderLink = () => {
        return (
            <Link onClick={onClick} className={styles.actionHeaderThirdRow} title={props.text}>
                <span className={textStyle}>{props.text}</span>
                {props.showLoadingSpinner && (
                    <Spinner className={styles.spinner} size={SpinnerSize.small} />
                )}
            </Link>
        );
    };
    const renderPlainText = () => {
        return (
            <span className={textStyle} title={props.text}>
                {props.text}
            </span>
        );
    };
    const hasLeftEntity = isSingleLineView && !props.isItemView;
    const withHighTwisty = isFeatureEnabled('mon-tri-mailItemTwisty');
    return (
        <div
            className={classNames(
                getDensityModeString(),
                withHighTwisty && styles.highTwisty,
                styles.inlineThirdRowContainer,
                mailListHeaderStylesAsPerUserSettings
            )}>
            {alternativeIcon && (
                <Icon
                    iconName={alternativeIcon}
                    className={classNames(
                        withHighTwisty && styles.highTwisty,
                        mailListHeaderStylesAsPerUserSettings,
                        styles.thirdRowIcon,
                        'flipForRtl',
                        hasLeftEntity && styles.leftEntitySingleLine
                    )}
                />
            )}
            {props.onClick ? renderLink() : renderPlainText()}
        </div>
    );
});
