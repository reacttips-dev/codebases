export function* itemRotation<T>(items: T[]): Generator<T> {
  let i = 0;
  while (true) {
    yield items[i % items.length];
    i++;
  }
}
