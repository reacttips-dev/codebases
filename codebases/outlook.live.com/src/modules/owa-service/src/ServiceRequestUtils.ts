import jsonRequestHeaders from './factory/jsonRequestHeaders';
import timeZoneContext from './factory/timeZoneContext';
import timeZoneDefinitionType from './factory/timeZoneDefinitionType';
import extendedPropertyUri from './factory/extendedPropertyUri';
import type MapiPropertyType from './contract/MapiPropertyType';
import { getConfig } from './config';

export function getJsonRequestHeader(timezone?: string) {
    if (!timezone) {
        timezone = getConfig().timezone;
    }
    if (timezone) {
        return jsonRequestHeaders({
            RequestServerVersion: 'V2018_01_08',
            TimeZoneContext: timeZoneContext({
                TimeZoneDefinition: timeZoneDefinitionType({
                    Id: timezone,
                }),
            }),
        });
    } else {
        return jsonRequestHeaders({
            RequestServerVersion: 'V2018_01_08',
        });
    }
}

export function getExtendedPropertyUri(
    propertySetID: string,
    propertyName: string,
    propertyType: MapiPropertyType
) {
    return extendedPropertyUri({
        PropertySetId: propertySetID,
        PropertyName: propertyName,
        PropertyType: propertyType,
    });
}
