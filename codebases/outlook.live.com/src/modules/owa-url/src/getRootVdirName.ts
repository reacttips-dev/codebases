import { getHostLocation } from './hostLocation';

export default function getRootVdirName(): string | null {
    const pathname = getHostLocation()?.pathname;
    if (pathname) {
        let subPaths = pathname.split('/').filter(part => !!part);
        return subPaths[0] ? subPaths[0].toLowerCase() : null;
    }
    return null;
}
