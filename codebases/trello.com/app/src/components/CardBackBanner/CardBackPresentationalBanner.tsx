import React from 'react';
import cx from 'classnames';
import styles from './CardBackPresentationalBanner.less';
import { TrelloBlue50 } from '@trello/colors';

/**
 * Returns a banner that is styled consistently for all CardBackBanners
 *
 * @param {string} bannerImageClass (required) the name of your banner's image; currently views or template
 * *@param {boolean} bannerText (required) pass a formatted string to display next to the image;
 * @param {boolean} testId (optional) A testId to allow for easier testing
 * @param {string} bannerColor (optional) Changes color of banner; pass colors from @trello/colors package.
 * Defaults to TrelloBlue50
 * @param {boolean} hasCover (optional) Alters style based on if card hasCover or not
 * @param {boolean} hasStickers (optional) Alters style based on if card hasStickers or not
 * @param {boolean} boldBannerText (optional) If true, sets text to an h3, else it's a p
 * @example
 * <CardBackPresentationalBanner
 * testId={CardBackId.BirthdayBanner}
 * bannerColor = {Purple100}
 * bannerImageClass = {styles.birthdayCakeImage}
 * primaryBannerText = {format('happy-birthday')}
 * hasCover={card?.cover}
 * hasStickers={card?.stickers?.length > 0}
 * >
 * <Button/><Popover/>
 * </CardBackPresentationalBanner>
 */

interface CardBackPresentationalBannerProps {
  bannerImageClass: 'template' | 'views';
  bannerText: string;
  hasCover?: boolean;
  hasStickers?: boolean;
  testId?: string;
  bannerColor?: string;
  boldBannerText?: boolean;
}

export const CardBackPresentationalBanner: React.FunctionComponent<CardBackPresentationalBannerProps> = ({
  hasCover,
  hasStickers,
  bannerImageClass,
  testId,
  children,
  bannerText,
  boldBannerText,
  bannerColor = TrelloBlue50,
}) => {
  return (
    <div
      style={{
        backgroundColor: bannerColor,
      }}
      className={cx(styles.cardBanner, {
        [styles.hasCover]: hasCover,
        [styles.hasStickers]: hasStickers,
      })}
      data-test-id={testId}
    >
      <div className={styles.mainBannerContents}>
        <span
          className={cx(
            styles.bannerImage,
            bannerImageClass === 'template' && styles.template,
            bannerImageClass === 'views' && styles.views,
          )}
        />
        {boldBannerText ? (
          <h3 className={styles.textContainer}>{bannerText}</h3>
        ) : (
          <p className={styles.textContainer}>{bannerText}</p>
        )}
        {children}
      </div>
    </div>
  );
};
