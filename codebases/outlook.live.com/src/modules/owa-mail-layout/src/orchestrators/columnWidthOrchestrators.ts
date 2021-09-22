import { createLazyOrchestrator } from 'owa-bundling';
import {
    onFirstColumnHandleChanged,
    onSecondColumnHandleChanged,
} from '../actions/columnWidthActions';
import {
    onReceivedColumnWidthChangedInternal,
    onSenderColumnWidthChangedInternal,
    onSubjectColumnWidthChangedInternal,
} from '../mutators/columnWidthMutators';
import {
    getOptionsForFeature,
    OwsOptionsFeatureType,
    ListViewColumnHeadersOptions,
    lazyCreateOrUpdateOptionsForFeature,
} from 'owa-outlook-service-options';

export const onFirstColumnHandleChangedOrchestrator = createLazyOrchestrator(
    onFirstColumnHandleChanged,
    'onFirstColumnHandleChangedClone',
    actionMessage => {
        const { senderColumnWidth, subjectColumnWidth } = actionMessage;

        // Get existing settings on server
        const userOptions = getOptionsForFeature<ListViewColumnHeadersOptions>(
            OwsOptionsFeatureType.ListViewColumnHeaders
        );

        // Update settings on server
        lazyCreateOrUpdateOptionsForFeature.importAndExecute(
            OwsOptionsFeatureType.ListViewColumnHeaders,
            {
                ...userOptions,
                senderColumnWidth: senderColumnWidth,
                subjectColumnWidth: subjectColumnWidth,
            } as ListViewColumnHeadersOptions
        );

        // Update store
        onSenderColumnWidthChangedInternal(senderColumnWidth);
        onSubjectColumnWidthChangedInternal(subjectColumnWidth);
    }
);

export const onSecondColumnHandleChangedOrchestrator = createLazyOrchestrator(
    onSecondColumnHandleChanged,
    'onSecondColumnHandleChangedClone',
    actionMessage => {
        const { subjectColumnWidth, receivedColumnWidth } = actionMessage;

        // Get existing settings on server
        const userOptions = getOptionsForFeature<ListViewColumnHeadersOptions>(
            OwsOptionsFeatureType.ListViewColumnHeaders
        );

        // Update settings on server
        lazyCreateOrUpdateOptionsForFeature.importAndExecute(
            OwsOptionsFeatureType.ListViewColumnHeaders,
            {
                ...userOptions,
                subjectColumnWidth: subjectColumnWidth,
                receivedColumnWidth: receivedColumnWidth,
            } as ListViewColumnHeadersOptions
        );

        // Update store
        onSubjectColumnWidthChangedInternal(subjectColumnWidth);
        onReceivedColumnWidthChangedInternal(receivedColumnWidth);
    }
);
