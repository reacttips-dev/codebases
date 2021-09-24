export const stackDecision = {
  StackDecision: {
    deleted: () => false
  }
};

export const siteSearch = searchIndex => ({
  siteSearch: async (_, {keyword}) => {
    const results = await searchIndex.search({
      query: keyword,
      attributesToRetrieve: [
        'type',
        'name',
        'username',
        'canonical_url',
        'title',
        'image_url',
        'objectID'
      ],
      hitsPerPage: 10,
      facets: '*'
    });
    return results.hits.map(
      ({
        type,
        name = null,
        username = null,
        title = null,
        canonical_url = null,
        image_url = null,
        objectID
      }) => ({
        type: type,
        id: objectID,
        name,
        username,
        title,
        canonicalUrl: canonical_url,
        imageUrl: image_url,
        __typename: `SiteSearcResult`
      })
    );
  }
});

// NOTE: this index does not provide `slug`, so canonical_url is used to derive the slug since the url is derived from the slug.
// FUTURE: migrate this index to use Services_production
export const toolSearch = searchIndex => ({
  toolSearch: async (_, {keyword}) => {
    const results = await searchIndex.search({
      query: keyword,
      filters: 'type:Service AND is_approved = 1',
      attributesToRetrieve: ['name', 'image_url', 'objectID', 'canonical_url', 'slug'],
      hitsPerPage: 10
    });
    return results.hits.map(({name, image_url, objectID, canonical_url}) => ({
      id: objectID.substr('Service_'.length),
      name,
      display: name,
      title: name,
      slug: canonical_url.slice(1),
      imageUrl: image_url,
      __typename: 'ServiceSearchResult'
    }));
  }
});

export const topicSearch = topicIndex => ({
  topicSearch: async (_, {keyword}) => {
    const results = await topicIndex.search({
      query: keyword,
      attributesToRetrieve: ['name', 'objectID'],
      hitsPerPage: 10
    });
    let hits = results.hits.map(({name, objectID}) => ({
      id: objectID,
      name,
      display: `#${name}`,
      title: `#${name}`,
      __typename: 'TopicSearchResult'
    }));
    if (!hits.find(o => o.name === keyword)) {
      const name = keyword;
      hits.unshift({
        id: name,
        name,
        display: `#${name}`,
        title: `#${name}`,
        __typename: 'TopicSearchResult'
      });
    }
    return hits;
  }
});

export const companySearch = searchIndex => ({
  companySearch: async (_, {keyword}) => {
    const results = await searchIndex.search({
      query: keyword,
      filters: 'type:Company',
      attributesToRetrieve: ['name', 'image_url', 'objectID', 'slug'],
      hitsPerPage: 10
    });
    return results.hits.map(({name, image_url, objectID, slug}) => ({
      id: objectID.substr('Company_'.length),
      name,
      imageUrl: image_url,
      slug,
      __typename: 'CompanySearchResult'
    }));
  }
});

export const companyApiSearch = companyApiIndex => {
  return {
    companyApiSearch: async (_, {keyword}) => {
      const results = await companyApiIndex.search({
        query: keyword,
        attributesToRetrieve: ['name', 'icon_url', 'objectID', 'domain'],
        hitsPerPage: 10
      });
      return results.hits.map(({name, icon_url, objectID, domain}) => ({
        id: objectID.substr('Company_'.length),
        name,
        imageUrl: icon_url,
        domain,
        type: 'company',
        __typename: 'CompanyApiSearchResult'
      }));
    }
  };
};

export const toolApiSearch = toolApiIndex => ({
  toolApiSearch: async (_, {keyword}) => {
    const results = await toolApiIndex.search({
      query: keyword,
      attributesToRetrieve: ['name', 'objectID', 'slug', 'icon_url'],
      hitsPerPage: 10
    });
    return results.hits.map(({name, objectID, slug, icon_url}) => ({
      id: objectID.substr('Tool_'.length),
      name,
      slug,
      imageUrl: icon_url,
      type: 'tool',
      __typename: 'ToolApiSearchResult'
    }));
  }
});
