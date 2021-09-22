import bitwiseAnd64Bit from '../../utils/featureChecks/bitwiseAnd64Bit';
import {
    UNSUCCESSFUL_FLIGHTS_ENTITY_NAMES_MAP_VALUE,
    UNSUCCESSFUL_LODGING_ENTITY_NAMES_MAP_VALUE,
    UNSUCCESSFUL_RENTAL_ENTITY_NAMES_MAP_VALUE,
} from '../../helpers/TxpCommonConstants';

export default function areUnsuccessfulEntitiesSupported(entityNamesMap: number): boolean {
    const entityNameMatches =
        bitwiseAnd64Bit(entityNamesMap, UNSUCCESSFUL_FLIGHTS_ENTITY_NAMES_MAP_VALUE) ==
            UNSUCCESSFUL_FLIGHTS_ENTITY_NAMES_MAP_VALUE ||
        bitwiseAnd64Bit(entityNamesMap, UNSUCCESSFUL_LODGING_ENTITY_NAMES_MAP_VALUE) ==
            UNSUCCESSFUL_LODGING_ENTITY_NAMES_MAP_VALUE ||
        bitwiseAnd64Bit(entityNamesMap, UNSUCCESSFUL_RENTAL_ENTITY_NAMES_MAP_VALUE) ==
            UNSUCCESSFUL_RENTAL_ENTITY_NAMES_MAP_VALUE;
    return entityNameMatches;
}
