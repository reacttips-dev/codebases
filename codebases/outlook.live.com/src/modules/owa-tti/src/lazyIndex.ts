import { getFirstConsistentlyInteractive } from 'tti-polyfill';

export function tti(): Promise<number> {
    return getFirstConsistentlyInteractive().catch(() => 0);
}
export { govern, enableGovernReport } from './ttiGovernor';
