export default function bindArg(func, bindValue) {
  return typeof func === 'function' ? function (arg) {
    return func(Object.assign({
      bindValue: bindValue
    }, arg));
  } : undefined;
}