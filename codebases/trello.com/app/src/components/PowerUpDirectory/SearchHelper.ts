import _ from 'underscore';
import TrelloMarkdown from '@atlassian/trello-markdown';
import {
  getIndex,
  getNameIndex,
  stemming,
  encoder,
} from 'app/src/components/Navigation/SearchUtils';
import { Plugins } from './types';

// eslint-disable-next-line @trello/no-module-logic
const searchNameIndex = getNameIndex();
// eslint-disable-next-line @trello/no-module-logic
const searchIndex = getIndex();

export const createSearchIndex = (plugins: Plugins) => {
  const markdown = new TrelloMarkdown();

  // FlexSearch's documentation indicates that calling .init() without any
  // options re-inits with the original options used. That isn't the case. To
  // reinit, we must explicitly pass in options again.
  searchIndex.init({
    encode: encoder,
    split: /\s+/,
    stemmer: stemming,
    tokenize: 'full',
  });
  searchNameIndex.init({
    encode: encoder,
    split: /\s+/,
    stemmer: stemming,
    tokenize: 'full',
  });

  plugins.forEach((plugin) => {
    if (!plugin.listing) {
      return;
    }
    if (plugin.listing.name) {
      searchNameIndex.add(plugin.id, plugin.listing.name);
    }
    if (plugin.listing.description || plugin.listing.overview) {
      const body = [
        markdown.text(plugin.listing.overview || '').output,
        markdown.text(plugin.listing.description || '').output,
      ].join(' ');
      searchIndex.add(plugin.id, body);
    }
  });

  return {
    search(query: string) {
      const nameResults = searchNameIndex.search(query, 5);
      const bodyResults = searchIndex.search(query, 25);
      return _.uniq(nameResults.concat(bodyResults))
        .map((idPlugin: string) =>
          plugins.find((plugin) => plugin.id === idPlugin),
        )
        .filter(<T>(plugin?: T): plugin is T => Boolean(plugin));
    },
  };
};

export const SearchHelper = {
  createSearchIndex,
};
