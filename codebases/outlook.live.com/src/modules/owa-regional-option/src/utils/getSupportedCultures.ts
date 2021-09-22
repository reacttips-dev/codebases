import getRegionalOptions from '../data/store/store';
import type CultureInfoData from 'owa-service/lib/contract/CultureInfoData';

export default function getSupportedCultures(): CultureInfoData[] {
    const regionalOptions = getRegionalOptions();
    return regionalOptions?.supportedCultures;
}
