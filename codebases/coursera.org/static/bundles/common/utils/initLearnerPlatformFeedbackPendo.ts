import { getShouldLoadRaven } from 'js/lib/sentry';
import raven from 'raven-js';
import pendo, { LEARNER_API_KEY } from 'js/lib/pendo';
import user from 'js/lib/user';

const initLearnerPlatformFeedbackPendo = () => {
  try {
    const { external_id: externalId, is_staff: isStaff, is_superuser: isSuperuser } = user.get();

    pendo.init(
      {
        visitor: {
          id: externalId,
          isStaff,
          isSuperuser,
        },
      },
      LEARNER_API_KEY
    );
  } catch (error) {
    if (getShouldLoadRaven()) {
      raven.captureException(error);
    }
  }
};

export default initLearnerPlatformFeedbackPendo;
