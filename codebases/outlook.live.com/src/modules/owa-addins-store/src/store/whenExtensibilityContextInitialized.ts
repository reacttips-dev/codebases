import isExtensibilityContextInitialized from './isExtensibilityContextInitialized';
import { when } from 'mobx';

export default function whenExtensibilityContextInitialized(delegate: () => void): void {
    if (isExtensibilityContextInitialized()) {
        delegate();
    } else {
        when(isExtensibilityContextInitialized, delegate);
    }
}
