import $ from 'jquery';
import PropTypes from 'prop-types';
import React from 'react';
import loadSelectize from 'lazy!selectize';
import 'css!bundles/vendor/selectize/styles/selectize';
import 'css!bundles/vendor/selectize/styles/selectize.bootstrap3';

class SelectizeTokenizer extends React.Component {
  static propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    selectizeOptions: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  componentDidMount() {
    loadSelectize(() => {
      $(this.select).selectize({
        ...this.props.selectizeOptions,
        onChange: this.props.onChange,
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <div className="rc-SelectizeTokenizer">
        <input type="text" ref={(ref) => (this.select = ref)} />
      </div>
    );
  }
}

export default SelectizeTokenizer;
