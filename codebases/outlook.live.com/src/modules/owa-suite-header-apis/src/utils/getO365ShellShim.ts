import type { IO365ShellShim } from '@suiteux/suiteux-shell';

export default function getO365ShellShim(): IO365ShellShim {
    return (window as any).O365Shell;
}
