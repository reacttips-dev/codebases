export async function fetchPendingEmail(): Promise<{
  email: string;
}> {
  try {
    const response = await fetch(`/api/user/pendingemail`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not fetch pending user email`);
  } catch (err) {
    throw new Error(err.message);
  }
}
