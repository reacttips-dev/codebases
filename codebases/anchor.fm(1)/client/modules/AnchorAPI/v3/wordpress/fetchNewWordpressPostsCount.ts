type FetchNewWordPressPostsCountParams = {
  webStationId: string;
};

export type FetchNewWordPressPostsCountResponse = {
  newPostCount: number;
};

export async function fetchNewWordPressPostsCount({
  webStationId,
}: FetchNewWordPressPostsCountParams): Promise<
  FetchNewWordPressPostsCountResponse
> {
  try {
    const response = await fetch(
      `/api/proxy/v3/wordpress/webStationId:${webStationId}/posts/new`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to fetch new WordPress posts count');
  } catch (err) {
    throw new Error(err.message);
  }
}
