import {
    LODGING_ENTITY_NAMES_MAP_VALUE,
    RENTAL_CAR_ENTITY_NAMES_MAP_VALUE,
    DINING_ENTITY_NAMES_MAP_VALUE,
    EVENTS_ENTITY_NAMES_MAP_VALUE,
    SERVICE_RESERVATION_ENTITY_NAMES_MAP_VALUE,
} from '../../helpers/TxpCommonConstants';
import {
    FLIGHTS_ENTITY_NAMES_MAP_VALUE,
    PACKAGE_ENTITY_NAMES_MAP_VALUE,
} from '../../helpers/TxpCommonConstantsInBoot';
import bitwiseAnd64Bit from '../../utils/featureChecks/bitwiseAnd64Bit';

export default function doesEntityNamesMapContainSupportedEntity(entityNamesMap: number): boolean {
    if (entityNamesMap <= 0) {
        return false;
    }
    return (
        bitwiseAnd64Bit(entityNamesMap, FLIGHTS_ENTITY_NAMES_MAP_VALUE) ==
            FLIGHTS_ENTITY_NAMES_MAP_VALUE ||
        bitwiseAnd64Bit(entityNamesMap, LODGING_ENTITY_NAMES_MAP_VALUE) ==
            LODGING_ENTITY_NAMES_MAP_VALUE ||
        bitwiseAnd64Bit(entityNamesMap, RENTAL_CAR_ENTITY_NAMES_MAP_VALUE) ==
            RENTAL_CAR_ENTITY_NAMES_MAP_VALUE ||
        bitwiseAnd64Bit(entityNamesMap, PACKAGE_ENTITY_NAMES_MAP_VALUE) ==
            PACKAGE_ENTITY_NAMES_MAP_VALUE ||
        bitwiseAnd64Bit(entityNamesMap, DINING_ENTITY_NAMES_MAP_VALUE) ==
            DINING_ENTITY_NAMES_MAP_VALUE ||
        bitwiseAnd64Bit(entityNamesMap, EVENTS_ENTITY_NAMES_MAP_VALUE) ==
            EVENTS_ENTITY_NAMES_MAP_VALUE ||
        bitwiseAnd64Bit(entityNamesMap, SERVICE_RESERVATION_ENTITY_NAMES_MAP_VALUE) ==
            SERVICE_RESERVATION_ENTITY_NAMES_MAP_VALUE
    );
}
