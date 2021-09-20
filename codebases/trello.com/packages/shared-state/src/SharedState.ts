interface Updater<Value> {
  (value: Value): Value;
}

interface Listener<Value> {
  (value: Value): void;
}

function isUpdater<Value>(value: unknown): value is Updater<Value> {
  return typeof value === 'function';
}

// Stolen from `app/scripts/lib/util/is-plain-object.coffee`
// and should be extracted to a package in the future
function isPartialValue<Value>(value: unknown): value is Partial<Value> {
  // eslint-disable-next-line eqeqeq
  if (value == null || typeof value !== 'object') {
    return false;
  }

  return [null, Object.prototype].includes(Object.getPrototypeOf(value));
}

export class SharedState<Value> {
  value: Value;

  #initialValue: Value;
  #listeners: Set<Listener<Value>> = new Set();

  constructor(initialValue: Value) {
    this.value = initialValue;
    this.#initialValue = initialValue;
  }

  setValue(nextValue: Value | Partial<Value> | Updater<Value>): void {
    if (isUpdater(nextValue)) {
      this.value = nextValue(this.value) as Value;
    } else if (isPartialValue(nextValue)) {
      // eslint-disable-next-line prefer-object-spread
      this.value = Object.assign({}, this.value, nextValue);
    } else {
      this.value = nextValue;
    }

    for (const listener of this.#listeners) {
      listener(this.value);
    }
  }

  subscribe(listener: Listener<Value>): () => void {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);
    };
  }

  /* For testing purposes only. DO NOT USE IN APPLICATION CODE. */
  reset() {
    this.value = this.#initialValue;
    this.#listeners = new Set();
  }
}
