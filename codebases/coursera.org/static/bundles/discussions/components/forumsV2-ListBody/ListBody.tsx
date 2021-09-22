import React from 'react';
import _t from 'i18n!nls/discussions';
import classNames from 'classnames';
import { loadingStates } from 'bundles/discussions/constants';
import 'css!./__styles__/ListBody';

type ListBodyProps = {
  loadingState: string;
  fossilized?: boolean;
  emptyStatePlaceholderText?: string;
};

export class ListBody extends React.Component<ListBodyProps> {
  static defaultProps = {
    children: [],
    fossilized: false,
    emptyStatePlaceholderText: '',
  };

  state = {
    transitionEnded: false,
  };

  private body: any;

  componentDidMount() {
    this.body.addEventListener('transitionend', () => {
      this.setState({ transitionEnded: true });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ transitionEnded: false });
  }

  render() {
    let body;
    const { loadingState, emptyStatePlaceholderText, children, fossilized } = this.props;
    const { transitionEnded } = this.state;
    if (loadingState === loadingStates.DONE && Array.isArray(children) && children?.length > 0) {
      body = <ol className="nostyle">{children}</ol>;
    } else if (loadingState === loadingStates.DONE && Array.isArray(children) && children?.length === 0) {
      body = <div className="message">{emptyStatePlaceholderText || _t('No Results')}</div>;
    } else if (loadingState === loadingStates.ERROR) {
      body = <div className="message">{_t('There was a problem, please reload the page and try again.')}</div>;
    } else if (loadingState === loadingStates.LOADING) {
      body = (
        <div className="message">
          <i className="cif-spinner cif-spin cif-2x" />
        </div>
      );
    } else {
      body = <div />;
    }

    const bodyClasses = classNames('rc-ForumsV2__ListBody', {
      'c-list-expanded': loadingState === loadingStates.DONE && Array.isArray(children) && children.length > 0,
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
