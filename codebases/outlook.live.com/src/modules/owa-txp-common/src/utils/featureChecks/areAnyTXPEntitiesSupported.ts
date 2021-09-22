import doesEntityNamesMapContainSupportedEntity from './doesEntityNamesMapContainSupportedEntity';
import isInvoiceSupported from './isInvoiceSupported';
import areUnsuccessfulEntitiesSupported from './areUnsuccessfulEntitiesSupported';

export default function areAnyTXPEntitiesSupported(entityNamesMap: number): boolean {
    return (
        doesEntityNamesMapContainSupportedEntity(entityNamesMap) ||
        areUnsuccessfulEntitiesSupported(entityNamesMap) ||
        isInvoiceSupported(entityNamesMap)
    );
}
