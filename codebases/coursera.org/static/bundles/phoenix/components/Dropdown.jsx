import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import Icon from 'bundles/iconfont/Icon';
import 'js/lib/popups';

class Dropdown extends React.Component {
  static propTypes = {
    dropdownId: PropTypes.string.isRequired,
    listItems: PropTypes.arrayOf(PropTypes.node).isRequired,
    dropdownDirection: PropTypes.string.isRequired,
    className: PropTypes.string,
    toggleClassName: PropTypes.string,
    iconClassName: PropTypes.string,
    iconName: PropTypes.string,
    label: PropTypes.string,
  };

  static defaultProps = {
    dropdownDirection: 'se',
  };

  sanitizeId(id) {
    return id.replace(/\W/g, '');
  }

  render() {
    const { dropdownId, label } = this.props;
    const toggleClassnames = classnames('nostyle', this.props.toggleClassName);
    const iconName = this.props.iconName || 'ellipsis-h';

    const sanitizedDropdownId = this.sanitizeId(dropdownId);

    return (
      <div className={this.props.className}>
        <div>
          <button
            aria-haspopup="true"
            aria-expanded="false"
            data-toggle="dropdown"
            aria-owns={sanitizedDropdownId}
            data-popup={`#${sanitizedDropdownId}`}
            data-popup-bind-open="click"
            data-popup-direction={this.props.dropdownDirection}
            data-popup-close="data-popup-close"
            className={toggleClassnames}
            aria-label={label}
            type="button"
          >
            <Icon name={iconName} className={this.props.iconClassName} />
          </button>
          <ul className="styleguide dropdown bt3-dropdown-menu" id={sanitizedDropdownId}>
            {this.props.listItems.map((item, index) => (
              <li key={`${sanitizedDropdownId}-listItem${index}`}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Dropdown;
