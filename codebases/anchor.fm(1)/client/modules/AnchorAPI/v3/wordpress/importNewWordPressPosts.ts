type ImportNewWordPressPostsParams = {
  webStationId: string;
};

export type ImportNewWordPressPostsResponse = {
  importPostCount: number;
};

export async function importNewWordPressPosts({
  webStationId,
}: ImportNewWordPressPostsParams): Promise<ImportNewWordPressPostsResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/wordpress/webStationId:${webStationId}/posts/import`,
      {
        method: 'POST',
        headers: new Headers({ 'Content-type': 'application/json' }),
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to import new WordPress posts');
  } catch (err) {
    throw new Error(err.message);
  }
}
