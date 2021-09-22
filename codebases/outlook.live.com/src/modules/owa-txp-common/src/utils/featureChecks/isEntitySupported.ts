import bitwiseAnd64Bit from '../../utils/featureChecks/bitwiseAnd64Bit';

export default function isEntitySupported(
    entityNamesMap: number,
    expectedEntityNamesMap: number,
    isFeatureSupported: boolean
): boolean {
    const entityNamesMatches =
        bitwiseAnd64Bit(entityNamesMap, expectedEntityNamesMap) == expectedEntityNamesMap;

    return entityNamesMatches && isFeatureSupported;
}
