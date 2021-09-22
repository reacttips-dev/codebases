import CatalogModel from 'bundles/catalogP/models/catalogModel';

const S12nProgress = CatalogModel.extend({
  fields: ['userId', 's12nId', 'lastActiveCourseId', 'lastActiveAt', 'certificateMetadata'],

  resourceName: 'onDemandSpecializationProgress.v1',
});

export default S12nProgress;
