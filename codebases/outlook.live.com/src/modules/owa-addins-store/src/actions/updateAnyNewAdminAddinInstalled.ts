import extensibilityState from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'updateAnyNewAdminAddinInstalled',
    function updateAnyNewAdminAddinInstalled(anyNewAdminAddinInstalled: boolean) {
        extensibilityState.anyNewAdminAddinInstalled = anyNewAdminAddinInstalled;
    }
);
