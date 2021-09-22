import { getCdnUrl, getBackupCdnUrl } from 'owa-config';

let count: number = 1;

// Use this to spread traffic between primary and backup CDNs
export default function getCDNIconUrl(icon: string): string {
    const url = count++ % 2 ? getCdnUrl() : getBackupCdnUrl();

    return `https:${url}assets/mail/file-icon/png/${icon}.png`;
}
