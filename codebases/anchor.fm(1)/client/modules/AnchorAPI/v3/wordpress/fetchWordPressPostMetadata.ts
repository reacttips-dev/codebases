import queryString from 'query-string';

export type FetchWordPressPostMetadataParams = {
  webStationId: string;
  postMetadataId: string;
  isContentIncluded?: boolean;
  isSiteMetadataIncluded?: boolean;
};

export enum WORDPRESS_POST_ERRORS {
  UNKNOWN,
  UNAUTHORIZED,
  NOT_FOUND,
  UNABLE_TO_CREATE_API,
  CONTENT_TOO_LONG,
}

type WordPressPost = {
  postId: string;
  postDate: string;
  created: Date;
  modified: Date;
  content: string | null;
  errors?: WORDPRESS_POST_ERRORS[];
};

type WordPressSite = {
  siteId: string;
  siteUrl: string;
  siteTitle: string;
  siteDescription: string;
};

export type FetchWordPressPostMetadataResponse = {
  wordpresPostMetadataId: number;
  webStationId: string;
  post: WordPressPost;
  site: WordPressSite | null;
};

export async function fetchWordPressPostMetadata({
  webStationId,
  postMetadataId,
  isContentIncluded = false,
  isSiteMetadataIncluded = false,
}: FetchWordPressPostMetadataParams): Promise<
  FetchWordPressPostMetadataResponse
> {
  try {
    const url = queryString.stringifyUrl({
      url: `/api/proxy/v3/wordpress/webStationId:${webStationId}/posts/metadata/${postMetadataId}`,
      query: {
        isContentIncluded: isContentIncluded.toString(),
        isSiteMetadataIncluded: isSiteMetadataIncluded.toString(),
      },
    });
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to fetch WordPress post metadata.');
  } catch (err) {
    throw new Error(err.message);
  }
}
