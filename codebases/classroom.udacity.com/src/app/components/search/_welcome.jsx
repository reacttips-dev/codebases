import ClassroomPropTypes from 'components/prop-types';
import KnowledgePlaceholder from 'components/common/knowledge-placeholder';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import styles from './_welcome.scss';

@cssModule(styles)
export default class Welcome extends React.Component {
  static displayName = 'search/_welcome';

  static propTypes = {
    nanodegree: ClassroomPropTypes.nanodegree.isRequired,
    recentSearches: PropTypes.arrayOf(PropTypes.string),
    onRecentSearchClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    recentSearches: [],
  };

  _renderRecentSearches() {
    const { recentSearches, onRecentSearchClick } = this.props;

    return (
      <div>
        <h6>{__('Your recent searches')}</h6>
        <ul styleName="recent-search-list">
          {_.map(recentSearches, (searchTerm, idx) => (
            <li styleName="search-term" key={idx}>
              <button onClick={() => onRecentSearchClick(searchTerm)}>
                {searchTerm}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  _renderWelcomeMessage() {
    return (
      <div>
        <h2>{__('Welcome to search')}</h2>
        <p>
          {__(
            'Look through concepts, quizzes, videos, and images of this program for the information you need.'
          )}
        </p>
      </div>
    );
  }

  render() {
    const { recentSearches, nanodegree } = this.props;

    return (
      <div styleName="welcome">
        {_.get(recentSearches, 'length')
          ? this._renderRecentSearches()
          : this._renderWelcomeMessage()}
        <KnowledgePlaceholder root={nanodegree} placeholder={null}>
          <div styleName="question">
            <h3>{__('Have questions and looking for answers?')}</h3>
            <p>
              {__(
                'We suggest using <a href=<%= knowledgeWebUrl %>>Udacity Knowledge</a> - our student-driven help experience.',
                { knowledgeWebUrl: CONFIG.knowledgeWebUrl },
                { renderHTML: true }
              )}
            </p>
          </div>
        </KnowledgePlaceholder>
      </div>
    );
  }
}
