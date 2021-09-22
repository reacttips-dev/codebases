import { getDelegationTokenForOwa } from 'owa-tokenprovider';

export default function getTokenForImageApi(): Promise<string> {
    return getDelegationTokenForOwa('https://outlook.office.com/M365.Access');
}
