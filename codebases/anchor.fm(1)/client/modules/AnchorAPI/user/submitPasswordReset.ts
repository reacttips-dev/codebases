type Parameters = {
  resetToken: string;
  password: string;
};

export async function submitPasswordReset(
  parameters: Parameters
): Promise<Response> {
  try {
    const { resetToken } = parameters;
    const response = await fetch(`/api/resetpassword/${resetToken}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(parameters),
    });
    if (response.ok) return response;
    throw new Error(`Could not submit password reset`);
  } catch (err) {
    throw new Error(err.message);
  }
}
