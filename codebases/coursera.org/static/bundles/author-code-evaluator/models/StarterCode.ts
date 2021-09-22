class StarterCode {
  constructor({ expression = '', language = '' }) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'expression' does not exist on type 'Star... Remove this comment to see the full error message
    this.expression = expression;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'language' does not exist on type 'Starte... Remove this comment to see the full error message
    this.language = language;
  }

  toJSON() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'expression' does not exist on type 'Star... Remove this comment to see the full error message
    const { expression, language } = this;
    return { expression, language };
  }
}

export default StarterCode;
