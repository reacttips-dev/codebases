import { IconCaretDown } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import TrackingLink from 'components/common/tracking-link';
import { __ } from 'services/localization-service';
import styles from './_section.scss';

@cssModule(styles)
export default class Section extends React.Component {
  static displayName = 'common/lesson-sidebar/_section';

  static propTypes = {
    content: PropTypes.node,
    icon: PropTypes.object,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    isExpanded: PropTypes.bool,
    expandSection: PropTypes.func,
  };

  static defaultProps = {
    content: null,
    icon: null,
    onClick: _.noop,
    isExpanded: false,
    expandSection: _.noop,
  };

  handleClick = () => {
    const { onClick, isExpanded, expandSection } = this.props;
    expandSection(!isExpanded);
    onClick();
  };

  _renderArrow() {
    const { content, isExpanded } = this.props;
    if (!_.isEmpty(content)) {
      return (
        <span styleName={isExpanded ? 'collapse' : 'expand'}>
          <IconCaretDown
            title={isExpanded ? __('Close') : __('Open')}
            size="sm"
          />
        </span>
      );
    }
  }

  _renderIcon = () => {
    const { icon } = this.props;

    return icon ? icon : this._renderArrow();
  };

  render() {
    const { title, content, isExpanded } = this.props;

    return (
      <div
        styleName={isExpanded ? 'section-selected' : 'section'}
        role="group"
        aria-expanded={isExpanded}
      >
        <TrackingLink
          href="#"
          onClick={this.handleClick}
          trackingEventName="Classroom Nav Clicked"
          trackingOptions={{ title }}
          aria-owns={isExpanded ? _.kebabCase('tree-' + title) : null}
          styleName={isExpanded ? 'header-expanded' : 'header'}
        >
          <h2>{title}</h2>
          {this._renderIcon()}
        </TrackingLink>
        {isExpanded ? (
          <div styleName="section-contents" id={_.kebabCase('tree-' + title)}>
            {content}
          </div>
        ) : null}
      </div>
    );
  }
}
