/* eslint-disable import/no-default-export */
export default function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
