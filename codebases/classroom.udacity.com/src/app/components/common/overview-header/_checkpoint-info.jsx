import { Icon } from '@udacity/veritas-components';
import PropTypes from 'prop-types';
import Svg from 'react-inlinesvg';
import { __ } from 'services/localization-service';
import styles from './index.scss';

@cssModule(styles)
export default class PartInfo extends React.Component {
  static displayName = 'common/overview-header/_checkpoint-info';

  static propTypes = {
    icon: PropTypes.oneOf(['complete', 'error', 'certificate']),
    title: PropTypes.string.isRequired,
    button: PropTypes.element,
    deadlineBar: PropTypes.element.isRequired,
    isHeaderCollapsed: PropTypes.bool,
  };

  static defaultProps = {
    icon: '',
    button: null,
    isHeaderCollapsed: false,
  };

  // (dcwither) we have to set the class deeply because compose doesn't work for nested classes
  _getStyleWithSuffix(styleName) {
    const { isHeaderCollapsed } = this.props;
    if (isHeaderCollapsed) {
      return `${styleName}-small`;
    } else {
      return styleName;
    }
  }

  render() {
    const { icon, deadlineBar, title, button } = this.props;

    return (
      <div styleName="container">
        <div styleName={this._getStyleWithSuffix('lesson-info')}>
          <div styleName="status-info">
            {icon ? (
              <span styleName={icon}>
                <Icon size="lg" title={__('Certificate')}>
                  <Svg src={icon} />
                </Icon>
              </span>
            ) : null}
            <h3 styleName={this._getStyleWithSuffix('lesson-title')}>
              {title}
            </h3>
          </div>
          {button}
        </div>
        <div styleName={this._getStyleWithSuffix('deadline-bar')}>
          {deadlineBar}
        </div>
      </div>
    );
  }
}
