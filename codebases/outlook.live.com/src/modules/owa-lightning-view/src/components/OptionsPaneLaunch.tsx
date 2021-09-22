import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { lightable, lighted, LightningProps } from 'owa-lightning-v2';

export const OptionsPaneLaunch = lightable(
    observer(function OptionsPaneLaunch(props: LightningProps) {
        React.useEffect(() => {
            (window as any).O365Shell.FlexPane.OpenFlexPaneForProvider('OwaSettings');
            lighted(props.lid);
        }, []);
        return <></>;
    })
);
