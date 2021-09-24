type Parameters = {
  code: string;
  userId: number;
};

export type UserVerificationState =
  | 'legacyOrSocialSignOnUser'
  | 'unverified'
  | 'verified'
  | 'verifiedEmailChangeRequested';

export async function verifyUserEmail(
  parameters: Parameters
): Promise<{ userVerificationState: UserVerificationState }> {
  try {
    const { code, userId } = parameters;
    const response = await fetch(`/api/user/verification/${code}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ userId }),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not verify user email using code ${code}`);
  } catch (err) {
    throw new Error(err.message);
  }
}
