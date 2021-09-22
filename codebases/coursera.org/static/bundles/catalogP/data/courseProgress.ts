import { memoizedCatalogData } from 'bundles/catalogP/api/api.promise';
import CourseProgress from 'bundles/catalogP/models/courseProgress';
import catalogUrl from 'bundles/catalogP/lib/catalogUrl';

export default function (options: $TSFixMe, memoizeOptions: $TSFixMe) {
  if (memoizeOptions && memoizeOptions.forceUpdate) {
    return memoizedCatalogData.force(catalogUrl.build(CourseProgress.prototype.resourceName, options));
  } else {
    return memoizedCatalogData(catalogUrl.build(CourseProgress.prototype.resourceName, options));
  }
}
