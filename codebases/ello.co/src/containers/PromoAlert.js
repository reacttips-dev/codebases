import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { closePromoAlert } from '../actions/gui';
import { closeModal } from '../actions/modals';
import { css, media, descendent } from '../styles/jss';

export function mapStateToProps() {
  return {};
}

const promoAlertStyle = css(
  {
    position: 'fixed',
    top: '50%',
    margin: 'auto',
    transform: 'translateX(50%) translateY(-50%)',
    backgroundColor: 'rgb(0, 0, 0, 0.9)',
    padding: '48px',
    maxWidth: '30rem',
    zIndex: '9999',
    // Optional background image
    // background: 'url(/static/images/alerts/promo-alert-bg.jpg) no-repeat center center',
    // backgroundSize: 'cover',
    // paddingTop: '176px',
  },

  descendent('h2,p', {
    color: 'white',
  }),

  descendent('h2', {
    fontSize: '1.5rem',
    lineHeight: '1',
  }),

  descendent('p', {
    fontSize: '0.875rem',
  }),

  descendent('.actions', {
    textAlign: 'center',
    marginTop: '2rem',
  }),

  descendent('button', {
    width: '100%',
    marginBottom: '1rem',
    height: '3.75rem',
    lineHeight: '3.75rem',
    paddingRight: '1.875rem',
    paddingLeft: '1.875rem',
    fontSize: '0.875rem',
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(0, 209, 0)',
    borderRadius: '0.3125rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgb(0, 209, 0)',
    borderImage: 'initial',
    transition: 'background-color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, border-color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, color 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s, width 0.2s cubic-bezier(0.23, 1, 0.32, 1) 0s',
  }),

  descendent('button:hover, button:focus, button:active', {
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(0, 177, 0)',
    borderColor: 'rgb(0, 177, 0)',
  }),

  media('screen and (max-width: 30rem)', {
    overflow: 'auto',
    width: '100vw',
    height: '100vh',
    maxWidth: 'none',
  }),
)

class PromoAlert extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
  };

  static defaultProps = {};

  onClickAccept = () => {
    const win = window.open(this.props.url, '_blank');
    win.focus();
    this.closeModalAndAlert();
  };

  onClickClose = (e) => {
    e.preventDefault();
    this.closeModalAndAlert();
  };

  closeModalAndAlert = () => {
    const { dispatch } = this.props;
    dispatch(closePromoAlert());
    dispatch(closeModal());
  };

  render() {
    return (
      <div className={promoAlertStyle}>
        <h2>Advance Your Creative Career!</h2>
        <p>
          Learn how to create Augmented Reality effects from the pros. Sign up
          for Facebook’s Spark AR Labs for FREE instructional sessions and take
          your creative to the next level.
        </p>
        <div className="actions">
          <button onClick={this.onClickAccept}>
            Sign up
          </button>
          <a href="#nothanks" onClick={this.onClickClose}>
            No, thanks
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(PromoAlert);
