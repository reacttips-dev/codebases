import type Item from 'owa-service/lib/contract/Item';

const REPORT_CLASS_NAME_PREFIX = 'report';
const NDR_CLASS_NAME = 'report.ipm.note.ndr';
const DR_CLASS_NAME = 'report.ipm.note.dr';

export function isReportItem(item: Item): boolean {
    if (item) {
        return (
            item.ItemClass && item.ItemClass.toLowerCase().indexOf(REPORT_CLASS_NAME_PREFIX) == 0
        );
    } else {
        return false;
    }
}

export function isNDRItem(item: Item): boolean {
    if (item) {
        return item.ItemClass && item.ItemClass.toLowerCase().indexOf(NDR_CLASS_NAME) == 0;
    } else {
        return false;
    }
}

export function isDRItem(item: Item): boolean {
    if (item) {
        return item.ItemClass && item.ItemClass.toLowerCase().indexOf(DR_CLASS_NAME) == 0;
    } else {
        return false;
    }
}
