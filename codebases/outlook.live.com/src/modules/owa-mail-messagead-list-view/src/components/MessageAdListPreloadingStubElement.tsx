import { observer } from 'mobx-react-lite';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isSingleLineListView } from 'owa-mail-layout';
import { getDensityModeString } from 'owa-fabric-theme';
import * as React from 'react';

import styles from './MessageAdListStubElement.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

const MessageAdListPreloadingStubElement = observer(function MessageAdListPreloadingStubElement() {
    const useAdViewOneLine = isSingleLineListView();

    // Always allocate the two ads space during the preloading stage when two native ad flights are enabled
    const showTwoAds =
        isFeatureEnabled('adsExp-NativeTwoAds-e1') ||
        isFeatureEnabled('adsExp-NativeTwoAds-e2') ||
        isFeatureEnabled('adsExp-NativeTwoAds-e3');

    const oneLineContainer = showTwoAds
        ? classNames(getDensityModeString(), styles.messageAdStaticContainerTwoAdOneLineExp)
        : classNames(getDensityModeString(), styles.messageAdStaticContainerOneLineExp);
    const threeLinesContainer = showTwoAds
        ? classNames(getDensityModeString(), styles.messageAdStaticContainerTwoAdThreeLineExp)
        : classNames(getDensityModeString(), styles.messageAdStaticContainerThreeLineExp);
    return <div className={useAdViewOneLine ? oneLineContainer : threeLinesContainer} />;
});
export default MessageAdListPreloadingStubElement;
