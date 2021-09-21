import { getApiUrl } from '../../../Url';

export type FetchUserParameters = {
  currentUserId: number;
};

export type FetchUserResponse = {
  account: {
    emailAddress: string;
    name: string;
    socialUrls: any;
    userWebsite: string;
    vanitySlug: string;
  };
  podcast: {
    language: string;
    podcastIsExplicit: boolean;
    podcastCategory: string;
    podcastDescription: string;
    podcastName: string;
  };
};

export async function fetchUser({
  currentUserId,
}: FetchUserParameters): Promise<FetchUserResponse> {
  try {
    const response = await fetch(
      getApiUrl({
        path: `settings/user`,
        queryParameters: { userId: currentUserId },
      }),
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Could not fetch user`);
  } catch (err) {
    throw new Error(err.message);
  }
}
