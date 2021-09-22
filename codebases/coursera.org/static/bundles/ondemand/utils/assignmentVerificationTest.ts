/*
 * Helpers for replacing assignment verification with an honor code in certain courses. When the user accepts
 * the honor code, they will be automatically verified on the backend.
 */

import verifiableIdPromise from 'bundles/verification/promises/verifiableId';

import verificationProgressesPromise from 'bundles/verification/promises/verification';

/**
 * @returns {promise} A promise for the verifiable Id.
 */
export const fetchVerifiableId = (): Q.Promise<string> => {
  return verifiableIdPromise({}).then((data) => data.id);
};

export const verifyAssignment = (verifiableId: string, fullName?: string) => {
  // Upon receiving the below PUT to verificationProgresses, the backend will send back data
  // representing a successful verification.
  return verificationProgressesPromise(verifiableId, {
    data: {
      typeName: 'verificationRequest',
      definition: {
        requestBody: {
          skipVerification: true,
          ...(fullName && { fullName }),
        },
      },
    },
  });
};

/**
 * Given a verificationViewModel with a verifiableId, verifies the learner on the backend and triggers an event to
 * notify the frontend that verification is complete.
 */
export const verifyAssignmentWithViewModel = (verificationViewModel: $TSFixMe) => {
  verifyAssignment(verificationViewModel.get('verifiableId'))
    .then(() => {
      verificationViewModel.trigger('verificationComplete', {
        hasVerified: true,
      });
    })
    .done();
};

/**
 * Given a verificationViewModel for an assignment, generate a verifiableId for that assignment and
 * verify the assignment for the user.
 */
export const fetchVerifiableIdAndVerifyAssignment = (verificationViewModel: $TSFixMe) => {
  fetchVerifiableId()
    .then((verifiableId) => {
      verificationViewModel.set('verifiableId', verifiableId);
      return verificationViewModel;
    })
    .then(verifyAssignmentWithViewModel);
};
