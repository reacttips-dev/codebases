import { CmlContent } from 'bundles/cml/types/Content';
import NaptimeResource from 'bundles/naptimejs/resources/NaptimeResource';
import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';

// The key and value for this enum was chosen to be consistent with the [[CourseType]] BE model
export enum CourseType {
  STANDARD_COURSE = 'standardCourse',
  RHYME_PROJECT = 'rhymeProject',
}

export type StandardCourseMetadata = {
  typeNameIndex: CourseType.STANDARD_COURSE;
};

export type RhymeProjectMetadata = {
  typeNameIndex: CourseType.RHYME_PROJECT;
  tasks?: Array<CmlContent>;
  screenshotUrls?: Array<string>;
};

export type CourseTypeMetadata = {
  typeName: CourseType;
  definition: StandardCourseMetadata | RhymeProjectMetadata | {};
};

export type CourseTypeMetadataResponse = {
  courseTypeMetadata: CourseTypeMetadata;
  version: number;
  id: string;
};

export type CourseTypeMetadataUpdate = {
  courseTypeMetadata: {
    typeName: CourseType;
    definition: StandardCourseMetadata | RhymeProjectMetadata;
  };
  nextVersion: number;
};

class CourseTypeMetadataV1 extends NaptimeResource {
  static RESOURCE_NAME = 'courseTypeMetadata.v1';

  courseTypeMetadata!: CourseTypeMetadata;

  version!: number;

  id!: string;

  static courseTypeMetadatas(courseIds: Array<string>, required = false) {
    return CourseTypeMetadataV1.multiGet(courseIds, {
      fields: ['courseTypeMetadata'],
      required,
    });
  }

  @requireFields('courseTypeMetadata')
  get isGuidedProject(): boolean {
    return this.courseTypeMetadata.typeName === CourseType.RHYME_PROJECT;
  }
}

export default CourseTypeMetadataV1;
