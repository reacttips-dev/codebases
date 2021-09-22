import { observer } from 'mobx-react-lite';
import * as React from 'react';
import getLocationPhoto from '../utils/getLocationPhoto';
import { isNullOrWhiteSpace } from 'owa-string-utils';
import type { LocationPersonaControlViewState } from '../data/schema/LocationPersonaControlViewState';
import { Persona, PersonaPresence, PersonaSize } from '@fluentui/react/lib/Persona';
import { trace } from 'owa-trace';

import assign from 'object-assign';

const photoWidth = 64;
const photoHeight = 64;

/**
 * props for the location persona control.
 * @param locationPersona: the persona control view state
 * @param size: the persona control size, this is passed to @fluentui/react Persona control
 * @param showPersonaDetails: true if the contol show the persona text
 * @param className: a custom Css class passed to @fluentui/react Persona control.
 */
export interface LocationPersonaControlProps {
    locationPersona: LocationPersonaControlViewState;
    size: PersonaSize;
    showPersonaDetails?: boolean;
    className?: string;
}

export type LocationBlobRequestStatus = 'pending' | 'failed' | 'success';

export const LocationPersonaControl = observer(function LocationPersonaControl(
    props: LocationPersonaControlProps
) {
    const requestStatus = React.useRef<LocationBlobRequestStatus>();
    const [blobUrl, setBlobUrl] = React.useState(null);

    React.useEffect(() => {
        let mounted = true;
        if (props.locationPersona?.postalAddress) {
            if (
                props.locationPersona.postalAddress.Latitude &&
                props.locationPersona.postalAddress.Longitude &&
                !isNullOrWhiteSpace(props.locationPersona.displayName) &&
                !blobUrl &&
                requestStatus.current != 'pending' &&
                requestStatus.current != 'failed'
            ) {
                requestStatus.current = 'pending';
                getLocationPhoto(
                    props.locationPersona.postalAddress.Latitude,
                    props.locationPersona.postalAddress.Longitude,
                    null /* formattedAddress */,
                    function onCompleteDownload(blobUrl: string) {
                        if (mounted) {
                            setBlobUrl(blobUrl);
                            if (!blobUrl) {
                                requestStatus.current = 'failed';
                                // Log that we failed to fetch the location photo. Not logging url for now, will add if we see enough number of errors
                                trace.warn('getLocationPhoto.downloadLocationPhoto failed');
                            } else {
                                requestStatus.current = 'success';
                            }
                        }
                    },
                    photoWidth,
                    photoHeight
                );
            }
        }
        return () => (mounted = false);
    }, [
        props.locationPersona.postalAddress?.Latitude,
        props.locationPersona.postalAddress?.Longitude,
        props.locationPersona.displayName,
    ]);

    let { locationPersona, className, size, showPersonaDetails } = props;
    if (locationPersona) {
        let photoDisplayProps: any = {};
        if (!isNullOrWhiteSpace(blobUrl)) {
            assign(photoDisplayProps, {
                imageUrl: blobUrl,
                imageShouldFadeIn: false,
            });
        } else {
            assign(photoDisplayProps, {
                imageInitials: locationPersona.initials,
                initialsColor: locationPersona.textBoyColor,
            });
        }
        return (
            <Persona
                className={className}
                presence={PersonaPresence.none}
                hidePersonaDetails={!showPersonaDetails}
                size={size}
                text={locationPersona.displayName}
                secondaryText={locationPersona.displayAddress}
                {...photoDisplayProps}
            />
        );
    }
    return null;
});
