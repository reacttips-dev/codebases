import config from 'pages/open-course/supplement/constants/config';
import NaptimeItemClient from 'pages/open-course/common/naptimeItemClient';

export default ({ itemId, courseId, courseSlug }) => {
  const naptimeClient = new NaptimeItemClient({ itemId, courseId, courseSlug });

  const args = {
    includes: ['asset'],
    fields: ['openCourseAssets.v1(typeName)', 'openCourseAssets.v1(definition)'],
  };

  return naptimeClient
    .getWithCourseItemId(config.supplementsApi, args)
    .then((response) => response.linked['openCourseAssets.v1'][0]);
};
