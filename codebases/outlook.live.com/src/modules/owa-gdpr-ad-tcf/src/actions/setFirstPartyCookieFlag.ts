import { action } from 'satcheljs';

export default action('Set_FirstPartyCookie_Flag', (firstPartyCookieFlag: number) => {
    return {
        firstPartyCookieFlag,
    };
});
