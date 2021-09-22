import _extends from "@babel/runtime/helpers/esm/extends";
export default function inherits(ctor, superCtor, spec) {
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  _extends(ctor.prototype, spec);
}