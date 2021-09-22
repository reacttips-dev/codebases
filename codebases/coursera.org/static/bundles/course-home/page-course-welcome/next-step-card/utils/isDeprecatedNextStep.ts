// we want to hide the next step card when any deprecated items are matched. this is a simple implementation for now.
export default function isDeprecatedNextStep(typeName: string) {
  return /placeholder/i.test(typeName);
}
