type Parameters = {
  userId: number;
};

export async function resendVerificationEmail(
  parameters: Parameters
): Promise<{ userId: number; requestId?: number }> {
  try {
    const response = await fetch(`/api/proxy/v3/resend_verification_email`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ userId: parameters.userId }),
    });
    if (response.ok) {
      return response.json().then(json => ({
        userId: parameters.userId,
        requestId: json.requestId,
      }));
    }
    if (response.status === 429) {
      return { userId: parameters.userId };
    }
    throw new Error(
      `Could not resend user verification email for user ${parameters.userId}`
    );
  } catch (err) {
    throw new Error(err.message);
  }
}
