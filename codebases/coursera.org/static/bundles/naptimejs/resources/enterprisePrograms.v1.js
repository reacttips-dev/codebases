import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import NaptimeResource from './NaptimeResource';

class EnterpriseProgram extends NaptimeResource {
  static RESOURCE_NAME = 'enterprisePrograms.v1';

  @requireFields('metadata')
  get name() {
    return this.metadata.name;
  }

  @requireFields('metadata')
  get programName() {
    return this.metadata.name;
  }

  @requireFields('metadata')
  get slug() {
    return this.metadata.slug;
  }

  @requireFields('metadata')
  get curriculumId() {
    return this.metadata.curriculumId;
  }

  @requireFields('metadata')
  get tagline() {
    return this.metadata.tagline;
  }

  @requireFields('metadata')
  get isArchived() {
    return !!this.metadata.endedAt;
  }
}

export default EnterpriseProgram;
