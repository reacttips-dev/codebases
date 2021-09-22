import type Item from 'owa-service/lib/contract/Item';

export default function isMeetingMessage(item: Item) {
    return (
        item?.ItemClass &&
        item.ItemClass.match(/^ipm\.(appointment|schedule\.meeting(?!\.notification))/i)
    );
}
