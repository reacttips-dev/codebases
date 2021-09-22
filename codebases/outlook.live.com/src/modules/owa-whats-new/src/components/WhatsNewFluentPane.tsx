import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { default as WhatsNewFluentCard } from './WhatsNewFluentCard';
import { markAllAsRead } from '../orchestrators/markAllAsRead';
import { getStore } from '../store/store';
import type { WhatsNewCardIdentity } from '../store/schema/WhatsNewCardIdentity';
import { getWhatsNewCardProperty } from '../utils/getWhatsNewCardProperty';
import { logUsage } from 'owa-analytics';
import Styles from './WhatsNewFluentPane.scss';
import ClassNames from 'classnames';

const WhatsNewFluentPane = observer(function WhatsNewFluentPane(props: {}) {
    React.useEffect(() => {
        logUsage('whatsNewPaneOpened');
    }, []);

    React.useEffect(
        () => () => {
            markAllAsRead();
        },
        []
    );

    return (
        getStore().cards && (
            <ul className={ClassNames(Styles.whatsNewFluentPane, Styles.shellHeaderTreatment)}>
                {Object.keys(getStore().cards).map(key => {
                    return (
                        <WhatsNewFluentCard
                            key={key}
                            {...getWhatsNewCardProperty(key as WhatsNewCardIdentity)}
                        />
                    );
                })}
            </ul>
        )
    );
});

export default WhatsNewFluentPane;
