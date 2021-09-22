import type SubstrateEvent from 'owa-search-service/lib/data/schema/SubstrateEvent';

export function addLocalTimeAttribute(event: SubstrateEvent, currentTime: Date) {
    event.Attributes.push({ Key: 'localtime', Value: currentTime.toISOString() });
}
