import Q from 'q';
import API from 'bundles/phoenix/lib/apiWrapper';
import URI from 'jsuri';

const api = API('/api/onDemandLectureAssets.v1', { type: 'rest' });

const lectureAssetsApiUtils = {
  getLectureAssets(courseId, itemId) {
    const uri = new URI(`${courseId}~${itemId}`).addQueryParam('includes', 'openCourseAssets');
    return Q(api.get(uri.toString()));
  },
};

export default lectureAssetsApiUtils;

export const { getLectureAssets } = lectureAssetsApiUtils;
