export function generateConsts(name: string) {
  return {
    REQUEST: `${name}.REQUEST`,
    SUCCESS: `${name}.SUCCESS`,
    FAILURE: `${name}.FAILURE`
  }
}
