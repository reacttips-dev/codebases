type CommandingViewActionSource = 'CommandBar' | 'SimplifiedRibbon' | 'MultiLineRibbon';

export default CommandingViewActionSource;

export function isCommandingViewActionSource(actionSource: string): boolean {
    return (
        actionSource === 'CommandBar' ||
        actionSource === 'SimplifiedRibbon' ||
        actionSource === 'MultiLineRibbon'
    );
}
