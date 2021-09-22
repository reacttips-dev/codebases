import {
    whatsNew_Card_COVID19_Title,
    whatsNew_Card_COVID19_Body,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import NewsCardBody from './NewsCardBody';

import covid19Styles from './NewsCard.scss';

function covid19TrackerCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.COVID19,
        title: loc(whatsNew_Card_COVID19_Title),
        svgIcon: (
            <svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M31 7C31.2708 7 31.5052 7.09896 31.7031 7.29688C31.901 7.49479 32 7.72917 32 8V24C32 24.4167 31.9219 24.8073 31.7656 25.1719C31.6094 25.5365 31.3958 25.8542 31.125 26.125C30.8542 26.3958 30.5365 26.6094 30.1719 26.7656C29.8073 26.9219 29.4167 27 29 27H4C3.44792 27 2.93229 26.8958 2.45312 26.6875C1.97396 26.4792 1.54688 26.1927 1.17188 25.8281C0.796875 25.4635 0.510417 25.0417 0.3125 24.5625C0.114583 24.0833 0.0104167 23.5625 0 23V6.5C0 6.08333 0.145833 5.72917 0.4375 5.4375C0.729167 5.14583 1.08333 5 1.5 5H26.5C26.9167 5 27.2708 5.14583 27.5625 5.4375C27.8542 5.72917 28 6.08333 28 6.5V24C28 24.2708 28.099 24.5052 28.2969 24.7031C28.4948 24.901 28.7292 25 29 25C29.2708 25 29.5052 24.901 29.7031 24.7031C29.901 24.5052 30 24.2708 30 24V8C30 7.72917 30.099 7.49479 30.2969 7.29688C30.4948 7.09896 30.7292 7 31 7ZM13 12H3V22C3 22.2812 3.05208 22.5417 3.15625 22.7812C3.26042 23.0208 3.40104 23.2292 3.57812 23.4062C3.75521 23.5833 3.96875 23.7292 4.21875 23.8438C4.46875 23.9583 4.72917 24.0104 5 24H13V12ZM22 22H16V24H22V22ZM25 18H16V20H25V18ZM25 14H16V16H25V14ZM25 8H3V10H25V8Z" />
            </svg>
        ),
        svgIconStyle: covid19Styles.icon,
        body: (
            <NewsCardBody
                identity={WhatsNewCardIdentity.COVID19}
                onGetUpdatesClicked={onGetUpdatesClicked}
                bodyText={loc(whatsNew_Card_COVID19_Body)}
            />
        ),
    };
}

const onGetUpdatesClicked = () => {
    /* tslint:disable-next-line:no-http-string */
    window.open('https://www.msn.com/covid-19/?ocid=OWAwhatsnew&PC=U581', '_blank');
};

export default covid19TrackerCardProps;
