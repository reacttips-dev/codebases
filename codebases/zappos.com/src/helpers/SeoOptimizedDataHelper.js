const setIfNotUndefined = (value = '') => value;

export function isSeoDataAvailable({ seoData }) {
  if (seoData) {
    const { optimizedH1Tag, optimizedTitleTag, optimizedMetaDescription, optimizedSeoCopy } = seoData;
    if (optimizedH1Tag || optimizedTitleTag || optimizedMetaDescription || optimizedSeoCopy) {
      return true;
    }
  }

  return false;
}

export function retrieveSeoData(response) {
  return {
    copy: setIfNotUndefined(response.seoOptimizedData?.optimizedSeoCopy),
    h1Tag: retrieveH1Tag(response)
  };
}

export function retrieveTitleTag({ seoData, titleTag, seoOptimizedData }) {
  return setIfNotUndefined(seoOptimizedData?.optimizedTitleTag || seoData?.titleTag || titleTag);
}

function retrieveH1Tag({ seoData, honeTag, seoOptimizedData }) {
  return setIfNotUndefined(seoOptimizedData?.optimizedH1Tag || seoData?.honeTag || honeTag);
}

export function retrieveH1TagFromFilters({ honeTag, seoData }) {
  return setIfNotUndefined(seoData?.h1Tag || honeTag);
}

export function retrieveMetaInfo({ seoData, metaInfo, seoOptimizedData }) {
  const metaTags = metaInfo => (metaInfo || []).reduce((acc, { name, content }) => ({ ...acc, [name]: content }), {});
  const newMetaInfo = metaTags(seoData?.metaInfo || metaInfo);

  return seoOptimizedData?.optimizedMetaDescription ? { ...newMetaInfo, description: seoOptimizedData.optimizedMetaDescription } : newMetaInfo;
}
