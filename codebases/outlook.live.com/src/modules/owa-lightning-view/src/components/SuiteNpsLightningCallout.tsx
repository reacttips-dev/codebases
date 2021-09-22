import { observer } from 'mobx-react-lite';
import { lightable, lighted, LightningProps } from 'owa-lightning-v2';
import { UserVoiceNps } from 'owa-uservoice';
import * as React from 'react';
import {
    suiteNpsRatingsHeader,
    suiteNpsNotLikelyFooterLabel,
    suiteNpsLikelyFooterLabel,
} from './SuiteNpsLightningCallout.locstring.json';
import loc from 'owa-localize';

export interface SuiteNpsLightningCalloutProps extends LightningProps {
    isFirstSurvey: boolean;
}

export default lightable(
    observer(function SuiteNpsLightningCallout(props: SuiteNpsLightningCalloutProps) {
        const onClose = React.useCallback(() => lighted(props.lid), [props.lid]);
        return (
            <UserVoiceNps
                isFirstSurvey={props.isFirstSurvey}
                isOutlookNps={false}
                onClose={onClose}
                ratingsHeader={loc(suiteNpsRatingsHeader)}
                negativeLabel={loc(suiteNpsNotLikelyFooterLabel)}
                positiveLabel={loc(suiteNpsLikelyFooterLabel)}
                invokedBy="SuiteNps"
            />
        );
    })
);
