import * as React from 'react';
import type BulkActionScenarioType from '../types/BulkActionScenarioType';
import { store } from '../index';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import getBulkActionTooltipText from '../selectors/getBulkActionTooltipText';
import { observer } from 'mobx-react-lite';

export interface BulkActionSpinnerProps {
    folderId: string;
    folderName: string;
}

export default observer(function BulkActionSpinner(props: BulkActionSpinnerProps): JSX.Element {
    const bulkActionInfo = store.bulkActionInformationMap.get(props.folderId);
    const scenario: BulkActionScenarioType = bulkActionInfo.customData
        ? JSON.parse(bulkActionInfo.customData).Scenario
        : bulkActionInfo.class;
    const tooltipText = getBulkActionTooltipText(scenario, props.folderName);
    return (
        <TooltipHost content={tooltipText} calloutProps={{ gapSpace: 0 }}>
            <Spinner size={SpinnerSize.small} title="" />
        </TooltipHost>
    );
});
