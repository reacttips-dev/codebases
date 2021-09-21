type PodcastSubCategory = {
  value: string;
  display: string;
};

export type PodcastCategory = {
  value: string;
  display: string;
  subCategories: PodcastSubCategory[];
};

export type PodcastCategoriesResponse = {
  podcastCategoryOptions: PodcastCategory[];
};

async function fetchPodcastCategories(): Promise<PodcastCategoriesResponse> {
  try {
    const response = await fetch(
      '/api/proxy/v3/settings/podcast-category/options',
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Could not fetch podcast categories`);
  } catch (err) {
    throw new Error(err.message);
  }
}

export { fetchPodcastCategories };
