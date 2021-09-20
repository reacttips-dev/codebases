import React, { AnchorHTMLAttributes } from 'react';
import Url from 'url-parse';

export type KnownServiceRegexMatch = { [key in Url.URLPart]?: string | RegExp };

export interface KnownServiceComponentProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {}

export interface KnownService<T extends KnownServiceComponentProps> {
  match: KnownServiceRegexMatch;
  getMatchProps: (args: string[]) => T;
  Component: React.FunctionComponent<T> | React.ComponentClass<T>;
}

export const execMatch = (
  { match }: KnownService<KnownServiceComponentProps>,
  url: string,
) => {
  const parsed = new Url(url);
  let matchedValues = [parsed.href, parsed.pathname];

  let key: keyof KnownService<KnownServiceComponentProps>['match'];
  for (key in match) {
    const expected = match[key];

    if (typeof expected === 'string') {
      if (expected !== parsed[key]) {
        return null;
      }
    } else if (expected instanceof RegExp) {
      const regexp = parsed[key];
      const results = typeof regexp === 'string' ? expected.exec(regexp) : null;

      if (results !== null) {
        matchedValues = [...matchedValues, ...results.slice(1)];
      } else {
        return null;
      }
    } else {
      throw Error('Invalid specification');
    }
  }

  return matchedValues;
};
