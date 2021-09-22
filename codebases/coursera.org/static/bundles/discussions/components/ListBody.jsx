import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import classNames from 'classnames';
import { loadingStates } from 'bundles/discussions/constants';
import 'css!./__styles__/ListBody';

class ListBody extends React.Component {
  static propTypes = {
    loadingState: PropTypes.string.isRequired,
    children: PropTypes.array,
    fossilized: PropTypes.bool,
    emptyStatePlaceholderText: PropTypes.string,
  };

  static defaultProps = {
    children: [],
    fossilized: false,
    get emptyStatePlaceholderText() {
      return _t('No Results');
    },
  };

  state = {
    transitionEnded: false,
  };

  componentDidMount() {
    this.body.addEventListener(
      'transitionend',
      function (e) {
        this.setState({ transitionEnded: true });
      }.bind(this)
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ transitionEnded: false });
  }

  render() {
    let body;
    const { loadingState, emptyStatePlaceholderText, children, fossilized } = this.props;
    const { transitionEnded } = this.state;
    if (loadingState === loadingStates.DONE && children.length > 0) {
      body = <ol className="nostyle">{children}</ol>;
    } else if (loadingState === loadingStates.DONE && children.length === 0) {
      body = (
        <div role="status" aria-live="polite" className="message">
          {emptyStatePlaceholderText}
        </div>
      );
    } else if (loadingState === loadingStates.ERROR) {
      body = (
        <div role="status" aria-live="polite" className="message">
          {_t('There was a problem, please reload the page and try again.')}
        </div>
      );
    } else if (loadingState === loadingStates.LOADING) {
      body = (
        <div className="message">
          <i className="cif-spinner cif-spin cif-2x" />
        </div>
      );
    } else {
      body = <div />;
    }

    const bodyClasses = classNames('rc-ListBody', {
      'c-list-expanded': loadingState === loadingStates.DONE && children.length > 0,
      'c-post-transition': transitionEnded,
    });

    const fossilClasses = classNames('c-pre-fossil', {
      'c-fossilized': fossilized,
    });
    return (
      <div
        className={bodyClasses}
        ref={(listBody) => {
          this.body = listBody;
        }}
      >
        <div className={fossilClasses} />
        {body}
      </div>
    );
  }
}

export default ListBody;
