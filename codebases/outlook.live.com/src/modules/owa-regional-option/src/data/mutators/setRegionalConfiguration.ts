import type CultureInfoData from 'owa-service/lib/contract/CultureInfoData';
import { mutatorAction } from 'satcheljs';
import getRegionalOptions from '../store/store';

export default mutatorAction(
    'setRegionalConfiguration',
    function setRegionalConfiguration(
        supportedCultures: CultureInfoData[],
        supportedShortDateFormats: string[],
        supportedShortTimeFormats: string[]
    ) {
        let regionalOptions = getRegionalOptions();
        regionalOptions.supportedCultures = supportedCultures;
        regionalOptions.supportedShortDateFormats = supportedShortDateFormats;
        regionalOptions.supportedShortTimeFormats = supportedShortTimeFormats;
    }
);
