import { observer } from 'mobx-react';
import * as React from 'react';
import { AdsPanel } from 'owa-mail-ads';
import { areDisplayAdsEnabled } from 'owa-mail-ads-checker';

import styles from './AdsPanelStub.scss';

export interface AdsPanelStubProps {
    isBottom: boolean;
    /**
     * Whether to hide the AdsPanel.
     * When temporarily hiding the AdsPanel, this is preferred to unmounting and remounting
     * due to needing to reinitialize and fetch ads whenever we have a different DOM Element
     */
    isHidden?: boolean;
}

@observer
export default class AdsPanelStub extends React.Component<AdsPanelStubProps, {}> {
    public static adsEnabled: boolean;

    constructor(props: AdsPanelStubProps) {
        super(props);
        AdsPanelStub.adsEnabled = areDisplayAdsEnabled();
    }

    render() {
        const adContainerClasses = [styles.adsContainer];
        if (!AdsPanelStub.adsEnabled || this.props.isHidden) {
            adContainerClasses.push(styles.hide);
        } else if (this.props.isBottom) {
            adContainerClasses.push(styles.bottom);
        }

        return (
            <div className={adContainerClasses.join(' ')}>
                {AdsPanelStub.adsEnabled && <AdsPanel isBottom={this.props.isBottom} />}
            </div>
        );
    }
}
