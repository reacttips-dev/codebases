import { action } from 'satcheljs';

export default action('Set_Gdpr_Tcf_String', (tcfString: string) => {
    return {
        tcfString,
    };
});
