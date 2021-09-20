export interface MockKeyboardEvent extends KeyboardEvent {
  _target: HTMLElement | null;
}

export interface MockKeyboardEventInit extends KeyboardEventInit {
  target?: HTMLElement;
}

// Subclass KeyboardEvent for tests so we can set the target on
// instantiation and make them cancelable by default
export class MockKeyboardEvent extends KeyboardEvent {
  constructor(key: string, dict: MockKeyboardEventInit) {
    const { target = null, ...original } = dict;
    const init = { ...original, ...{ cancelable: true } };
    super(key, init);
    this._target = target;
  }

  get target() {
    return this._target;
  }

  set target(val) {
    this._target = val;
  }
}
