import { compose, mapProps } from 'recompose';

import ClassroomPropTypes from 'components/prop-types';
import { PartLockedReason } from 'constants/part';
import PropTypes from 'prop-types';
import { ResultPropTypes } from './_search-result-card';
import SearchHelper from 'helpers/search-helper';
import SearchResultCard from './_search-result-card';

export const formatHighlights = (highlights) => _.join(highlights, '...');

export class SearchResults extends React.Component {
  static displayName = 'search/_results';

  static propTypes = {
    onNavigate: PropTypes.func.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape(ResultPropTypes)),
    parts: PropTypes.arrayOf(ClassroomPropTypes.Part),
  };

  render() {
    const { onNavigate, results } = this.props;

    return (
      <ul styleName="">
        {_.map(results, (result, idx) => (
          <SearchResultCard key={idx} {...result} onNavigate={onNavigate} />
        ))}
      </ul>
    );
  }
}

export const getHighlight = (result) => {
  const {
    part_title,
    part_title_highlights,
    lesson_title,
    lesson_title_highlights,
    concept_title_highlights,
    text_highlights,
  } = result;

  const showDescriptionHighlight = !_.isNil(text_highlights);
  const showConceptHighlight = !_.isNil(concept_title_highlights);

  switch (true) {
    case showDescriptionHighlight:
      return { description: formatHighlights(text_highlights) };
    case showConceptHighlight:
      return {
        title: formatHighlights(concept_title_highlights),
      };
    default:
      return {
        breadcrumbTitles: _.compact([
          formatHighlights(part_title_highlights) || part_title,
          formatHighlights(lesson_title_highlights) || lesson_title,
        ]),
      };
  }
};

function isResultPartLocked(parts, result) {
  const [{ part_key }] = result.root_node_paths;
  const part = _.find(parts, { key: part_key });

  // Won't have parts if it's in a nanodegree
  return !!part && part.locked_reason !== PartLockedReason.NOT_LOCKED;
}

export const getProps = ({ results, onNavigate, parts }) => {
  const transformedResultData = _.chain(results)
    .map((result) => {
      const {
        semantic_type: semanticType,
        part_title,
        lesson_title,
        concept_title,
        text_highlights,
        root_node_paths,
      } = result;

      return {
        title: concept_title,
        semanticType,
        breadcrumbTitles: _.compact([part_title, lesson_title]),
        description: formatHighlights(text_highlights),
        path: SearchHelper.constructRootNodePath(_.first(root_node_paths)),
        locked: isResultPartLocked(parts, result),
        ...getHighlight(result),
      };
    })
    .compact()
    .value();

  return {
    onNavigate,
    results: transformedResultData,
  };
};

export default compose(mapProps(getProps))(SearchResults);
