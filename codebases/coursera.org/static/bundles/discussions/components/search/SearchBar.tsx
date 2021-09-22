import * as React from 'react';
import PropTypes from 'prop-types';
import _t from 'i18n!nls/discussions';
import TrackedTextInput from 'bundles/page/components/TrackedTextInput';
import 'css!./__styles__/SearchBar';

type Props = {
  handleSubmit: () => void;
  handleChange: (x: string) => void;
  query: string;
  handleBlur: () => void;
  handleTab: (event: React.KeyboardEvent<HTMLElement>) => void;
  handleShiftTab: (event: React.KeyboardEvent<HTMLElement>) => void;
  handleClear: () => void;
  focus?: boolean;
};

class SearchBar extends React.Component<Props> {
  containerRef: HTMLDivElement | null = null;

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    handleBlur: () => {},
    handleTab: () => {},
    handleShiftTab: () => {},
    handleClear: () => {},
  };

  componentDidMount() {
    const element = document.getElementById('search-bar-expanded-input');
    if (element) {
      element.focus();
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { handleChange } = this.props;
    const { value } = e.target;
    handleChange(value);
  };

  handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent blur event
    const { handleSubmit } = this.props;
    handleSubmit();
  };

  handleClear = () => {
    const { router } = this.context;
    const {
      location: { query, pathname },
      params,
    } = router;
    const { handleBlur, handleClear } = this.props;

    if (!query.q) {
      // No query so there is no active search yet, just blur it.
      handleBlur();
    }

    handleClear();
    // Otherwise there is an active search, transition to no search at all.
    delete query.q;
    router.push({
      pathname,
      params,
      query,
    });
  };

  handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const { handleBlur } = this.props;
    if (handleBlur && e.relatedTarget) {
      // relatedTarget is the element receiveing focus
      // this checks if the focus onBlur is leaving the container, if it is trigger a blur
      if (!this.containerRef?.contains(e.relatedTarget as Node)) {
        handleBlur();
      }
    }
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { handleSubmit, handleBlur, handleShiftTab } = this.props;
    switch (e.key) {
      case 'Enter': {
        handleSubmit();
        break;
      }
      case 'Tab': {
        if (e.shiftKey && handleBlur) {
          handleBlur();
          handleShiftTab(e);
        }
        break;
      }
      default:
        break;
    }
  };

  handleClearKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const { handleBlur, handleShiftTab } = this.props;
    switch (e.key) {
      case 'Enter': {
        this.handleClear();
        break;
      }
      case 'Tab': {
        if (e.shiftKey && handleBlur) {
          handleBlur();
          handleShiftTab(e);
        }
        break;
      }
      default:
        break;
    }
  };

  submitKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const { handleTab, handleShiftTab, handleSubmit } = this.props;
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        handleShiftTab(e);
      } else {
        handleTab(e);
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      handleSubmit();
    }
  };

  render() {
    const { query } = this.props;
    const closeIcon = (
      <i
        role="button"
        onMouseDown={this.handleClear}
        tabIndex={0}
        onKeyDown={this.handleClearKeyDown}
        className="cif-cancel-hint close-icon"
        aria-label={_t('Clear Search')}
      />
    );

    return (
      <div
        className="rc-ForumsV2__SearchBar search-bar expand-block expanded flex-1"
        ref={(ref) => (this.containerRef = ref)}
        onBlur={this.handleBlur}
      >
        <div className="input-area">
          <TrackedTextInput
            trackingName="search_bar"
            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
            value={query}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            placeholder={_t('Search')}
            aria-label={_t('Search Input')}
            className="search-input"
            id="search-bar-expanded-input"
          />
          {typeof query === 'string' && closeIcon}
          <button
            type="button"
            onMouseDown={this.handleSubmitClick}
            onKeyDown={this.submitKeyDown}
            className="search-button"
            aria-label={_t('submit search')}
          >
            <i className="cif-search" />
          </button>
        </div>
      </div>
    );
  }
}

export default SearchBar;
