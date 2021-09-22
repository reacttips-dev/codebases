import { getClientVersion } from './bootstrapOptions';

export default function doesBuildMatch(matchStrings: string[] | undefined): boolean {
    const currentBuild = getClientVersion();
    return !!matchStrings?.some(s => {
        const reg = new RegExp(`^${s}$`);
        return reg.test(currentBuild);
    });
}
