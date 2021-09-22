/* this function uses type predicates to filter out null and undefined values from arrays.
  This is needed because some element types returned by our apollo codegen include null
  e.g. Array<WorkspaceImages_WorkspaceImageAuthoringDataV1Resource_course_elements | null>

  This ensures that the final type is Array<WorkspaceImages_WorkspaceImageAuthoringDataV1Resource_course_elements>
  without using type assertions. The typescript engine is currently unable to infer this itself.

  There's a thread on this here, https://github.com/microsoft/TypeScript/issues/16069.

  https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates
*/
export function removeNullableValues<T extends {}>(value: T | null | undefined): value is NonNullable<T> {
  return !!value;
}
