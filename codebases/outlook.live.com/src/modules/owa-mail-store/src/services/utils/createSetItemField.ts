import message from 'owa-service/lib/factory/message';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import type SetItemField from 'owa-service/lib/contract/SetItemField';
import setItemField from 'owa-service/lib/factory/setItemField';

export default function createSetItemField(propertyUriStr: string, value: any): SetItemField {
    return setItemField({
        Path: propertyUri({ FieldURI: propertyUriStr }),
        Item: message({ [propertyUriStr]: value }),
    });
}
