import { Component } from 'react';
import cn from 'classnames';

import { constructMSAImageUrl } from 'helpers';
import Rating from 'components/Rating';
import LandingPageImage from 'components/landing/LandingPageImage';
import LandingPageLink from 'components/landing/LandingPageLink';
import marketplace from 'cfg/marketplace.json';

import css from 'styles/components/landing/singleReview.scss';

const { search: { msaMelodyImageParams } } = marketplace;

class SingleReview extends Component {
  state = {
    isExpanded: false
  };

  onReadMoreLinkClick = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render() {
    const { singleReview, onTaxonomyComponentClick, shouldLazyLoad, slotIndex } = this.props;
    const {
      comfortRating,
      customerRewardReview,
      link,
      location,
      lookRating,
      imageId,
      name,
      overallRating,
      premierReview,
      productName,
      reviewDate,
      source,
      summary
    } = singleReview;

    const linkProps = {
      'onClick': onTaxonomyComponentClick,
      'data-eventlabel': 'brandReviews',
      'data-eventvalue': link,
      'data-slotindex': slotIndex
    };

    const dateReviewed = new Date(reviewDate);
    const dateFormatOptions = { month: 'long', day: '2-digit', year: 'numeric' };
    const custLocation = location === '' ? null : `from ${location}`;
    const custName = name || 'Zappos Reviewer';
    const imageProps = { src: constructMSAImageUrl(imageId, msaMelodyImageParams), itemProp: 'image', alt: productName, shouldLazyLoad };
    const productImageLink = <LandingPageImage {...imageProps} />;

    let reviewType;
    if (source) {
      reviewType = `Reviewed at ${source}`;
    } else if (customerRewardReview) {
      reviewType = 'Review for Zappos Rewards Points';
    } else if (premierReview) {
      reviewType = 'Premier Review of Free Product';
    }

    const { isExpanded } = this.state;

    return (
      <section
        itemScope
        itemType="http://schema.org/Review">
        <div className={css.imageContainer}>
          <LandingPageLink url={link} {...linkProps}>
            {productImageLink}
          </LandingPageLink>
        </div>
        <article>
          <h3 itemProp="itemReviewed">
            <LandingPageLink url={link} {...linkProps}>
              {productName}
            </LandingPageLink>
          </h3>
          <ul>
            <li
              itemProp="reviewRating"
              itemScope
              itemType="http://schema.org/Rating">
              <span className={css.ratingCategories}>
                Overall
              </span>
              <meta itemProp="bestRating" content="5" />
              <meta itemProp="ratingValue" content={overallRating} />
              <Rating rating={overallRating} />
            </li>
            <li><span className={css.ratingCategories}>Comfort</span> <Rating rating={comfortRating} /></li>
            <li><span className={css.ratingCategories}>Style</span> <Rating rating={lookRating} /></li>
          </ul>
          <div>
            <p itemProp="reviewBody" className={cn(css.summaryPar, { [css.expanded] : isExpanded })}>{summary}</p>
            {summary.length > 100 ? <button type="button" onClick={this.onReadMoreLinkClick.bind(this)}>Read {isExpanded ? 'Less' : 'More'}</button> : null}
          </div>
          <p className={css.reviewerInfo}>
            <span itemProp="author">{custName}</span> {custLocation} on <span itemProp="dateCreated"> {dateReviewed.toLocaleString('en-US', dateFormatOptions)}</span>
          </p>
          <div className={css.reviewTypes}>
            <p>{reviewType}</p>
            { reviewType && <a href="/rewards-reviews">&#40;What&apos;s this?&#41;</a> }
          </div>
        </article>
      </section>
    );
  }
}

export default SingleReview;
