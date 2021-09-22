export type CourseTypeMetadata = {
  courseTypeMetadata: {
    __typename: string;
  };
};

export function isGuidedProject(courseTypeMetadata: CourseTypeMetadata | null | undefined) {
  return courseTypeMetadata?.courseTypeMetadata.__typename === 'CourseTypeMetadataV1_rhymeProjectMember';
}
