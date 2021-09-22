import type Message from 'owa-service/lib/contract/Message';
import type { FromViewState } from 'owa-mail-compose-store/lib/store/schema/FromViewState';
import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import isPrimarySmtp from 'owa-mail-proxy-address/lib/utils/isPrimarySmtp';

const ORIGINAL_STMP_FROM_ADDRESS_PROPERTY_NAME =
    'X-MS-Exchange-Organization-ClientSubmitSmtp-OriginalFrom';

export default function stampOrginalSmtpFromAddress(fromViewState: FromViewState, item: Message) {
    const fromAddress = fromViewState?.from?.email?.EmailAddress;
    if (fromAddress && !isPrimarySmtp(fromAddress)) {
        const extendedProperty = extendedPropertyType({
            ExtendedFieldURI: extendedPropertyUri({
                PropertyName: ORIGINAL_STMP_FROM_ADDRESS_PROPERTY_NAME,
                DistinguishedPropertySetId: 'InternetHeaders',
                PropertyType: 'String',
            }),
            Value: fromAddress,
        });

        if (item.ExtendedProperty) {
            item.ExtendedProperty.push(extendedProperty);
        } else {
            item.ExtendedProperty = [extendedProperty];
        }
    }
}
