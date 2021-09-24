export type UserVerificationState =
  | 'verified'
  | 'unverified'
  | 'verifiedEmailChangeRequested'
  | 'legacyOrSocialSignOnUser';

export async function fetchUserVerificationState(): Promise<{
  userVerificationState: UserVerificationState;
  userId: number;
}> {
  try {
    const response = await fetch(`/api/user/verification/state`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    if (response.ok) {
      return response.json();
    }
    if (response.status === 401) {
      throw new Error('Not logged in');
    }
    throw new Error(`Could not fetch user verification state`);
  } catch (err) {
    throw new Error(err.message);
  }
}
