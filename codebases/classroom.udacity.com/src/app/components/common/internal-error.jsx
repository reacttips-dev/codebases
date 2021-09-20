import React, { PureComponent } from 'react';
import { Button } from '@udacity/veritas-components';
import IconNotFound from 'images/icons/icon-notfound.svg';
import Layout from 'components/common/layout';
import { Link } from 'react-router';
import { __ } from 'services/localization-service';
import styles from './internal-error.scss';

class InternalError extends PureComponent {
  render() {
    return (
      <Layout documentTitle={__('Page Not Found')}>
        <section styleName="error">
          <div styleName="contain">
            <div styleName="image">
              <img alt="not found" src={IconNotFound} />
            </div>
            <div styleName="content">
              <h3 styleName="description">
                {__(
                  this.props.message ||
                    "Sorry, we can't seem to find the page you are looking for."
                )}
              </h3>
              <Link to="/me">
                <Button variant="primary" label={__('Return Home')} />
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}

export default cssModule(InternalError, styles);
