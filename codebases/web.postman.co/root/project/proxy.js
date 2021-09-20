let proxy,
  target = () => proxy,
  handler = {
    get: (target, prop) => target.hasOwnProperty(prop) ? target[prop] : proxy
  };
target[Symbol.toPrimitive] = (hint) => {
  switch (hint) {
    case 'number': return 1;
    case 'string': return '[PROXY]';
    default: return true;
  }
};

module.exports = proxy = new Proxy(target, handler);
