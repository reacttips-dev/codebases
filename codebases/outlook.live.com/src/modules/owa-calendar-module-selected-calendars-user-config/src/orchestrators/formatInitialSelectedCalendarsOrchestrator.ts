import { orchestrator } from 'satcheljs';
import {
    updateSelectedCalendars,
    refreshImmutableSelectedCalendars,
} from '../actions/publicActions';
import { formatInitialSelectedCalendars } from '../actions/internalActions';
import { convertIdsToTargetFormat, ConvertIdSource } from 'owa-immutable-id';
import { getTargetFormat } from 'owa-immutable-id-store';

orchestrator(formatInitialSelectedCalendars, async actionMessage => {
    const { ids, userIdentity } = actionMessage;

    const formattedResult = await convertIdsToTargetFormat(
        ids,
        getTargetFormat(userIdentity),
        userIdentity,
        ConvertIdSource.SelectedCalendars
    );

    updateSelectedCalendars(formattedResult, userIdentity);
    refreshImmutableSelectedCalendars(userIdentity);
});
