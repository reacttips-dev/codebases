import React from 'react';
import styles from './ContentHeader.sass';
import OutboundLink from '../../../../../OutboundLink';
import InfoButtonIcon from '../../../../../InfoButtonIcon';
import If from '../../../../../../shared/If';

const ContentHeaderMobile = ({
  headerTitle,
  podcastImageUrl,
  podcastName,
  podcastAuthor,
  contentDescription,
  hasMobileStyling,
  confirmationCode,
  isShowingLearnMoreLink,
}) => (
  <React.Fragment>
    <div className={styles.headerTitleSectionMobile}>
      {headerTitle}
      <If
        condition={isShowingLearnMoreLink}
        ifRender={() => (
          <OutboundLink newWindow to="https://anch.co/becomeasupporter">
            <InfoButtonIcon className={styles.learnMoreLinkIcon} />
          </OutboundLink>
        )}
      />
    </div>
    <div>
      <div className={styles.podcastInfoMobile}>
        <div className={styles.podcastImageContainerMobile}>
          <img className={styles.podcastImageMobile} src={podcastImageUrl} />
        </div>
        <div className={styles.podcastTitleAndAuthorContainerMobile}>
          <div className={styles.podcastNameSectionMobile}>{podcastName}</div>
          <div className={styles.authorSectionMobile}>
            A podcast by {podcastAuthor}
          </div>
        </div>
      </div>
      <div className={styles.contentDescriptionMobile}>
        {contentDescription}
      </div>
      <If
        condition={confirmationCode}
        ifRender={() => (
          <div className={styles.confirmationNumberContainerMobile}>
            <div>Confirmation number: {confirmationCode}</div>
          </div>
        )}
      />
    </div>
  </React.Fragment>
);

const ContentHeaderDesktop = ({
  headerTitle,
  podcastImageUrl,
  podcastName,
  podcastAuthor,
  isMessageFromCreator,
  contentDescription,
  hasMobileStyling,
  isShowingLearnMoreLink,
  confirmationCode,
}) => (
  <div>
    <div className={styles.podcastInfoDesktop}>
      <div className={styles.podcastImageContainerDesktop}>
        <img className={styles.podcastImageDesktop} src={podcastImageUrl} />
      </div>
      <div className={styles.podcastTitleAndAuthorContainerDesktop}>
        <div className={styles.headerTitleSectionDesktop}>
          {headerTitle}
          <If
            condition={isShowingLearnMoreLink}
            ifRender={() => (
              <OutboundLink newWindow to="https://anch.co/becomeasupporter">
                <InfoButtonIcon className={styles.learnMoreLinkIcon} />
              </OutboundLink>
            )}
          />
        </div>
        <div className={styles.titleSectionDesktop}>{podcastName}</div>
        <div className={styles.authorSectionDesktop}>
          A podcast by {podcastAuthor}
        </div>
        {!isMessageFromCreator && (
          <div className={styles.contentDescriptionDesktop}>
            {contentDescription}
          </div>
        )}
        <If
          condition={confirmationCode}
          ifRender={() => (
            <div className={styles.confirmationNumberContainerDesktop}>
              Confirmation number: {confirmationCode}
            </div>
          )}
        />
      </div>
    </div>
    {isMessageFromCreator && (
      <div className={styles.contentDescriptionDesktop}>
        {contentDescription}
      </div>
    )}
  </div>
);

const ContentHeader = ({
  headerTitle,
  podcastImageUrl,
  podcastName,
  podcastAuthor,
  contentDescription,
  hasMobileStyling,
  isMessageFromCreator,
  isShowingLearnMoreLink,
  confirmationCode,
}) => (
  <div
    className={`${styles.root} ${hasMobileStyling ? styles.rootMobile : ''}`}
  >
    {hasMobileStyling ? (
      <ContentHeaderMobile
        headerTitle={headerTitle}
        podcastImageUrl={podcastImageUrl}
        podcastName={podcastName}
        podcastAuthor={podcastAuthor}
        contentDescription={contentDescription}
        isShowingLearnMoreLink={isShowingLearnMoreLink}
        confirmationCode={confirmationCode}
      />
    ) : (
      <ContentHeaderDesktop
        headerTitle={headerTitle}
        podcastImageUrl={podcastImageUrl}
        podcastName={podcastName}
        podcastAuthor={podcastAuthor}
        contentDescription={contentDescription}
        isMessageFromCreator={isMessageFromCreator}
        isShowingLearnMoreLink={isShowingLearnMoreLink}
        confirmationCode={confirmationCode}
      />
    )}
  </div>
);

export default ContentHeader;
