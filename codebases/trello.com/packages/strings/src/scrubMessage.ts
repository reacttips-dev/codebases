interface PersonallyIdentifiableInformationMatcher {
  // This is what we will pass into String.match()
  match: string | RegExp;
  // This is what we will return in place of a matched message
  replacement: string;
}

const PiiMessageProtection = '[Redacted]';

/**
 * Set of known error message patterns
 */
export const messagePatterns: Record<
  string,
  PersonallyIdentifiableInformationMatcher
> = {
  HTML_PAGE: {
    match: new RegExp(/<(?:!DOCTYPE|html)/),
    replacement: PiiMessageProtection,
  },
  INVALID_URL: {
    match: `Unable to open a window with invalid URL`,
    replacement: `SyntaxError: Failed to execute 'open' on 'Window': Unable to open a window with invalid URL <REDACTED_URL>`,
  },
  EMAIL: {
    match: new RegExp('([a-zA-Z0-9_.-]+)@([da-zA-Z.-]+).([a-zA-Z.]{2,6})'),
    replacement: PiiMessageProtection,
  },
};

export const scrubMessage = (message: string) => {
  let msg = message;
  for (const value of Object.values(messagePatterns)) {
    const { match, replacement } = value;
    if (message.match(match)) {
      msg = replacement;
    }
  }

  return msg;
};
