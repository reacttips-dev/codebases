import { OutlookMobileContainer } from '../utils/OutlookMobileContainer';
import { getOpxHostApp } from 'owa-config';
import { getHostname } from './getHostname';

export function getMobileContainerName(containerNameParam: OutlookMobileContainer): string {
    let containerName = containerNameParam.toString();
    if (containerNameParam === OutlookMobileContainer.OpxHost) {
        containerName = 'opx_' + getOpxHostApp();
    } else if (containerNameParam === OutlookMobileContainer.ExternalPartner) {
        containerName = 'externalpartner_' + getHostname();
    }
    return containerName;
}
