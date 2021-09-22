import createOrUpdateOptionsForFeatures from './createOrUpdateOptionsForFeature';
import type AddinPinModes from '../utils/AddinPinModes';
import {
    getOptionsForFeature,
    CalendarSurfaceAddinsOptions,
    SurfaceActionsOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-option-store';
import updateAddInArray from './updateAddInsArray';

export default function updateAddinPinStatus(
    productId: string,
    newPinnedStatus: boolean,
    pinOptions: AddinPinModes
) {
    let mailOptions: SurfaceActionsOptions = getOptionsForFeature<SurfaceActionsOptions>(
        OwsOptionsFeatureType.SurfaceActions
    );

    let calendarOptions: CalendarSurfaceAddinsOptions = getOptionsForFeature<CalendarSurfaceAddinsOptions>(
        OwsOptionsFeatureType.CalendarSurfaceAddins
    );

    let callMailApi = pinOptions.readMode
        ? updateOptions(mailOptions.readSurfaceAddins, productId, newPinnedStatus)
        : false;
    callMailApi = pinOptions.composeMode
        ? callMailApi || updateOptions(mailOptions.composeSurfaceAddins, productId, newPinnedStatus)
        : callMailApi;

    let callCalendarApi = pinOptions.calendarMode
        ? updateOptions(calendarOptions.calendarSurfaceAddins, productId, newPinnedStatus)
        : false;

    if (callMailApi) {
        createOrUpdateOptionsForFeatures(OwsOptionsFeatureType.SurfaceActions, mailOptions);
    }
    if (callCalendarApi) {
        createOrUpdateOptionsForFeatures(
            OwsOptionsFeatureType.CalendarSurfaceAddins,
            calendarOptions
        );
    }
}

export let updateOptions = (
    addinsArray: Array<string>,
    productId: string,
    newPinnedStatus: boolean
): boolean => {
    let callApi = false;

    if (newPinnedStatus) {
        if (addinsArray.indexOf(productId) === -1) {
            //The third parameter true denotes push operation has to be performed here
            //since a single operation performs both push and splice
            updateAddInArray(addinsArray, productId, true);
            callApi = true;
        }
    } else {
        if (addinsArray.indexOf(productId) !== -1) {
            //Here the third parameter false denotes splice operation on the array
            updateAddInArray(addinsArray, productId, false);
            callApi = true;
        }
    }
    return callApi;
};
