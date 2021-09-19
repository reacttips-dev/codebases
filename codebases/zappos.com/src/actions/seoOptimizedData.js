import { isSeoDataAvailable } from 'helpers/SeoOptimizedDataHelper';

const prepareEmptySeoOptimizedData = () => ({
  optimizedH1Tag: undefined,
  optimizedTitleTag: undefined,
  optimizedMetaDescription: undefined,
  optimizedSeoCopy: undefined
});

const prepareSeoOptimizedData = ({ optimizedH1Tag = '', optimizedTitleTag = '', optimizedMetaDescription = '', optimizedSeoCopy = '' }) => ({
  optimizedH1Tag,
  optimizedTitleTag,
  optimizedMetaDescription,
  optimizedSeoCopy
});

export function generateSeoOptimizedData(response) {
  if (isSeoDataAvailable(response)) {
    return prepareSeoOptimizedData(response.seoData);
  }
  return prepareEmptySeoOptimizedData();
}
