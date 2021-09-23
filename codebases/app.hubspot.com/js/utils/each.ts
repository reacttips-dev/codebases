// TO FIX, remove uses of each
export default function each(iterable, func) {
  for (var i = 0; i < iterable.length; i++) {
    func(iterable[i]);
  }
}