import {
    FLIGHTS_ENTITY_NAMES_MAP_VALUE,
    PACKAGE_ENTITY_NAMES_MAP_VALUE,
} from 'owa-txp-common/lib/helpers/TxpCommonConstantsInBoot';
import bitwiseAnd64Bit from 'owa-txp-common/lib/utils/featureChecks/bitwiseAnd64Bit';

/**This contains the check to show whether this particular value of entitynamesmap is valid and supported by listview presently. */
export default function isTxpEntitySupportedInListView(entityNamesMap: number): boolean {
    return (
        entityNamesMap > 0 &&
        (bitwiseAnd64Bit(entityNamesMap, PACKAGE_ENTITY_NAMES_MAP_VALUE) ==
            PACKAGE_ENTITY_NAMES_MAP_VALUE ||
            bitwiseAnd64Bit(entityNamesMap, FLIGHTS_ENTITY_NAMES_MAP_VALUE) ==
                FLIGHTS_ENTITY_NAMES_MAP_VALUE)
    );
}
