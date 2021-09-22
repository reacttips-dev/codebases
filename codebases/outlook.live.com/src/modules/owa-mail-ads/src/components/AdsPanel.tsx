import { fetchAds } from '../adbar/AdBar';
import getStore from '../store/store';
import { Icon } from '@fluentui/react/lib/Icon';
import { observer } from 'mobx-react';
import { ControlIcons } from 'owa-control-icons';
import loc, { format } from 'owa-localize';
import { getOwaResourceImageUrl } from 'owa-resource-url';
import * as React from 'react';
import {
    adBlockUseAdFreeText,
    adContainerAriaLabelText,
    adChoiceAriaLabelText,
    adChoiceLabelText,
} from './AdsPanel.locstring.json';
import { calculateCookieTargeting, cookieTargetingStore } from 'owa-cookie-targeting';

import styles from './AdsPanel.scss';
const adFreeOutlookComLinkFormat = 'https://windows.microsoft.com/outlook/ad-free-outlook';
const choiseUrlFormat = 'https://choice.microsoft.com/';

export interface AdsPanelProps {
    isBottom: boolean;
}

export interface AdsPanelState {
    doLiveIdFirstPartyCookieSync: boolean;
}

@observer
export default class AdsPanel extends React.Component<AdsPanelProps, AdsPanelState> {
    private static instanceNumber = 0;
    private market: string;
    private adContainerId: string;
    private adsContainer: HTMLDivElement;
    constructor(props: AdsPanelProps) {
        super(props);
        this.adContainerId = 'owaadbar' + AdsPanel.instanceNumber++;
        this.state = {
            doLiveIdFirstPartyCookieSync: false,
        };
    }

    async componentDidMount() {
        this.updateAds();
        window.addEventListener('resize', this.updateAds);

        await calculateCookieTargeting();
        if (cookieTargetingStore.effectiveOptInValue) {
            this.setState({
                doLiveIdFirstPartyCookieSync: true,
            });
        }
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateAds);
    }
    updateAds = () => {
        if (this.props.isBottom) {
            this.adsContainer.style.width = `${window.innerWidth}px`;
        }
        this.market = fetchAds(this.adContainerId, this.determineAd);
    };
    determineAd = (): string => {
        if (window.innerWidth > 320) {
            if (
                this.props.isBottom &&
                window.innerWidth < 990 &&
                window.innerHeight > 600 &&
                window.innerWidth > 749
            ) {
                return 'WAB7';
            } else if (!this.props.isBottom && window.innerWidth >= 990) {
                return window.innerWidth < 1900 ? 'WAB2' : 'WAB5';
            }
        }

        return null;
    };
    private onFooterClick = () => {
        window.open(choiseUrlFormat + this.market, '_blank');
    };
    render() {
        const adContainerClasses = [styles.adsContainer];
        if (this.props.isBottom) {
            adContainerClasses.push(styles.bottom);
        }

        return (
            <div ref={ref => (this.adsContainer = ref)} className={adContainerClasses.join(' ')}>
                {getStore().showAdBlockMessage ? (
                    <div className={styles.adBlockContainer}>
                        <Icon iconName={ControlIcons.OutlookLogo} className={styles.icon} />
                        {/* tslint:disable:react-no-dangerous-html */}
                        {/* eslint-disable react/no-danger */}
                        {/* VSO:18675 -- get rid of the need for dangerouslySetInnerHTML */}
                        <span
                            className={styles.blockText}
                            dangerouslySetInnerHTML={{
                                __html: format(
                                    loc(adBlockUseAdFreeText),
                                    adFreeOutlookComLinkFormat
                                ),
                            }}
                        />
                        {/* eslint-enable react/no-danger */}
                        {/* tslint:enable:react-no-dangerous-html */}
                    </div>
                ) : (
                    <div>
                        <div
                            aria-label={loc(adContainerAriaLabelText)}
                            className={styles.rendererContainer}
                            id={this.adContainerId}
                        />
                    </div>
                )}
                <div className={styles.footer} onClick={this.onFooterClick}>
                    <div className={styles.choicePic}>
                        <img
                            aria-label={loc(adChoiceAriaLabelText)}
                            src={getOwaResourceImageUrl('adbarmetrosprite.png')}
                        />
                    </div>
                    <span className={styles.choiceLabel}>{loc(adChoiceLabelText)}</span>
                </div>
                {this.state.doLiveIdFirstPartyCookieSync && (
                    <div className={styles.hide}>
                        <img src="https://c.live.com/c.gif" />
                    </div>
                )}
            </div>
        );
    }
}
