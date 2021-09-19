import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import template from 'lodash.template';

import { trackErrorToMartyPixel } from 'actions/errors';
import SiteAwareMetadata from 'components/SiteAwareMetadata';
import { trackErrorIfNew, trackErrorPageToMartyPixel } from 'common/componentHooks';

import css from 'styles/components/error/errorPage.scss';

export class ErrorPage extends Component {
  static propTypes = {
    error: PropTypes.object
  };

  static contextTypes = {
    testId: PropTypes.func,
    marketplace: PropTypes.object
  };

  componentDidMount() {
    const { error, trackErrorToMartyPixel } = this.props;
    trackErrorPageToMartyPixel(error, trackErrorToMartyPixel);
  }

  componentDidUpdate(prevProps) {
    trackErrorIfNew(prevProps.error, this.props.error);
  }

  makeBubbleNav = () => {
    const { testId } = this.context;

    return (
      <ul className={css.bubbleNav} data-test-id={testId('topBubbleNav')}>
        <li><Link to="/" data-test-id={testId('bubbleNavHomePage')}>Home Page</Link></li>
        <li><Link to="/brands" data-test-id={testId('bubbleNavShopBrands')}>Shop Brands</Link></li>
        <li><Link to="/womens" data-test-id={testId('bubbleNavShopWomen')}>Shop Women</Link></li>
        <li><Link to="/mens" data-test-id={testId('bubbleNavShopMen')}>Shop Men</Link></li>
        <li><Link to="/shoes" data-test-id={testId('bubbleNavShopShoes')}>Shop Shoes</Link></li>
        <li><Link to="/contact-us" data-test-id={testId('bubbleNavContactUs')}>Contact Us</Link></li>
      </ul>
    );
  };

  make404 = () => {
    const {
      marketplace: { error: { showGraphics } },
      testId
    } = this.context;

    return (
      <div className={css.container404}>
        <h1 data-test-id={testId('heading404')}>We're So Sorry!</h1>
        <p>We can't seem to find this page. { showGraphics && <>Try searching or use the links below:</> }</p>

        { showGraphics &&
          <>
            { this.makeBubbleNav() }
            <p className={css.graphic}>
            Learn more about our products, along with simple ways to live your best life.
              <a href="/beyondthebox?utm_campaign=zappos&utm_medium=error-page&utm_source=404" data-test-id={testId('404Link')}>Go Beyond the Box</a>
            </p>
          </>
        }
      </div>
    );
  };

  make500 = () => {
    const {
      marketplace: { error: { showGraphics } },
      testId
    } = this.context;

    return (
      <div className={css.container500}>
        <h1 data-test-id={testId('heading500')}>Oh No!</h1>
        <p>An unexpected error has occurred. { showGraphics && <>Try a search or use these links:</> }</p>

        { showGraphics &&
          <>
            { this.makeBubbleNav() }
            <p className={css.graphic}>
            More than just retail, see what makes our company - and culture - tick.
              <a href="/about?utm_campaign=zappos&utm_medium=error-page&utm_source=500" data-test-id={testId('500Link')}>Explore Zappos Stories</a>
            </p>
          </>
        }
      </div>
    );
  };

  render() {
    const { error, isVip } = this.props;
    const errorCode = error && error.statusCode;

    const {
      testId,
      marketplace: {
        phoneNumber,
        phoneNumberVip,
        error: {
          contactVerbiage
        } = {}
      }
    } = this.context;

    const number = isVip ? phoneNumberVip : phoneNumber;

    const contactMessage = contactVerbiage && template(contactVerbiage)({ phoneNumber: number });

    return (
      <SiteAwareMetadata>
        <div className={css.container}>
          { errorCode === 404 && this.make404() }
          { errorCode === 500 && this.make500() }

          { contactMessage &&
            <p
              className={css.contact}
              data-test-id={testId('contactUs')}
              dangerouslySetInnerHTML={{ __html: contactMessage }} />
          }
        </div>
      </SiteAwareMetadata>
    );
  }
}

const mapStateToProps = ({ rewards }) => ({
  isVip: rewards?.rewardsInfo?.isVipOrConsented
});

export default connect(mapStateToProps, { trackErrorToMartyPixel })(ErrorPage);
