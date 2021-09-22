export default function parseGroupProxyAddress(groupProxyAddress: string): string {
    return groupProxyAddress.match(/([^smtp:]|[^SMTP:])*$/g)[0];
}
