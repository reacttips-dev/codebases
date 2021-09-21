export type NetworkRoleObject = {
  networkRole: NetworkRole;
  networkRoleUserId: number | null;
};

export type NetworkRole = 'admin' | 'member' | null;

export async function fetchCurrentUserPodcastNetwork(): Promise<
  NetworkRoleObject
> {
  try {
    const response = await fetch('/api/currentnetwork', {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to fetch current user podcast network');
  } catch (err) {
    throw new Error(err.message);
  }
}
