type Parameters = {
  emailAddress: string;
};

export async function requestPasswordReset(
  parameters: Parameters
): Promise<Response> {
  try {
    return await fetch('/api/proxy/users/password/reset', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(parameters),
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
