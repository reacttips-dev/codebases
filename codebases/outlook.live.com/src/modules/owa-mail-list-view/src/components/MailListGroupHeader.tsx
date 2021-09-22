import { observer } from 'mobx-react-lite';
import { getDensityModeString } from 'owa-fabric-theme';
import * as React from 'react';
import { isReadingPanePositionOff, isSingleLineListView } from 'owa-mail-layout';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './MailListGroupHeader.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);
export interface MailListGroupHeaderProps {
    headerText: string;
    groupHeaderStylesAsPerUserSettings: string;
    hasSenderImageOffInFullView: boolean;
}

const MailListGroupHeader = observer(function MailListGroupHeader(props: MailListGroupHeaderProps) {
    const { headerText, groupHeaderStylesAsPerUserSettings, hasSenderImageOffInFullView } = props;
    const withHighTwisty = isFeatureEnabled('mon-tri-mailItemTwisty') && !isSingleLineListView();
    const hasDensityNext = isFeatureEnabled('mon-densities');

    const headerClassNames = classNames(
        getDensityModeString(),
        styles.outerContainer,
        groupHeaderStylesAsPerUserSettings,
        styles.alignToMailListPersonaPadding,
        isReadingPanePositionOff()
            ? 'singleLineCirclePersonaDivWidth'
            : 'threeColumnCirclePersonaDivWidth',
        withHighTwisty && styles.highTwisty,
        withHighTwisty && hasSenderImageOffInFullView && styles.personaNoImage,
        hasDensityNext && styles.groupHeaderText
    );

    return (
        <div role="heading" aria-level={3} className={headerClassNames}>
            {headerText}
        </div>
    );
});
export default MailListGroupHeader;
