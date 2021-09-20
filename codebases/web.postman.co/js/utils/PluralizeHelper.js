class PluralizeHelper {
  constructor () {
  }

  pluralize ({ count = 1, singular = '', plural = '' }) {
    if (count === 1) {
      return singular;
    }
    else {
      return plural;
    }
  }
}

export default new PluralizeHelper();
