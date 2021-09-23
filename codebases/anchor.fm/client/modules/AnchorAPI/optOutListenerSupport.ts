export async function optOutListenerSupport(userId: number) {
  try {
    const response = await fetch(
      '/api/proxy/v3/supporter/disableListenerSupport',
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          userId,
        }),
      }
    );
    if (!response.ok) {
      throw new Error('Could not opt out of listener support');
    }
  } catch (err) {
    // https://github.com/Microsoft/TypeScript/issues/20024
    throw new Error((err as Error).message);
  }
}
