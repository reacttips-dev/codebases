import { action } from 'satcheljs';

export default action('UPDATE_WEBPUSH_OPTIONS', (enabled: boolean, enabledTimeInUTCMs: string) => ({
    enabled,
    enabledTimeInUTCMs,
}));
