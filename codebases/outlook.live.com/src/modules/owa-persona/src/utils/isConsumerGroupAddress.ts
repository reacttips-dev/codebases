import endsWith from 'lodash-es/endsWith';

export default function isConsumerGroupAddress(smtpAddress: string): boolean {
    return endsWith(smtpAddress, '@groups.outlook.com');
}
