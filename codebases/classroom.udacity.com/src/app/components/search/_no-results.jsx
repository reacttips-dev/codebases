import ClassroomPropTypes from 'components/prop-types';
import { IconMegaphone } from '@udacity/veritas-icons';
import KnowledgePlaceholder from 'components/common/knowledge-placeholder';
import { __ } from 'services/localization-service';
import styles from './_no-results.scss';

@cssModule(styles)
export default class NoResults extends React.Component {
  static displayName = 'search/_no-results';

  static propTypes = {
    nanodegree: ClassroomPropTypes.nanodegree.isRequired,
  };

  _renderSuggestionsWithKnowledge = () => (
    <li>
      {__("If you're looking for help we suggest trying:")}
      <ul>
        <li>
          <a href={CONFIG.knowledgeWebUrl}>{__('Udacity Knowledge')}</a>
        </li>
        <li>{__('or sites like Google, Stack Overflow, or Quora for help')}</li>
      </ul>
    </li>
  );

  _renderSuggestions() {
    <li>
      {__(
        "If you're looking for help we suggest trying sites like Google, Stack Overflow, or Quora for help"
      )}
    </li>;
  }

  render() {
    const { nanodegree } = this.props;
    return (
      <div styleName="no-results">
        <h3>{__('No results found.')}</h3>
        <h5>
          <span styleName="glyph">
            <IconMegaphone title={__('Tip')} />
          </span>{' '}
          {__('Tip')}
        </h5>
        <ul>
          <li>
            {__(
              'Try searching different keywords or making your search terms less specific'
            )}
          </li>
          <KnowledgePlaceholder
            root={nanodegree}
            placeholder={this._renderSuggestions()}
          >
            {this._renderSuggestionsWithKnowledge()}
          </KnowledgePlaceholder>
        </ul>
      </div>
    );
  }
}
