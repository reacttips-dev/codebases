import presenceStore from '../store/presenceStore';
import ChatSignInState from '../store/schema/ChatSignInState';

export default function isSignedIn(): boolean {
    return presenceStore.signInState == ChatSignInState.SignedIn;
}
