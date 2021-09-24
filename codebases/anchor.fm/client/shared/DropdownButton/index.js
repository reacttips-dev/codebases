import React from 'react';
import PropTypes from 'prop-types';
import BootstrapDropdownButton from 'react-bootstrap/lib/DropdownButton';
import classnames from 'classnames/bind';
// import '../../reset.sass';
import styles from './DropdownButton.sass';

const cx = classnames.bind(styles);

const noop = () => null;

const DropdownButton = ({
  items,
  renderItem,
  renderToggleButtonContent,
  onExpandDropdown,
  onSelectItem,
  menuHeight,
  className,
  toggleButtonClass,
  dropdownMenuClass,
}) => (
  <div
    className={cx({
      root: true,
      [className]: true,
    })}
  >
    <BootstrapDropdownButton
      id=""
      title={
        <div className={styles.dropdownToggleContent}>
          {renderToggleButtonContent()}
        </div>
      }
      className={cx({
        dropdownToggle: true,
        [toggleButtonClass]: true,
      })}
      onClick={onExpandDropdown}
    >
      <div
        className={cx({
          dropdownMenu: true,
          [dropdownMenuClass]: true,
        })}
        style={{
          maxHeight: menuHeight,
        }}
      >
        {items.map(item => (
          <div
            onClick={() => {
              onSelectItem(item);
            }}
          >
            <div className={styles.dropdownMenuItem}>{renderItem(item)}</div>
          </div>
        ))}
      </div>
    </BootstrapDropdownButton>
  </div>
);

DropdownButton.defaultProps = {
  items: [],
  menuHeight: 'none',
  onExpandDropdown: noop,
  onSelectItem: noop,
  className: '',
  toggleButtonClass: '',
  dropdownMenuClass: '',
};

DropdownButton.propTypes = {
  items: PropTypes.array,
  menuHeight: PropTypes.string,
  renderItem: PropTypes.func.isRequired,
  renderToggleButtonContent: PropTypes.func.isRequired,
  onExpandDropdown: PropTypes.func,
  onSelectItem: PropTypes.func,
  className: PropTypes.string,
  toggleButtonClass: PropTypes.string,
  dropdownMenuClass: PropTypes.string,
};

export default DropdownButton;
