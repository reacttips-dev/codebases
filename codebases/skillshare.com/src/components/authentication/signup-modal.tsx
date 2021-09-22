import React, { useEffect } from 'react';
import { TrackableEvents } from '../../shared';
import { useEventTracker } from '../../shared/hooks';
import { EmailSignUpModal } from './email-signup-modal';
import { SocialSignUpForm } from './social-signup-form';
export var SignUpModal = function (_a) {
    var isEmailSignUp = _a.isEmailSignUp, data = _a.data, redirectTo = _a.redirectTo;
    var trackEvent = useEventTracker().trackEvent;
    useEffect(function () {
        trackEvent(TrackableEvents.ViewedSignUp, { type: 'popup' });
    }, []);
    if (isEmailSignUp) {
        return React.createElement(EmailSignUpModal, { data: data, redirectTo: redirectTo });
    }
    return React.createElement(SocialSignUpForm, { data: data, redirectTo: redirectTo });
};
//# sourceMappingURL=signup-modal.js.map