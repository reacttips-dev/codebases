import { observer } from 'mobx-react-lite';
import { lightable, lighted, LightningProps } from 'owa-lightning-v2';
import { UserVoiceNps } from 'owa-uservoice';
import * as React from 'react';

export interface UserVoiceNpsLightningCalloutProps extends LightningProps {
    isFirstSurvey: boolean;
}

export default lightable(
    observer(function UserVoiceNpsLightningCallout(props: UserVoiceNpsLightningCalloutProps) {
        const onClose = React.useCallback(() => lighted(props.lid), [props.lid]);
        return (
            <UserVoiceNps
                invokedBy={''}
                isFirstSurvey={props.isFirstSurvey}
                isOutlookNps={true}
                onClose={onClose}
            />
        );
    })
);
